import { freshDemo, validDemo, syncLearner, USER_DEMO_KEY, USER_LEARNER_ID, type Demo } from './userDemo';
import { uid } from './store';
import { skillCategories } from './skillCategories';
import type { ReviewState } from './reviewDemo';
import { validReviews } from './reviewValidation';
import type { CoordinationState } from './coordinationDemo';
import { validCoordination, validCourseVersion } from './coordinationValidation';
import { validSettings, type DemoSettings } from './reportingDemo';
import type { OutcomeState } from './scorecardDemo';
import { validOutcomes } from './scorecardValidation';

export const USER_DEMO_BACKUP_KEY = 'mosaic-user-demo-v1-backup';
export type RecordMetadata = { id: string; kind: string; revision: number; recordedAt: number; assignedReviewerId: string | null };
export type SubmissionSnapshot = { id: string; kind: 'support' | 'teaching' | 'work'; recordId: string; revision: number; submittedAt: number | null; recordedAt: number; payload: unknown };
export type DemoEvent = { id: string; kind: string; recordId: string; at: number; actor: string; description: string };
export type SharedDemoSession = { schemaVersion: 2; user: Demo; recordMetadata: Record<string, RecordMetadata>; submissions: SubmissionSnapshot[]; events: DemoEvent[]; reviews?: ReviewState; coordination?: CoordinationState; settings?: DemoSettings; outcomes?: OutcomeState };
const equal = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const strings = (v: unknown): v is string[] => Array.isArray(v) && v.every(x => typeof x === 'string');
const number = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && v >= 0;
const ids = (v: { id: string }[]) => v.every(x => typeof x.id === 'string' && !!x.id) && new Set(v.map(x => x.id)).size === v.length;

