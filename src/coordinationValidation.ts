import type { Course } from './catalogue';
import { skillCategories } from './skillCategories';
import type { SharedDemoSession } from './sharedDemo';
import type { CoordinationState } from './coordinationDemo';
import { coursePublishIssues, isSeedCourse } from './coordinationDemo';
import { validText } from './reviewValidation';
const strings = (v: unknown): v is string[] => Array.isArray(v) && v.every(x => typeof x === 'string');
const time = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && v >= 0;
export function validCourseVersion(value: unknown): value is Course {
  if (!value || typeof value !== 'object') return false;
  const c = value as Course;
  return [c.id, c.title, c.description, c.tag, c.assignment, c.consultantId].every(v => typeof v === 'string') && !!c.id && ['draft', 'review', 'published'].includes(c.status) && strings(c.skills) && (c.category === undefined || skillCategories.some(k => k.id === c.category)) && (c.delivery === undefined || ['foundation', 'self-paced'].includes(c.delivery)) && (c.tools === undefined || strings(c.tools)) && (c.outcome === undefined || typeof c.outcome === 'string') && Array.isArray(c.lessons) && c.lessons.every(l => !!l && typeof l.title === 'string' && typeof l.body === 'string' && [l.resource, l.video, l.transcript].every(v => v === undefined || typeof v === 'string')) && Array.isArray(c.quiz) && c.quiz.every(q => !!q && typeof q.question === 'string' && strings(q.options) && Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length);
}
export function validCoordination(value: unknown, s: SharedDemoSession): value is CoordinationState {
  if (value === undefined) return true;
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const state = value as CoordinationState;
  if (!Array.isArray(state.courseDecisions) || !Array.isArray(state.assignments)) return false;
  const unique = (list: { id: string }[]) => list.every(x => x && validText(x.id, 250)) && new Set(list.map(x => x.id)).size === list.length;
  if (!unique(state.courseDecisions) || !unique(state.assignments) || new Set(state.courseDecisions.map(d => `${d.courseId}:${d.expectedRevision}`)).size !== state.courseDecisions.length) return false;
  const fields = (d: { expectedRevision: number; reason: string; reviewer: string; at: number }) => Number.isInteger(d.expectedRevision) && d.expectedRevision > 0 && validText(d.reason, 5000) && d.reason === d.reason.trim() && validText(d.reviewer, 250) && d.reviewer === d.reviewer.trim() && time(d.at);
  if (state.drafts !== undefined && (!Array.isArray(state.drafts) || !unique(state.drafts) || new Set(state.drafts.map(d => `${d.course?.id}:${d.expectedRevision}`)).size !== state.drafts.length || !state.drafts.every((d, i) => {
    const meta = s.recordMetadata[`course:${d.course?.id}`];
    return validCourseVersion(d.course) && d.course.status === 'review' && !isSeedCourse(d.course.id) && !!meta && (d.expectedRevision === null || (Number.isInteger(d.expectedRevision) && d.expectedRevision > 0)) && d.resultingRevision === (d.expectedRevision ?? 0) + 1 && d.resultingRevision <= meta.revision && validText(d.reason, 5000) && validText(d.reviewer, 250) && validText(d.accessibilityEvidence, 5000) && time(d.at) && (!i || d.at >= state.drafts![i - 1].at) && !!s.reviews?.roster.some(r => r.id === d.course.consultantId && r.approvedAt <= d.at) && s.events.some(e => e.kind === 'course-draft-saved' && e.recordId === d.course.id && e.at === d.at && e.actor === 'administrator');
  }))) return false;
  if (!state.courseDecisions.every((d, i) => {
    const meta = s.recordMetadata[`course:${d.courseId}`];
    return fields(d) && !!meta && ['needs-changes', 'publish', 'archive'].includes(d.outcome) && Number.isInteger(d.resultingRevision) && d.resultingRevision === d.expectedRevision + 1 && d.resultingRevision <= meta.revision && validCourseVersion(d.courseVersion) && d.courseVersion.id === d.courseId && (d.accessibilityEvidence === undefined || validText(d.accessibilityEvidence, 5000)) && (d.outcome !== 'publish' || (coursePublishIssues(s, d.courseVersion, d.accessibilityEvidence).length === 0 && (isSeedCourse(d.courseId) || !!s.reviews?.roster.some(r => r.id === d.courseVersion.consultantId && r.approvedAt <= d.at)))) && (!i || d.at >= state.courseDecisions[i - 1].at) && s.events.some(e => e.kind === 'course-coordinated' && e.recordId === d.courseId && e.at === d.at && e.actor === 'administrator');
  })) return false;
  // The latest reviewed/submitted revision must agree with the available course.
  for (const c of s.user.learning.courses) {
    const meta = s.recordMetadata[`course:${c.id}`];
    const last = state.courseDecisions.filter(d => d.courseId === c.id).at(-1);
    const draft = state.drafts?.filter(d => d.course.id === c.id).at(-1);
    if (last?.resultingRevision === meta?.revision && c.status !== (last.outcome === 'publish' ? 'published' : 'review')) return false;
    if (draft?.resultingRevision === meta?.revision && c.status !== 'review') return false;
  }
  return state.assignments.every((a, i) => {
    const meta = s.recordMetadata[`${a.kind}:${a.recordId}`];
    const roster = s.reviews?.roster.find(r => r.id === a.rosterId);
    const preceding = state.assignments.slice(0, i).filter(prior => prior.kind === a.kind && prior.recordId === a.recordId).at(-1);
    if (a.expectedAssignmentId !== preceding?.id) return false;
    if (!fields(a) || !['course', 'enrolment', 'question'].includes(a.kind) || !meta || a.expectedRevision > meta.revision || !roster || a.at < roster.approvedAt || !validText(a.suitabilityNote, 5000) || a.suitabilityNote !== a.suitabilityNote.trim() || (i > 0 && a.at < state.assignments[i - 1].at)) return false;
    if (a.kind === 'enrolment') {
      const snapshot = s.submissions.find(x => x.id === a.submissionId);
      if (!snapshot || snapshot.kind !== 'work' || snapshot.recordId !== a.recordId || snapshot.revision > a.expectedRevision || a.at < snapshot.recordedAt || s.submissions.some(x => x.kind === 'work' && x.recordId === a.recordId && x.revision > snapshot.revision && x.recordedAt < a.at)) return false;
    } else if (a.submissionId !== undefined) return false;
    return s.events.some(e => e.kind === `${a.kind}-assigned` && e.recordId === a.recordId && e.at === a.at && e.actor === 'administrator');
  });
}
