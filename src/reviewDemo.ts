import type { SharedDemoSession, SubmissionSnapshot } from './sharedDemo';
import { updateSharedDemo } from './sharedDemo';
import { uid } from './store';
import { submitTeaching, type TeachingInput } from './userDemo';
import { validReviewInput, validText, validChecklist } from './reviewValidation';
export type ReviewKind = 'support' | 'teaching';
export type ReviewStatus = 'pending' | 'resubmitted' | 'needs-changes' | 'approved' | 'declined' | 'needs-clarification' | 'plan-reviewed' | 'closed';
export type ReviewChecklist = { skill: boolean; examples: boolean; explanation: boolean; accessibility: boolean };
export type ReviewDecision = { id: string; kind: ReviewKind; recordId: string; submissionId: string; reviewedRevision: number; outcome: ReviewStatus; reason: string; reviewer: string; at: number; checklist?: ReviewChecklist; followUpOwner?: string; followUpDate?: string };
export type DemoRosterEntry = { id: string; learnerId: string; applicationId: string; decisionId: string; skill: string; approvedAt: number; scope: 'demo-mentoring' };
export type ReviewState = { decisions: ReviewDecision[]; roster: DemoRosterEntry[] };
export type ReviewDecisionInput = { kind: ReviewKind; submissionId: string; expectedRevision: number; outcome: ReviewStatus; reason: string; reviewer: string; checklist?: ReviewChecklist; followUpOwner?: string; followUpDate?: string };
export type ReviewRecord = { kind: ReviewKind; recordId: string; status: ReviewStatus; submission: SubmissionSnapshot; decision?: ReviewDecision; history: ReviewDecision[] };
export function reviewRecord(session: SharedDemoSession, kind: ReviewKind): ReviewRecord | undefined {
  const submission = session.submissions.filter(s => s.kind === kind).at(-1);
  if (!submission) return undefined;
  const history = (session.reviews?.decisions ?? []).filter(d => d.kind === kind && d.recordId === submission.recordId);
  const decision = history.find(d => d.submissionId === submission.id);
  return { kind, recordId: submission.recordId, submission, history, decision, status: decision?.outcome ?? (history.length ? 'resubmitted' : 'pending') };
}
export function reviewStatusLabel(status: ReviewStatus, kind: ReviewKind): string {
  const labels: Record<ReviewStatus, string> = { pending: 'Pending review', resubmitted: 'Resubmitted', 'needs-changes': 'Needs changes', approved: kind === 'teaching' ? 'Approved for demo roster' : 'Approved', declined: 'Declined', 'needs-clarification': 'Needs clarification', 'plan-reviewed': 'Plan reviewed', closed: 'Closed' };
  return labels[status];
}
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
export function decideReview(session: SharedDemoSession, input: ReviewDecisionInput): { session: SharedDemoSession; error?: string } {
  if (!validReviewInput(input)) return { session, error: 'Choose a valid outcome, enter a reason and reviewer, and provide valid paired follow-up details.' };
  if (input.outcome === 'approved' && (!validChecklist(input.checklist) || !Object.values(input.checklist!).every(Boolean))) return { session, error: 'Check all four trainer review criteria before approval.' };
  const record = reviewRecord(session, input.kind);
  if (!record || record.submission.id !== input.submissionId || record.submission.revision !== input.expectedRevision) return { session, error: 'This submission changed. Open the latest evidence before reviewing.' };
  const historySnapshots = session.submissions.filter(s => s.kind === record.kind && s.recordId === record.recordId);
  if (historySnapshots.some((s, index) => index > 0 && s.revision <= historySnapshots[index - 1].revision) || record.submission.revision !== Math.max(...historySnapshots.map(s => s.revision))) return { session, error: 'Submission history is inconsistent. Review the latest saved evidence before deciding.' };
  if (input.kind === 'teaching' && input.outcome === 'approved') {
    const evidence = record.submission.payload as TeachingInput;
    if (![evidence.skill, evidence.examples, evidence.explanation, evidence.accessibility].every(v => validText(v, 5000))) return { session, error: 'Approval requires a skill, supporting examples, teaching explanation and accessible approach, each within 5,000 characters.' };
  }
  const fields = { outcome: input.outcome, reason: input.reason.trim(), reviewer: input.reviewer.trim(), checklist: input.checklist ? { skill: input.checklist.skill, examples: input.checklist.examples, explanation: input.checklist.explanation, accessibility: input.checklist.accessibility } : undefined, followUpOwner: input.followUpOwner?.trim() || undefined, followUpDate: input.followUpDate || undefined };
  if (record.decision) {
    const { outcome, reason, reviewer, checklist, followUpOwner, followUpDate } = record.decision;
    if (same({ outcome, reason, reviewer, checklist, followUpOwner, followUpDate }, fields)) return { session };
    return { session, error: 'This submission already has a decision. A new submission is required for another review.' };
  }
  if (!['pending', 'resubmitted'].includes(record.status)) return { session, error: 'Only pending or resubmitted evidence can be reviewed.' };
  const next = structuredClone(session); next.reviews ??= { decisions: [], roster: [] };
  const decision: ReviewDecision = { id: uid(), kind: input.kind, recordId: record.recordId, submissionId: record.submission.id, reviewedRevision: record.submission.revision, ...fields, at: Date.now() };
  next.reviews.decisions.push(decision);
  next.recordMetadata[`${input.kind}:${record.recordId}`].assignedReviewerId = fields.reviewer;
  next.events.push({ id: uid(), kind: `${input.kind}-reviewed`, recordId: record.recordId, actor: 'administrator', at: decision.at, description: `${reviewStatusLabel(input.outcome, input.kind)}: ${fields.reason}` });
  if (input.kind === 'teaching' && input.outcome === 'approved') {
    const payload = record.submission.payload as TeachingInput;
    next.reviews.roster.push({ id: 'user-demo-trainer', learnerId: 'user-demo', applicationId: record.recordId, decisionId: decision.id, skill: payload.skill, approvedAt: decision.at, scope: 'demo-mentoring' });
  }
  return { session: next };
}
export function respondToTeaching(session: SharedDemoSession, input: TeachingInput, response: string): { session: SharedDemoSession; error?: string } {
  const record = reviewRecord(session, 'teaching');
  if (record?.status !== 'needs-changes' || !session.user.teaching) return { session, error: 'A trainer response is available only when changes were requested.' };
  if (input.route !== session.user.teaching.route) return { session, error: 'Keep the original application route when responding.' };
  if (!validText(response, 5000) || ![input.skill, input.examples, input.explanation, input.accessibility].every(v => validText(v, 5000))) return { session, error: 'Complete the application and response, using no more than 5,000 characters per field.' };
  const validated = submitTeaching({ ...session.user, teaching: undefined }, input);
  if (validated.error) return { session, error: validated.error };
  if (response.trim() === session.user.teaching.response && (['route', 'skill', 'examples', 'explanation', 'accessibility'] as const).every(key => input[key].trim() === session.user.teaching![key].trim())) return { session, error: 'Add a new response or revise the application before resubmitting.' };
  const submittedAt = Date.now();
  const next = { ...validated.demo, teaching: { ...validated.demo.teaching!, submittedAt, response: response.trim() } };
  return { session: updateSharedDemo(session, next) };
}
export function respondToSupport(session: SharedDemoSession, response: string): { session: SharedDemoSession; error?: string } {
  const record = reviewRecord(session, 'support');
  if (record?.status !== 'needs-clarification' || !session.user.supportRequest) return { session, error: 'A support response is available only when clarification was requested.' };
  if (!validText(response, 5000) || !session.user.support.length || !session.user.support.every(i => [i.need, i.priority].every(v => validText(v, 5000)) && typeof i.available === 'string' && i.available.length <= 5000)) return { session, error: 'Complete each support need, priority and response, using no more than 5,000 characters per field.' };
  if (response.trim() === session.user.supportRequest.response && same(session.user.supportRequest.items, session.user.support)) return { session, error: 'Add a new response or revise the checklist before resubmitting.' };
  const d = { ...session.user, supportRequest: { status: 'pending' as const, submittedAt: Date.now(), items: structuredClone(session.user.support), response: response.trim() } };
  return { session: updateSharedDemo(session, d) };
}