// Normalize only the two historical additions; never drop an unrecognised record.
function normalizeDemo(value: unknown): Demo | null {
  if (!value || typeof value !== 'object') return null;
  const d = structuredClone(value) as Demo;
  if (d.profile && !('categories' in d.profile)) Object.assign(d.profile, { categories: [] });
  if (!validDemo(d)) return null;
  const s = d.learning;
  if (!ids(s.courses) || !ids(s.learners) || !ids(s.enrolments) || !ids(s.requests) || !ids(d.attachments) || !ids(d.portfolio) || !ids(d.support)) return null;
  if (d.editingProfile !== undefined && typeof d.editingProfile !== 'boolean') return null;
  if (!s.courses.every(c => [c.tag, c.assignment, c.consultantId].every(x => typeof x === 'string') && ['draft', 'review', 'published'].includes(c.status) && (c.category === undefined || skillCategories.some(category => category.id === c.category)) && (c.delivery === undefined || ['foundation', 'self-paced'].includes(c.delivery)) && (c.tools === undefined || strings(c.tools)) && (c.outcome === undefined || typeof c.outcome === 'string') && strings(c.skills) &&
    c.lessons.every(l => !!l && typeof l.title === 'string' && typeof l.body === 'string' && [l.resource, l.video, l.transcript].every(x => x === undefined || typeof x === 'string')) &&
    c.quiz.every(q => !!q && typeof q.question === 'string' && strings(q.options) && Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length))) return null;
  if (!s.learners.every(l => strings(l.skills) && [l.interests, l.needs, l.location, l.qualifications, l.language, l.contact].every(x => typeof x === 'string'))) return null;
  if (!s.enrolments.every(e => (e.courseVersion === undefined || (validCourseVersion(e.courseVersion) && e.courseVersion.id === e.courseId)) && s.learners.some(l => l.id === e.learnerId) && typeof e.assisted === 'boolean' && e.lessons.every(i => Number.isInteger(i) && i >= 0 && i < (e.courseVersion ?? s.courses.find(c => c.id === e.courseId)!).lessons.length) && e.scores.every(x => number(x) && x <= 100) && [e.submitted, e.feedback].every(x => x === undefined || typeof x === 'string') && (e.completedAt === undefined || number(e.completedAt)))) return null;
  if (!s.enrolments.every(e => {
    if (e.completedAt === undefined) return true;
    const course = e.courseVersion ?? s.courses.find(c => c.id === e.courseId)!;
    return course.lessons.every((_, i) => e.lessons.includes(i)) && Math.max(0, ...e.scores) >= 70 && e.approved && !!e.submitted?.trim();
  })) return null;
  if (new Set(s.enrolments.map(e => `${e.learnerId}:${e.courseId}`)).size !== s.enrolments.length) return null;
  if (!s.requests.every(r => !!r && s.learners.some(l => l.id === r.learnerId) && s.courses.some(c => c.id === r.courseId) && ['question', 'mentoring', 'message'].includes(r.kind) && typeof r.text === 'string' && number(r.createdAt) && [r.reply, r.followup].every(x => x === undefined || typeof x === 'string') && (r.repliedAt === undefined || number(r.repliedAt)))) return null;
  if (![s.consultant.id, s.consultant.name, s.consultant.bio, s.consultant.liveLink].every(x => typeof x === 'string') || typeof s.consultant.approved !== 'boolean') return null;
  if (!d.attachments.every(a => number(a.size)) || !d.portfolio.every(p => number(p.createdAt) && s.courses.some(c => c.id === p.courseId))) return null;
  if (d.supportRequest && (!number(d.supportRequest.submittedAt) || !ids(d.supportRequest.items) || !d.supportRequest.items.every(i => !!i && [i.need, i.available, i.priority].every(x => typeof x === 'string')))) return null;
  if (d.teaching && !number(d.teaching.submittedAt)) return null;
  if ([d.supportRequest?.response, d.teaching?.response].some(v => v !== undefined && (typeof v !== 'string' || v.length > 5000))) return null;
  s.courses.push(...freshDemo().learning.courses.filter(c => !s.courses.some(saved => saved.id === c.id)));
  return d;
}
type RecordEntry = { kind: string; id: string; payload: unknown };
function records(d: Demo): RecordEntry[] {
  return [
    { kind: 'profile', id: USER_LEARNER_ID, payload: { profile: d.profile, onboarded: d.onboarded } },
    ...d.learning.learners.map(payload => ({ kind: 'learner', id: payload.id, payload })),
    ...d.learning.courses.map(payload => ({ kind: 'course', id: payload.id, payload })),
    ...d.learning.enrolments.map(payload => ({ kind: 'enrolment', id: payload.id, payload })),
    ...d.learning.requests.map(payload => ({ kind: 'question', id: payload.id, payload })),
    ...d.attachments.map(payload => ({ kind: 'attachment', id: payload.id, payload })),
    ...d.portfolio.map(payload => ({ kind: 'portfolio', id: payload.id, payload })),
    ...(d.supportRequest ? [{ kind: 'support', id: 'user-demo-support', payload: d.supportRequest }] : []),
    ...(d.teaching ? [{ kind: 'teaching', id: 'user-demo-teaching', payload: d.teaching }] : []),
  ];
}
function initial(d: Demo): SharedDemoSession {
  const now = Date.now();
  return { schemaVersion: 2, user: d, recordMetadata: Object.fromEntries(records(d).map(r => [`${r.kind}:${r.id}`, { id: r.id, kind: r.kind, revision: 1, recordedAt: now, assignedReviewerId: null }])), submissions: [], events: [], reviews: { decisions: [], roster: [] }, coordination: { courseDecisions: [], assignments: [] }, settings: { sampleLearners: [] }, outcomes: { updates: [], receipts: [] } };
}
export function freshSharedDemo(): SharedDemoSession { return initial(freshDemo()); }
function validSnapshotPayload(x: SubmissionSnapshot, s: SharedDemoSession): boolean {
  if (!x.payload || typeof x.payload !== 'object') return false;
  const p = x.payload as Record<string, unknown>;
  if (x.kind === 'work') return (p.courseVersion === undefined || (validCourseVersion(p.courseVersion) && p.courseVersion.id === p.courseId)) && p.id === x.recordId && typeof p.learnerId === 'string' && !!s.recordMetadata[`learner:${p.learnerId}`] && typeof p.courseId === 'string' && !!s.recordMetadata[`course:${p.courseId}`] && typeof p.submitted === 'string' && !!p.submitted.trim() && typeof p.approved === 'boolean' && typeof p.assisted === 'boolean' && Array.isArray(p.lessons) && p.lessons.every(i => Number.isInteger(i) && i >= 0) && Array.isArray(p.scores) && p.scores.every(n => number(n) && n <= 100);
  if (p.response !== undefined && (typeof p.response !== 'string' || p.response.length > 5000)) return false;
  if (p.status !== 'pending' || !number(p.submittedAt) || p.submittedAt !== x.submittedAt) return false;
  if (x.kind === 'teaching') return ['experience', 'progression'].includes(p.route as string) && [p.skill, p.examples, p.explanation, p.accessibility].every(v => typeof v === 'string');
  return Array.isArray(p.items) && ids(p.items) && p.items.every(i => i && [i.need, i.available, i.priority].every(v => typeof v === 'string'));
}
const eventRecordKinds: Record<string, string> = {
  'support-outcome-recorded': 'outcome', 'grant-outcome-recorded': 'outcome', 'follow-up-outcome-recorded': 'outcome', 'outcome-receipt-confirmed': 'outcome', 'sample-cohort-loaded': 'settings', 'course-coordinated': 'course', 'course-draft-saved': 'course', 'course-assigned': 'course', 'enrolment-assigned': 'enrolment', 'question-assigned': 'question', 'support-reviewed': 'support', 'teaching-reviewed': 'teaching', 'session-migrated': 'profile', 'onboarding-completed': 'profile', 'support-submitted': 'support', 'teaching-submitted': 'teaching',
  'work-submitted': 'enrolment', 'sample-practical-approved': 'enrolment', 'sample-practical-feedback': 'enrolment', 'course-completed': 'enrolment', 'completion-invalidated': 'enrolment', 'sample-question-replied': 'question',
};
function validShared(value: unknown): value is SharedDemoSession {
  if (!value || typeof value !== 'object') return false;
  const s = value as SharedDemoSession;
  if (s.schemaVersion !== 2 || !normalizeDemo(s.user) || !s.recordMetadata || typeof s.recordMetadata !== 'object' || Array.isArray(s.recordMetadata) || !Array.isArray(s.submissions) || !Array.isArray(s.events)) return false;
  if (!Object.entries(s.recordMetadata).every(([key, m]) => !!m && typeof m.kind === 'string' && !!m.kind && typeof m.id === 'string' && !!m.id && key === `${m.kind}:${m.id}` && Number.isInteger(m.revision) && m.revision > 0 && number(m.recordedAt) && (m.assignedReviewerId === null || typeof m.assignedReviewerId === 'string'))) return false;
  if (!records(s.user).every(r => !!s.recordMetadata[`${r.kind}:${r.id}`])) return false;
  const latestRevisions = new Map<string, { revision: number; recordedAt: number }>();
  for (const snapshot of s.submissions) {
    const key = snapshot.kind + ':' + snapshot.recordId;
    const prior = latestRevisions.get(key);
    if (prior && (snapshot.revision <= prior.revision || snapshot.recordedAt < prior.recordedAt)) return false;
    latestRevisions.set(key, { revision: snapshot.revision, recordedAt: snapshot.recordedAt });
  }
  for (const kind of ['support', 'teaching'] as const) {
    const current = kind === 'support' ? s.user.supportRequest : s.user.teaching;
    const snapshots = s.submissions.filter(x => x.kind === kind);
    if (current && (!snapshots.length || !equal(snapshots.at(-1)!.payload, current))) return false;
    if (!current && snapshots.length) return false;
  }
  return validReviews(s.reviews, s) && validCoordination(s.coordination, s) && validSettings(s.settings, s) && validOutcomes(s.outcomes, s) && ids(s.submissions) && ids(s.events) && s.submissions.every(x => {
    const key = `${x.kind === 'work' ? 'enrolment' : x.kind}:${x.recordId}`;
    const m = s.recordMetadata[key];
    return ['support', 'teaching', 'work'].includes(x.kind) && !!m && Number.isInteger(x.revision) && x.revision > 0 && x.revision <= m.revision && number(x.recordedAt) && (x.submittedAt === null || number(x.submittedAt)) && validSnapshotPayload(x, s);
  }) && s.events.every(x => typeof x.kind === 'string' && typeof x.recordId === 'string' && !!eventRecordKinds[x.kind] && !!s.recordMetadata[`${eventRecordKinds[x.kind]}:${x.recordId}`] && number(x.at) && ['user', 'sample trainer', 'system', 'administrator'].includes(x.actor) && (['support-reviewed', 'teaching-reviewed'].includes(x.kind) ? x.actor === 'administrator' && !!s.reviews?.decisions.some(d => x.kind === d.kind + '-reviewed' && x.recordId === d.recordId && x.at === d.at) : ['support-outcome-recorded', 'grant-outcome-recorded', 'follow-up-outcome-recorded'].includes(x.kind) ? x.actor === 'administrator' && !!s.outcomes?.updates.some(u => u.kind + '-outcome-recorded' === x.kind && u.recordId === x.recordId && u.at === x.at) : x.kind === 'outcome-receipt-confirmed' ? x.actor === 'user' && !!s.outcomes?.receipts.some(r => r.at === x.at && s.outcomes?.updates.some(u => u.id === r.updateId && u.recordId === x.recordId)) : x.kind === 'sample-cohort-loaded' ? x.actor === 'administrator' && x.recordId === 'demo-settings' && x.at === s.settings?.cohortLoadedAt : ['course-coordinated', 'course-draft-saved', 'course-assigned', 'enrolment-assigned', 'question-assigned'].includes(x.kind) ? x.actor === 'administrator' && (x.kind === 'course-draft-saved' || x.kind === 'course-coordinated' ? x.kind === 'course-draft-saved' ? !!s.coordination?.drafts?.some(d => d.course.id === x.recordId && d.at === x.at) : !!s.coordination?.courseDecisions.some(d => d.courseId === x.recordId && d.at === x.at) : !!s.coordination?.assignments.some(a => a.kind + '-assigned' === x.kind && a.recordId === x.recordId && a.at === x.at)) : x.actor !== 'administrator') && typeof x.description === 'string');
}
function event(s: SharedDemoSession, kind: string, recordId: string, actor: string, description: string) {
  s.events.push({ id: uid(), kind, recordId, at: Date.now(), actor, description });
}
function snapshot(s: SharedDemoSession, kind: SubmissionSnapshot['kind'], recordId: string, payload: unknown, submittedAt: number | null) {
  s.submissions.push({ id: uid(), kind, recordId, revision: s.recordMetadata[`${kind === 'work' ? 'enrolment' : kind}:${recordId}`].revision, submittedAt, recordedAt: Date.now(), payload: structuredClone(payload) });
}
export function updateSharedDemo(previous: SharedDemoSession, nextDemo: Demo, intent?: { kind: 'work-submitted'; recordId: string }): SharedDemoSession {
  let d = structuredClone(nextDemo);
  // Freeze enrolled content before any shared course revision, including old sessions.
  d.learning.enrolments = d.learning.enrolments.map(e => {
    const retained = previous.user.learning.enrolments.find(old => old.id === e.id)?.courseVersion;
    if (retained) return { ...e, courseVersion: structuredClone(retained) };
    const before = previous.user.learning.courses.find(c => c.id === e.courseId);
    const after = d.learning.courses.find(c => c.id === e.courseId);
    return !e.courseVersion && before && !equal(before, after) ? { ...e, courseVersion: structuredClone(before) } : e;
  });
  if (d.onboarded || d.profile.name.trim() || d.learning.learners.some(l => l.id === USER_LEARNER_ID)) d = syncLearner(d);
  // A response already back in review cannot be submitted a second time until decided.
  for (const kind of ['support', 'teaching'] as const) {
    const latest = previous.submissions.filter(s => s.kind === kind).at(-1);
    const history = (previous.reviews?.decisions ?? []).filter(r => r.kind === kind);
    if (latest && history.length && !history.some(r => r.submissionId === latest.id)) {
      if (kind === 'support') d.supportRequest = structuredClone(previous.user.supportRequest);
      else d.teaching = structuredClone(previous.user.teaching);
    }
  }
  const work = intent && d.learning.enrolments.find(e => e.id === intent.recordId && e.learnerId === USER_LEARNER_ID && e.submitted?.trim());
  if (equal(previous.user, d) && !work) return previous;
  const s = structuredClone(previous); s.user = d;
  const old = new Map(records(previous.user).map(r => [`${r.kind}:${r.id}`, r.payload]));
  for (const r of records(d)) {
    const key = `${r.kind}:${r.id}`, m = s.recordMetadata[key];
    const changed = !equal(old.get(key), r.payload);
    if (!m) s.recordMetadata[key] = { id: r.id, kind: r.kind, revision: 1, recordedAt: Date.now(), assignedReviewerId: null };
    else if (changed || (work && r.kind === 'enrolment' && r.id === work.id)) s.recordMetadata[key] = { ...m, revision: m.revision + 1, recordedAt: Date.now() };
  }
  if (!previous.user.onboarded && d.onboarded) event(s, 'onboarding-completed', USER_LEARNER_ID, 'user', 'Learner completed onboarding.');
  if (d.supportRequest && !equal(previous.user.supportRequest, d.supportRequest)) {
    snapshot(s, 'support', 'user-demo-support', d.supportRequest, d.supportRequest.submittedAt);
    event(s, 'support-submitted', 'user-demo-support', 'user', 'Support request submitted.');
  }
  if (d.teaching && !equal(previous.user.teaching, d.teaching)) {
    snapshot(s, 'teaching', 'user-demo-teaching', d.teaching, d.teaching.submittedAt);
    event(s, 'teaching-submitted', 'user-demo-teaching', 'user', 'Trainer or mentor application submitted.');
  }
  if (work) { snapshot(s, 'work', work.id, work, Date.now()); event(s, 'work-submitted', work.id, 'user', 'Practical work submitted for sample review.'); }
  for (const e of d.learning.enrolments) {
    const before = previous.user.learning.enrolments.find(x => x.id === e.id);
    if (!before?.approved && e.approved) event(s, 'sample-practical-approved', e.id, 'sample trainer', 'Sample trainer approved practical work.');
    if (e.feedback?.trim() && e.feedback !== before?.feedback && !(e.approved && !before?.approved)) event(s, 'sample-practical-feedback', e.id, 'sample trainer', 'Sample trainer provided practical work feedback.');
    if (!before?.completedAt && e.completedAt) event(s, 'course-completed', e.id, 'system', 'Course completion requirements met.');
    if (before?.completedAt && !e.completedAt) event(s, 'completion-invalidated', e.id, 'system', 'Course completion evidence reset.');
  }
  for (const q of d.learning.requests) {
    const before = previous.user.learning.requests.find(x => x.id === q.id);
    if (q.reply && (q.reply !== before?.reply || q.repliedAt !== before?.repliedAt)) event(s, 'sample-question-replied', q.id, 'sample trainer', 'Sample trainer replied to a question.');
  }
  return s;
}
export function saveSharedDemo(session: SharedDemoSession): boolean {
  let original: string | null = null;
  let storage: Storage | undefined;
  let attempted = false;
  try {
    if (!validShared(session)) return false;
    storage = sessionStorage; original = storage.getItem(USER_DEMO_KEY);
    if (original !== null) {
      const source: unknown = JSON.parse(original);
      if (!validShared(source)) {
        if (!normalizeDemo(source)) return false;
        const backup = storage.getItem(USER_DEMO_BACKUP_KEY);
        if (backup !== null && backup !== original) return false;
        if (backup === null) storage.setItem(USER_DEMO_BACKUP_KEY, original);
        if (storage.getItem(USER_DEMO_BACKUP_KEY) !== original) return false;
      }
    }
    const raw = JSON.stringify({ ...session, reviews: session.reviews ?? { decisions: [], roster: [] }, coordination: session.coordination ?? { courseDecisions: [], assignments: [] }, settings: session.settings ?? { sampleLearners: [] }, outcomes: session.outcomes ?? { updates: [], receipts: [] } });
    attempted = true; storage.setItem(USER_DEMO_KEY, raw);
    const saved = storage.getItem(USER_DEMO_KEY);
    if (saved !== raw || !validShared(JSON.parse(saved))) throw new Error('Verification failed');
    return true;
  } catch {
    if (storage && attempted) { try { if (original === null) storage.removeItem(USER_DEMO_KEY); else storage.setItem(USER_DEMO_KEY, original); } catch { /* Storage may be blocked; retained backup remains available. */ } }
    return false;
  }
}
export type SharedDemoLoadResult = { session: SharedDemoSession; recovery?: string; warning?: string; memoryOnly?: boolean; storageOk: boolean };
export function loadSharedDemo(): SharedDemoLoadResult {
  let raw: string | null;
  try { raw = sessionStorage.getItem(USER_DEMO_KEY); }
  catch { return { session: freshSharedDemo(), storageOk: false, memoryOnly: true, warning: 'Session storage is unavailable. Changes are held in memory.' }; }
  if (raw === null) return { session: freshSharedDemo(), storageOk: true };
  let value: unknown;
  let legacy: Demo | null;
  try {
    value = JSON.parse(raw);
    if (validShared(value)) {
      const d = normalizeDemo(value.user)!;
      const normalized = { ...value, reviews: value.reviews ?? { decisions: [], roster: [] }, coordination: value.coordination ?? { courseDecisions: [], assignments: [] }, settings: value.settings ?? { sampleLearners: [] }, outcomes: value.outcomes ?? { updates: [], receipts: [] } };
      return { session: equal(value.user, d) ? normalized : updateSharedDemo(normalized, d), storageOk: true };
    }
    legacy = normalizeDemo(value);
  } catch { legacy = null; }
  if (!legacy) return { session: freshSharedDemo(), storageOk: true, recovery: 'Saved session is invalid or from an unsupported version. It was preserved; reset explicitly to replace it.' };
  const session = initial(legacy);
  if (legacy.supportRequest) snapshot(session, 'support', 'user-demo-support', legacy.supportRequest, legacy.supportRequest.submittedAt);
  if (legacy.teaching) snapshot(session, 'teaching', 'user-demo-teaching', legacy.teaching, legacy.teaching.submittedAt);
  for (const e of legacy.learning.enrolments) if (e.submitted) snapshot(session, 'work', e.id, e, null);
  event(session, 'session-migrated', USER_LEARNER_ID, 'system', 'Existing User session migrated; historical work submission time is unknown.');
  if (!saveSharedDemo(session)) return { session, storageOk: false, memoryOnly: true, warning: 'Migration could not be saved. Original data was preserved; changes are held in memory. Retry saving when storage is available.' };
  return { session, storageOk: true };
}
export function resetSharedDemo(): boolean {
  try {
    sessionStorage.removeItem(USER_DEMO_KEY);
    if (sessionStorage.getItem(USER_DEMO_KEY) !== null) return false;
    sessionStorage.removeItem(USER_DEMO_BACKUP_KEY);
    return sessionStorage.getItem(USER_DEMO_BACKUP_KEY) === null;
  } catch { return false; }
}
