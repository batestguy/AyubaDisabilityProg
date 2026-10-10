import type { ReviewDecisionInput, ReviewChecklist, ReviewState, ReviewDecision } from './reviewDemo';
import type { SharedDemoSession } from './sharedDemo';
export const validText = (v: unknown, max: number): v is string => typeof v === 'string' && !!v.trim() && v.length <= max;
export function validChecklist(v: unknown): v is ReviewChecklist {
  return !!v && typeof v === 'object' && ['skill', 'examples', 'explanation', 'accessibility'].every(k => typeof (v as Record<string, unknown>)[k] === 'boolean');
}
function validDate(v: unknown): v is string {
  if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const parsed = Date.parse(`${v}T00:00:00.000Z`);
  return Number.isFinite(parsed) && new Date(parsed).toISOString().slice(0, 10) === v;
}
export function validReviewInput(v: ReviewDecisionInput): boolean {
  if (!v || !['support', 'teaching'].includes(v.kind) || typeof v.submissionId !== 'string' || !v.submissionId || !Number.isInteger(v.expectedRevision) || v.expectedRevision < 1 || !validText(v.reason, 5000) || !validText(v.reviewer, 250)) return false;
  const outcomes = v.kind === 'teaching' ? ['needs-changes', 'approved', 'declined'] : ['needs-clarification', 'plan-reviewed', 'declined', 'closed'];
  if (!outcomes.includes(v.outcome) || (v.checklist !== undefined && (!validChecklist(v.checklist) || v.kind !== 'teaching'))) return false;
  if (v.kind === 'teaching' && (v.followUpOwner !== undefined || v.followUpDate !== undefined)) return false;
  const owner = v.followUpOwner, date = v.followUpDate;
  if ((owner === undefined || owner === '') && (date === undefined || date === '')) return true;
  return validText(owner, 250) && validDate(date);
}
export function validReviews(value: unknown, session: SharedDemoSession): value is ReviewState {
  if (value === undefined) return true; // Historical schema 2 is normalized by the loader.
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const r = value as ReviewState;
  if (!Array.isArray(r.decisions) || !Array.isArray(r.roster)) return false;
  const unique = (list: { id: string }[]) => list.every(x => x && typeof x.id === 'string' && !!x.id) && new Set(list.map(x => x.id)).size === list.length;
  if (!unique(r.decisions) || !unique(r.roster) || new Set(r.decisions.map(d => d.submissionId)).size !== r.decisions.length) return false;
  if (!r.decisions.every((d, index) => {
    if (!validReviewInput({ ...d, expectedRevision: d.reviewedRevision }) || !Number.isFinite(d.at) || d.at < 0 || d.reason !== d.reason.trim() || d.reviewer !== d.reviewer.trim() || (d.followUpOwner !== undefined && d.followUpOwner !== d.followUpOwner.trim())) return false;
    if (index > 0 && d.at < r.decisions[index - 1].at) return false;
    const snapshot = session.submissions.find(s => s.id === d.submissionId);
    if (!snapshot || snapshot.kind !== d.kind || snapshot.recordId !== d.recordId || snapshot.revision !== d.reviewedRevision || d.at < snapshot.recordedAt) return false;
    const subsequent = session.submissions.filter(s => s.kind === d.kind && s.recordId === d.recordId && s.revision > snapshot.revision);
    if (subsequent.some(s => s.recordedAt < d.at)) return false;
    const matchingEvents = session.events.filter(e => e.kind === d.kind + '-reviewed' && e.recordId === d.recordId && e.at === d.at && e.actor === 'administrator');
    if (matchingEvents.length !== r.decisions.filter(other => other.kind === d.kind && other.recordId === d.recordId && other.at === d.at).length) return false;
    const evidence = snapshot.payload as Record<string, unknown>;
    return d.outcome !== 'approved' || (validChecklist(d.checklist) && Object.values(d.checklist).every(Boolean) && [evidence.skill, evidence.examples, evidence.explanation, evidence.accessibility].every(v => validText(v, 5000)));
  })) return false;
  if (!r.roster.every(entry => {
    const decision = r.decisions.find(d => d.id === entry.decisionId);
    const snapshot = session.submissions.find(s => s.id === decision?.submissionId);
    return entry.id === 'user-demo-trainer' && entry.learnerId === 'user-demo' && entry.applicationId === 'user-demo-teaching' && entry.scope === 'demo-mentoring' && !!decision && decision.kind === 'teaching' && decision.outcome === 'approved' && decision.recordId === entry.applicationId && entry.approvedAt === decision.at && (snapshot?.payload as { skill?: unknown })?.skill === entry.skill && validText(entry.skill, 5000);
  })) return false;
  return r.decisions.filter(d => d.kind === 'teaching' && d.outcome === 'approved').every(d => r.roster.some(entry => entry.decisionId === d.id));
}
