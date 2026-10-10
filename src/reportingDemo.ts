import type { DemoEvent, SharedDemoSession } from './sharedDemo';
import { USER_LEARNER_ID } from './userDemo';
import { uid } from './store';
import { reviewRecord } from './reviewDemo';
import { learnerScorecard } from './scorecardDemo';
import { courseCoordinationStatus } from './coordinationDemo';

export type SampleLearner = { id: string; name: string; state: string; lga: string; onboarded: boolean; createdAt: number; fictional: true };
export type DemoSettings = { sampleLearners: SampleLearner[]; cohortLoadedAt?: number };
export type LearnerRow = { id: string; name: string; state: string; lga: string; onboarded: boolean; fictional: boolean; source: 'user' | 'sample' };
export type ReportScope = 'user' | 'all' | 'samples';
export type ReportMetrics = { scope: ReportScope; namedLearners: number; profileReady: number; userLearners: number; sampleLearners: number; enrolments: number; completed: number; pendingPractical: number; unansweredQuestions: number; supportPending: number; teachingPending: number; roster: number; publishedCourses: number; completionNumerator: number; completionDenominator: number; completionRate: number | null };
export function learnerRows(session: SharedDemoSession): LearnerRow[] {
  const p = session.user.profile;
  return [
    ...(p.name.trim() ? [{ id: USER_LEARNER_ID, name: p.name.trim(), state: p.state, lga: p.lga, onboarded: session.user.onboarded, fictional: false, source: 'user' as const }] : []),
    ...(session.settings?.sampleLearners ?? []).map(s => ({ id: s.id, name: s.name, state: s.state, lga: s.lga, onboarded: s.onboarded, fictional: true, source: 'sample' as const })),
  ];
}
export function reportMetrics(session: SharedDemoSession, scope: ReportScope = 'all'): ReportMetrics {
  const rows = learnerRows(session).filter(r => scope === 'all' || (scope === 'user' ? r.source === 'user' : r.source === 'sample'));
  const userIncluded = scope !== 'samples';
  const enrolments = userIncluded ? session.user.learning.enrolments.filter(e => e.learnerId === USER_LEARNER_ID) : [];
  const completed = enrolments.filter(e => !!e.completedAt).length;
  const pending = (kind: 'support' | 'teaching') => userIncluded && ['pending', 'resubmitted'].includes(reviewRecord(session, kind)?.status ?? '') ? 1 : 0;
  return {
    scope, namedLearners: rows.length, profileReady: rows.filter(r => r.onboarded).length,
    userLearners: rows.filter(r => r.source === 'user').length, sampleLearners: rows.filter(r => r.source === 'sample').length,
    enrolments: enrolments.length, completed, pendingPractical: enrolments.filter(e => !!e.submitted?.trim() && !e.approved).length,
    unansweredQuestions: userIncluded ? session.user.learning.requests.filter(q => q.learnerId === USER_LEARNER_ID && q.kind === 'question' && !q.reply).length : 0,
    supportPending: pending('support'), teachingPending: pending('teaching'),
    roster: userIncluded ? session.reviews?.roster.length ?? 0 : 0,
    publishedCourses: userIncluded ? session.user.learning.courses.filter(c => courseCoordinationStatus(session, c.id) === 'published').length : 0,
    completionNumerator: completed, completionDenominator: enrolments.length,
    completionRate: enrolments.length ? completed / enrolments.length * 100 : null,
  };
}
export function loadSampleCohort(session: SharedDemoSession): SharedDemoSession {
  if (session.settings?.cohortLoadedAt !== undefined || session.settings?.sampleLearners.length) return session;
  const next = structuredClone(session), now = Date.now();
  const locations = [['sample-jos-1', 'Amina (fictional sample)', 'Plateau', 'Jos North', true], ['sample-jos-2', 'Bala (fictional sample)', 'Plateau', 'Jos North', false], ['sample-ikeja', 'Chika (fictional sample)', 'Lagos', 'Ikeja', true], ['sample-chanchaga', 'Dayo (fictional sample)', 'Niger', 'Chanchaga', true], ['sample-abuja', 'Emeka (fictional sample)', 'Federal Capital Territory', 'Abuja Municipal', false]] as const;
  next.settings = { cohortLoadedAt: now, sampleLearners: locations.map(([id, name, state, lga, onboarded]) => ({ id, name, state, lga, onboarded, createdAt: now, fictional: true })) };
  next.recordMetadata['settings:demo-settings'] = { id: 'demo-settings', kind: 'settings', revision: 1, recordedAt: now, assignedReviewerId: null };
  next.events.push({ id: uid(), kind: 'sample-cohort-loaded', recordId: 'demo-settings', actor: 'administrator', at: now, description: 'Explicitly loaded five fictional sample profiles for geographic reporting; no learning or review evidence was added.' });
  return next;
}
export function validSettings(value: unknown, session: SharedDemoSession): value is DemoSettings {
  if (value === undefined) return true;
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const s = value as DemoSettings;
  if (!Array.isArray(s.sampleLearners)) return false;
  const time = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && v >= 0;
  const text = (v: unknown): v is string => typeof v === 'string' && !!v.trim() && v.length <= 250;
  if (new Set(s.sampleLearners.map(l => l?.id)).size !== s.sampleLearners.length || !s.sampleLearners.every(l => !!l && text(l.id) && l.id.startsWith('sample-') && !session.user.learning.learners.some(user => user.id === l.id) && text(l.name) && text(l.state) && text(l.lga) && typeof l.onboarded === 'boolean' && l.fictional === true && time(l.createdAt))) return false;
  if (s.cohortLoadedAt === undefined) return s.sampleLearners.length === 0;
  const meta = session.recordMetadata['settings:demo-settings'];
  return time(s.cohortLoadedAt) && s.sampleLearners.length > 0 && s.sampleLearners.every(l => l.createdAt === s.cohortLoadedAt) && !!meta && meta.recordedAt === s.cohortLoadedAt && session.events.filter(e => e.kind === 'sample-cohort-loaded' && e.recordId === 'demo-settings' && e.actor === 'administrator' && e.at === s.cohortLoadedAt).length === 1;
}
export const reportDefinitions = {
  namedLearners: 'Named User profile plus explicitly loaded fictional sample profiles in the selected scope.',
  profileReady: 'Profiles whose onboarding marker is complete; sample markers are fictional.',
  enrolments: 'Recorded User course enrolments. Fictional sample profiles have no course activity.',
  completed: 'User enrolments carrying a completion timestamp after all lessons, best quiz score of at least 70%, submitted practical work and explicit sample trainer approval.',
  completionRate: 'Completed User enrolments divided by all User enrolments in the selected scope, multiplied by 100. No enrolments gives no rate.',
  pendingPractical: 'User enrolments with submitted practical text and no sample trainer approval.',
  unansweredQuestions: 'User learning questions with no sample trainer reply.',
  supportPending: 'Latest submitted support evidence awaiting a decision; excludes decided or clarification-required requests.',
  teachingPending: 'Latest trainer application evidence awaiting a decision; excludes decided or changes-required applications.',
  catalogue: 'Published courses and approved demo roster entries are shared catalogue counts, shown in User/all scopes; samples have no learning or reviews.',
} as const;
export function buildDemoExport(session: SharedDemoSession, includeSensitive = false) {
  const base = { exportVersion: 1, demoOnly: true, generatedAt: Date.now(), includeSensitive, definitions: reportDefinitions };
  if (includeSensitive) {
    // File contents live outside this session. Also omit accidental binary objects.
    const clean = JSON.parse(JSON.stringify(session, (_key, value: unknown) => {
      if ((typeof Blob !== 'undefined' && value instanceof Blob) || value instanceof ArrayBuffer || ArrayBuffer.isView(value)) return undefined;
      return value;
    })) as SharedDemoSession;
    return { ...base, session: clean };
  }
  const outcome = learnerScorecard(session);
  const ids = new Map(session.user.learning.courses.map((c, i) => [c.id, `course-${i + 1}`]));
  return {
    ...base, metrics: { all: reportMetrics(session), user: reportMetrics(session, 'user'), samples: reportMetrics(session, 'samples') },
    courses: session.user.learning.courses.map(c => ({ reference: ids.get(c.id), status: courseCoordinationStatus(session, c.id) })),
    enrolments: session.user.learning.enrolments.filter(e => e.learnerId === USER_LEARNER_ID).map((e, i) => ({ reference: `enrolment-${i + 1}`, course: ids.get(e.courseId), completed: !!e.completedAt, practicalSubmitted: !!e.submitted?.trim(), practicalApproved: e.approved, lessonsCompleted: new Set(e.lessons).size, bestQuizPercent: Math.max(0, ...e.scores) })),
    outcomeSummary: { supportRecorded: outcome.supportRecorded, supportProvided: outcome.supportProvided, supportReceiptConfirmed: outcome.supportReceiptConfirmed, grantsRecorded: outcome.grantsRecorded, grantAppliedNGN: outcome.grantAppliedNGN, grantAwardedNGN: outcome.grantAwardedNGN, grantPaidNGN: outcome.grantPaidNGN, grantReceiptConfirmed: outcome.grantReceiptConfirmed, followUpsRecorded: outcome.followUpsRecorded, followUpsOpen: outcome.followUpsOpen },
    sampleCohort: { profiles: session.settings?.sampleLearners.length ?? 0, learningEvidence: 0 },
  };
}
export type EventFilters = { from?: string; to?: string; actor?: string; kind?: string };
function utcDate(value: string | undefined): number | undefined {
  if (!value) return undefined;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;
  const at = Date.parse(`${value}T00:00:00.000Z`);
  return Number.isFinite(at) && new Date(at).toISOString().slice(0, 10) === value ? at : NaN;
}
export function filterDemoEvents(session: SharedDemoSession, filters: EventFilters = {}): DemoEvent[] {
  const from = utcDate(filters.from), to = utcDate(filters.to);
  if (Number.isNaN(from) || Number.isNaN(to) || (from !== undefined && to !== undefined && from > to)) return [];
  return session.events.filter(e => (from === undefined || e.at >= from) && (to === undefined || e.at < to + 86400000) && (!filters.actor || filters.actor === 'all' || e.actor === filters.actor) && (!filters.kind || filters.kind === 'all' || e.kind === filters.kind));
}
