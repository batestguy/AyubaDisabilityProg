import { courses, type Course } from './catalogue';
import type { SharedDemoSession } from './sharedDemo';
import { updateSharedDemo } from './sharedDemo';
import { uid } from './store';
import { validText } from './reviewValidation';
import { validCourseVersion } from './coordinationValidation';

export type CourseOutcome = 'needs-changes' | 'publish' | 'archive';
export type CourseDecisionInput = { courseId: string; expectedRevision: number; outcome: CourseOutcome; reason: string; reviewer: string; accessibilityEvidence?: string };
export type CourseDecision = CourseDecisionInput & { id: string; at: number; resultingRevision: number; courseVersion: Course };
export type AssignmentKind = 'course' | 'enrolment' | 'question';
export type LearningAssignmentInput = { kind: AssignmentKind; recordId: string; expectedRevision: number; rosterId: string; suitabilityNote: string; reason: string; reviewer: string; submissionId?: string; expectedAssignmentId?: string };
export type LearningAssignment = LearningAssignmentInput & { id: string; at: number };
export type CourseDraftInput = { course: Course; expectedRevision: number | null; reason: string; reviewer: string; accessibilityEvidence: string };
export type CourseDraftRevision = CourseDraftInput & { id: string; at: number; resultingRevision: number };
export type CoordinationState = { courseDecisions: CourseDecision[]; assignments: LearningAssignment[]; drafts?: CourseDraftRevision[] };
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
export const isSeedCourse = (id: string) => courses.some(c => c.id === id);
export function courseCoordinationStatus(s: SharedDemoSession, id: string): 'draft' | 'review' | 'published' | 'needs-changes' | 'archived' {
  const decision = s.coordination?.courseDecisions.filter(d => d.courseId === id).at(-1);
  if (decision?.outcome === 'archive') return 'archived';
  if (decision?.outcome === 'needs-changes' && decision.resultingRevision === s.recordMetadata[`course:${id}`]?.revision) return 'needs-changes';
  return s.user.learning.courses.find(c => c.id === id)?.status ?? 'draft';
}
export function coursePublishIssues(s: SharedDemoSession, c: Course, accessibilityEvidence = ''): string[] {
  const issues: string[] = [];
  if (!validCourseVersion(c)) return ['The course content is malformed. Complete valid lessons and quiz options before review.'];
  if (!isSeedCourse(c.id) && (!c.category || !c.delivery || !validText(c.outcome, 5000) || (c.delivery === 'foundation' && (!c.tools?.length || !c.tools.every(v => validText(v, 5000)))))) issues.push('Record the skill area, delivery, foundation tools and outcome scope. Foundation study does not establish specialist competence.');
  if (!validCourseVersion(c) || ![c.title, c.description, c.assignment].every(v => validText(v, 20000)) || !c.skills.length || !c.skills.every(v => validText(v, 5000))) issues.push('Complete the course title, description, skills and practical assignment.');
  if (!c.lessons.length || !c.lessons.every(l => validText(l.title, 5000) && validText(l.body, 30000) && (!l.video?.trim() || validText(l.transcript, 30000)))) issues.push('Complete each lesson and provide a transcript for every video.');
  if (!c.quiz.length || !c.quiz.every(q => validText(q.question, 5000) && q.options.length >= 2 && q.options.every(v => validText(v, 5000)) && new Set(q.options.map(v => v.trim().toLowerCase())).size === q.options.length && Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length)) issues.push('Provide valid quiz questions with distinct options and a correct answer.');
  if (!validText(accessibilityEvidence, 5000)) issues.push('Record the accessible teaching review evidence.');
  if (!isSeedCourse(c.id) && !s.reviews?.roster.some(r => r.id === c.consultantId)) issues.push('The course author must be on the approved demo mentoring roster.');
  return issues;
}
export function saveCourseDraft(session: SharedDemoSession, input: CourseDraftInput): { session: SharedDemoSession; error?: string } {
  if (!input || !validCourseVersion(input.course) || !validText(input.reason, 5000) || !validText(input.reviewer, 250) || !validText(input.accessibilityEvidence, 5000) || !session.reviews?.roster.some(r => r.id === input.course.consultantId) || isSeedCourse(input.course.id)) return { session, error: 'Use a new authored course, an approved demo roster author, reason, administrator and accessibility evidence.' };
  const existing = session.user.learning.courses.find(c => c.id === input.course.id);
  const meta = session.recordMetadata[`course:${input.course.id}`];
  const fields: CourseDraftInput = { ...input, course: { ...structuredClone(input.course), status: 'review' }, reason: input.reason.trim(), reviewer: input.reviewer.trim(), accessibilityEvidence: input.accessibilityEvidence.trim() };
  const prior = session.coordination?.drafts?.find(d => d.course.id === input.course.id && d.expectedRevision === input.expectedRevision);
  if (prior) {
    const { id: _id, at: _at, resultingRevision: _revision, ...command } = prior;
    return same(command, fields) ? { session } : { session, error: 'This course changed. Open its latest draft.' };
  }
  if (existing ? !meta || meta.revision !== input.expectedRevision : input.expectedRevision !== null) return { session, error: 'This course changed. Open its latest draft.' };
  if (existing && courseCoordinationStatus(session, existing.id) === 'archived') return { session, error: 'Restore the archived course before revising it.' };
  const demo = structuredClone(session.user);
  demo.learning.courses = existing ? demo.learning.courses.map(c => c.id === existing.id ? fields.course : c) : [...demo.learning.courses, fields.course];
  let next = updateSharedDemo(session, demo);
  if (next === session) return { session, error: 'Revise the course content before submitting another draft.' };
  next.coordination ??= { courseDecisions: [], assignments: [] }; next.coordination.drafts ??= [];
  const draft: CourseDraftRevision = { ...fields, id: uid(), at: Date.now(), resultingRevision: next.recordMetadata[`course:${input.course.id}`].revision };
  next.coordination.drafts.push(draft);
  next.events.push({ id: uid(), kind: 'course-draft-saved', recordId: input.course.id, actor: 'administrator', at: draft.at, description: `Authored course submitted for review: ${fields.reason}` });
  return { session: next };
}
function commandFields(v: { expectedRevision: number; reason: string; reviewer: string }) {
  return Number.isInteger(v.expectedRevision) && v.expectedRevision > 0 && validText(v.reason, 5000) && validText(v.reviewer, 250);
}
export function decideCourse(session: SharedDemoSession, input: CourseDecisionInput): { session: SharedDemoSession; error?: string } {
  if (!input || !commandFields(input) || !['needs-changes', 'publish', 'archive'].includes(input.outcome) || (input.accessibilityEvidence !== undefined && !validText(input.accessibilityEvidence, 5000))) return { session, error: 'Enter a valid course outcome, reason, administrator and accessibility evidence.' };
  const fields = { ...input, reason: input.reason.trim(), reviewer: input.reviewer.trim(), accessibilityEvidence: input.accessibilityEvidence?.trim() };
  const prior = session.coordination?.courseDecisions.find(d => d.courseId === input.courseId && d.expectedRevision === input.expectedRevision);
  if (prior) {
    const { id: _id, at: _at, resultingRevision: _revision, courseVersion: _version, ...command } = prior;
    return same(command, fields) ? { session } : { session, error: 'This course revision already has a decision. Review its latest revision.' };
  }
  const course = session.user.learning.courses.find(c => c.id === input.courseId), meta = session.recordMetadata[`course:${input.courseId}`];
  if (!course || !meta || meta.revision !== input.expectedRevision) return { session, error: 'This course changed. Review its latest revision.' };
  const status = courseCoordinationStatus(session, course.id);
  if (input.outcome === 'archive' && status !== 'published') return { session, error: 'Only a published course can be archived.' };
  if (input.outcome === 'needs-changes' && !['review', 'draft', 'needs-changes'].includes(status)) return { session, error: 'Request changes on a submitted course.' };
  if (input.outcome === 'publish' && status === 'published') return { session, error: 'This course is already published.' };
  if (input.outcome === 'publish') {
    const issues = coursePublishIssues(session, course, fields.accessibilityEvidence);
    if (issues.length) return { session, error: issues.join(' ') };
  }
  const demo = structuredClone(session.user);
  demo.learning.courses = demo.learning.courses.map(c => c.id === course.id ? { ...c, status: input.outcome === 'publish' ? 'published' : 'review' } : c);
  let next = updateSharedDemo(session, demo);
  if (next === session) next = structuredClone(session);
  // A decision is a new course revision even when requesting another revision's changes.
  if (next.recordMetadata[`course:${course.id}`].revision === meta.revision) next.recordMetadata[`course:${course.id}`] = { ...meta, revision: meta.revision + 1, recordedAt: Date.now() };
  next.coordination ??= { courseDecisions: [], assignments: [] };
  const decision: CourseDecision = { ...fields, id: uid(), at: Date.now(), resultingRevision: next.recordMetadata[`course:${course.id}`].revision, courseVersion: structuredClone(course) };
  next.coordination.courseDecisions.push(decision);
  next.events.push({ id: uid(), kind: 'course-coordinated', recordId: course.id, actor: 'administrator', at: decision.at, description: `${input.outcome}: ${fields.reason}` });
  return { session: next };
}
export function currentAssignment(session: SharedDemoSession, kind: AssignmentKind, recordId: string): { assignment: LearningAssignment; stale: boolean } | undefined {
  const assignment = session.coordination?.assignments.filter(a => a.kind === kind && a.recordId === recordId).at(-1);
  if (!assignment) return undefined;
  const latest = session.submissions.filter(s => s.kind === 'work' && s.recordId === recordId).at(-1);
  return { assignment, stale: kind === 'enrolment' ? latest?.id !== assignment.submissionId : session.recordMetadata[`${kind}:${recordId}`]?.revision !== assignment.expectedRevision };
}
export function assignLearning(session: SharedDemoSession, input: LearningAssignmentInput): { session: SharedDemoSession; error?: string } {
  if (!input || !commandFields(input) || !['course', 'enrolment', 'question'].includes(input.kind) || !validText(input.suitabilityNote, 5000) || (input.expectedAssignmentId !== undefined && !validText(input.expectedAssignmentId, 250)) || !session.reviews?.roster.some(r => r.id === input.rosterId)) return { session, error: 'Choose an approved demo roster member and record suitability, reason and administrator.' };
  const fields = { ...input, suitabilityNote: input.suitabilityNote.trim(), reason: input.reason.trim(), reviewer: input.reviewer.trim() };
  const current = currentAssignment(session, input.kind, input.recordId);
  // An exact historical retry never replaces a newer assignment.
  const repeated = session.coordination?.assignments.some(a => {
    const { id: _id, at: _at, ...command } = a;
    return same(command, fields);
  });
  if (repeated) return { session };
  if (input.expectedAssignmentId !== current?.assignment.id) return { session, error: 'This assignment changed. Review the current assignment before replacing it.' };
  const meta = session.recordMetadata[`${input.kind}:${input.recordId}`];
  const exists = input.kind === 'course' ? session.user.learning.courses.some(c => c.id === input.recordId) : input.kind === 'enrolment' ? session.user.learning.enrolments.some(e => e.id === input.recordId && !!e.submitted?.trim()) : session.user.learning.requests.some(q => q.id === input.recordId && !q.reply);
  if (!meta || !exists || meta.revision !== input.expectedRevision) return { session, error: 'This record changed or is unavailable for assignment. Review the latest evidence.' };
  const snapshot = session.submissions.filter(s => s.kind === 'work' && s.recordId === input.recordId).at(-1);
  if (input.kind === 'enrolment' ? !snapshot || snapshot.id !== input.submissionId : input.submissionId !== undefined) return { session, error: 'Choose the latest practical submission; other assignments do not use a practical submission.' };
  const next = structuredClone(session); next.coordination ??= { courseDecisions: [], assignments: [] };
  const assignment = { ...fields, id: uid(), at: Date.now() };
  next.coordination.assignments.push(assignment);
  next.recordMetadata[`${input.kind}:${input.recordId}`].assignedReviewerId = input.rosterId;
  next.events.push({ id: uid(), kind: `${input.kind}-assigned`, recordId: input.recordId, actor: 'administrator', at: assignment.at, description: `Demo assignment: ${fields.reason}` });
  return { session: next };
}
