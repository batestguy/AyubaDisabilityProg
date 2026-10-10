import test from 'node:test';
import assert from 'node:assert/strict';
import { freshSharedDemo, updateSharedDemo, loadSharedDemo, saveSharedDemo, USER_DEMO_BACKUP_KEY } from './sharedDemo';
import { freshDemo, syncLearner, submitSupport, submitTeaching, submitWork, USER_DEMO_KEY, USER_LEARNER_ID, type TeachingInput } from './userDemo';
import { enrol, updateEnrolment } from './store';
import { decideReview, reviewRecord, respondToSupport, respondToTeaching, reviewStatusLabel, type ReviewDecisionInput, type ReviewKind, type ReviewStatus } from './reviewDemo';
const rubric = { skill: true, examples: true, explanation: true, accessibility: true };
const input: TeachingInput = { route: 'experience', skill: 'Sewing', examples: 'Three garments', explanation: 'Step by step', accessibility: 'Text and audio' };
function teaching(route: TeachingInput['route'] = 'experience') {
  let s = freshSharedDemo(); let d = syncLearner({ ...s.user, profile: { ...s.user.profile, name: 'Learner' } });
  let skill = input.skill;
  if (route === 'progression') {
    const c = d.learning.courses[0]; d.learning = enrol(d.learning, USER_LEARNER_ID, c.id); const e = d.learning.enrolments[0];
    d = submitWork(d, e.id, 'Demonstrated evidence'); d.learning = updateEnrolment(d.learning, e.id, { lessons: c.lessons.map((_, i) => i), scores: [100], approved: true }); skill = c.skills[0];
  }
  d = submitTeaching(d, { ...input, route, skill }).demo; s = updateSharedDemo(s, d); return s;
}
function support() { const s = freshSharedDemo(); return updateSharedDemo(s, submitSupport({ ...s.user, support: [{ id: 'need', need: 'Device', available: 'Shared phone', priority: 'High' }] })); }
function decision(s: ReturnType<typeof freshSharedDemo>, kind: ReviewKind, outcome: ReviewStatus): ReviewDecisionInput {
  const r = reviewRecord(s, kind)!;
  return { kind, submissionId: r.submission.id, expectedRevision: r.submission.revision, outcome, reason: 'Recorded demo decision', reviewer: 'Demo administrator', ...(kind === 'teaching' ? { checklist: rubric } : {}) };
}
function storage(run: (data: Map<string, string>) => void) {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'sessionStorage'); const data = new Map<string, string>([['mosaic-v1', 'sandbox']]);
  Object.defineProperty(globalThis, 'sessionStorage', { configurable: true, value: { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => data.set(k, v), removeItem: (k: string) => data.delete(k) } });
  try { run(data); } finally { if (descriptor) Object.defineProperty(globalThis, 'sessionStorage', descriptor); else Reflect.deleteProperty(globalThis, 'sessionStorage'); }
}
test('wave1 schema2 without reviews normalizes additively, preserving historical snapshots and backup', () => storage(data => {
  const s = teaching(); delete s.reviews; const raw = JSON.stringify(s); data.set(USER_DEMO_KEY, raw); data.set(USER_DEMO_BACKUP_KEY, 'exact historical legacy backup');
  const a = loadSharedDemo(); assert.equal(a.recovery, undefined); assert.deepEqual(a.session.reviews, { decisions: [], roster: [] }); assert.deepEqual(a.session.submissions, s.submissions); assert.deepEqual(a.session.user, JSON.parse(JSON.stringify(s.user)));
  assert.deepEqual(loadSharedDemo().session, a.session); assert.equal(saveSharedDemo(a.session), true); assert.equal(data.get(USER_DEMO_BACKUP_KEY), 'exact historical legacy backup'); assert.equal(data.get('mosaic-v1'), 'sandbox');
}));
test('both teaching routes support needs-changes responses, approval rubric and demo-only roster', () => {
  for (const route of ['experience', 'progression'] as const) {
    let s = teaching(route); const learning = structuredClone(s.user.learning), first = structuredClone(s.submissions[0]);
    const original = decision(s, 'teaching', 'needs-changes'); s = decideReview(s, original).session;
    assert.equal(reviewRecord(s, 'teaching')!.status, 'needs-changes'); assert.deepEqual(s.user.learning, learning); assert.deepEqual(s.submissions[0], first);
    const application = s.user.teaching!;
    assert.ok(respondToTeaching(s, { ...application, route: route === 'experience' ? 'progression' : 'experience' }, 'Response').error);
    assert.ok(respondToTeaching(s, application, ' ').error);
    const r = respondToTeaching(s, { ...application, examples: 'Revised examples' }, 'I added examples'); assert.equal(r.error, undefined); s = r.session;
    assert.equal(reviewRecord(s, 'teaching')!.status, 'resubmitted'); assert.equal(s.submissions.length, 2); assert.deepEqual(s.submissions[0], first); assert.equal(s.user.teaching!.response, 'I added examples'); assert.equal(s.user.teaching!.route, route);
    assert.ok(respondToTeaching(s, application, 'Duplicate').error); assert.ok(decideReview(s, original).error);
    for (const key of Object.keys(rubric) as (keyof typeof rubric)[]) assert.ok(decideReview(s, { ...decision(s, 'teaching', 'approved'), checklist: { ...rubric, [key]: false } }).error);
    const revisedLearning = structuredClone(s.user.learning), snapshots = structuredClone(s.submissions); const approve = decision(s, 'teaching', 'approved'); const approved = decideReview(s, approve); assert.equal(approved.error, undefined); s = approved.session;
    assert.equal(reviewRecord(s, 'teaching')!.status, 'approved'); assert.equal(s.reviews!.roster.length, 1); assert.equal(s.reviews!.roster[0].scope, 'demo-mentoring'); assert.equal(s.reviews!.roster[0].skill, application.skill); assert.deepEqual(s.user.learning, revisedLearning); assert.deepEqual(s.submissions, snapshots); assert.equal(decideReview(s, approve).session, s);
    assert.ok(decideReview(s, { ...approve, reason: 'Different decision' }).error);
  }
});
test('both routes can be declined without role changes or further response', () => {
  for (const route of ['experience', 'progression'] as const) {
    const s = teaching(route), d = decideReview(s, decision(s, 'teaching', 'declined')).session;
    assert.equal(reviewRecord(d, 'teaching')!.status, 'declined'); assert.deepEqual(d.reviews!.roster, []); assert.deepEqual(d.user.learning, s.user.learning); assert.ok(respondToTeaching(d, d.user.teaching!, 'Retry').error);
  }
});
test('progression response still requires current completed evidence and demonstrated skill', () => {
  let s = teaching('progression'); s = decideReview(s, decision(s, 'teaching', 'needs-changes')).session;
  assert.ok(respondToTeaching(s, { ...s.user.teaching!, skill: 'Unproven skill' }, 'Changed skill').error);
  s = updateSharedDemo(s, submitWork(s.user, s.user.learning.enrolments[0].id, 'New evidence'), { kind: 'work-submitted', recordId: s.user.learning.enrolments[0].id });
  assert.ok(respondToTeaching(s, s.user.teaching!, 'Changed evidence').error);
});
test('support outcomes save decisions, paired followups, exact retries and immutable learning/evidence', () => {
  for (const outcome of ['needs-clarification', 'plan-reviewed', 'declined', 'closed'] as const) {
    const s = support(), before = structuredClone(s); const cmd = { ...decision(s, 'support', outcome), followUpOwner: 'Demo coordinator', followUpDate: '2020-02-29' };
    const result = decideReview(s, cmd); assert.equal(result.error, undefined); const d = result.session;
    assert.equal(reviewRecord(d, 'support')!.status, outcome); assert.deepEqual(d.user, before.user); assert.deepEqual(d.submissions, before.submissions); assert.equal(d.reviews!.decisions[0].followUpDate, '2020-02-29'); assert.equal(d.recordMetadata['support:user-demo-support'].revision, before.recordMetadata['support:user-demo-support'].revision); assert.equal(d.recordMetadata['support:user-demo-support'].assignedReviewerId, cmd.reviewer);
    assert.equal(decideReview(d, cmd).session, d); assert.equal(d.events.length, s.events.length + 1); assert.equal(d.events.at(-1)!.actor, 'administrator');
  }
  const s = support(), cmd = decision(s, 'support', 'closed');
  for (const invalid of [{ reason: '' }, { reason: 'x'.repeat(5001) }, { reviewer: 'x'.repeat(251) }, { followUpOwner: 'Owner' }, { followUpDate: '2026-10-07' }, { followUpOwner: 'Owner', followUpDate: '2026-02-30' }, { outcome: 'approved' as const }]) assert.ok(decideReview(s, { ...cmd, ...invalid }).error);
  assert.ok(decideReview(teaching(), { ...decision(teaching(), 'teaching', 'needs-changes'), followUpOwner: 'Owner', followUpDate: '2026-10-07' }).error);
});
test('support clarification accepts unchanged checklist with new response, blocking repeated submission', () => {
  let s = support(); const first = structuredClone(s.submissions[0]); s = decideReview(s, decision(s, 'support', 'needs-clarification')).session; const oldDecision = structuredClone(s.reviews!.decisions[0]);
  assert.ok(respondToSupport(s, '').error);
  const result = respondToSupport(s, 'I can use a shared phone on weekends.'); assert.equal(result.error, undefined); s = result.session;
  assert.equal(reviewRecord(s, 'support')!.status, 'resubmitted'); assert.equal(s.submissions.length, 2); assert.deepEqual(s.submissions[0], first); assert.deepEqual(s.reviews!.decisions[0], oldDecision); assert.ok(respondToSupport(s, 'I can use a shared phone on weekends.').error);
  const resubmit = submitSupport({ ...s.user, support: [{ ...s.user.support[0], priority: 'Medium' }] }); s = updateSharedDemo(s, resubmit); assert.equal(s.submissions.length, 2); assert.equal(s.user.supportRequest!.items[0].priority, 'High');
  s = decideReview(s, decision(s, 'support', 'needs-clarification')).session; s = updateSharedDemo(s, { ...s.user, support: structuredClone(s.user.supportRequest!.items) }); assert.ok(respondToSupport(s, 'I can use a shared phone on weekends.').error);
  s = respondToSupport(s, 'I added a new response.').session; assert.equal(s.submissions.length, 3);
});
test('ordinary revised support becomes resubmitted and stale snapshot/revision reviews reject', () => {
  let s = support(); const stale = decision(s, 'support', 'plan-reviewed'); s = decideReview(s, stale).session;
  s = updateSharedDemo(s, submitSupport({ ...s.user, support: [{ ...s.user.support[0], priority: 'Medium' }] })); assert.equal(reviewRecord(s, 'support')!.status, 'resubmitted');
  assert.ok(decideReview(s, stale).error); assert.ok(decideReview(s, { ...decision(s, 'support', 'closed'), expectedRevision: 1 }).error);
  assert.equal(s.reviews!.decisions.length, 1); assert.equal(reviewRecord(s, 'support')!.decision, undefined);
});
test('review commands and response histories survive verified save/reload', () => storage(() => {
  let s = teaching(); s = decideReview(s, decision(s, 'teaching', 'needs-changes')).session; s = respondToTeaching(s, { ...s.user.teaching!, examples: 'More examples' }, 'Updated examples.').session; s = decideReview(s, decision(s, 'teaching', 'approved')).session;
  s = updateSharedDemo(s, submitSupport({ ...s.user, support: [{ id: 'need', need: 'Data', available: 'Limited data', priority: 'High' }] })); s = decideReview(s, decision(s, 'support', 'needs-clarification')).session; s = respondToSupport(s, 'I have a phone.').session; s = decideReview(s, decision(s, 'support', 'plan-reviewed')).session;
  assert.equal(saveSharedDemo(s), true); assert.deepEqual(loadSharedDemo().session, JSON.parse(JSON.stringify(s))); assert.equal(reviewStatusLabel('approved', 'teaching'), 'Approved for demo roster'); assert.equal(reviewStatusLabel('plan-reviewed', 'support'), 'Plan reviewed');
}));
test('malformed review state, decision links, roster, response fields preserve saved source', () => storage(data => {
  const base = decideReview(teaching(), decision(teaching(), 'teaching', 'approved')).session;
  // Create the decision against its actual submission, not a distinct fixture.
  const original = teaching(), approved = decideReview(original, decision(original, 'teaching', 'approved')).session;
  const corruptions = [
    (s: typeof approved) => { Object.assign(s, { reviews: null }); },
    (s: typeof approved) => { s.reviews!.decisions[0].submissionId = 'missing'; },
    (s: typeof approved) => { s.reviews!.decisions[0].reviewedRevision += 1; },
    (s: typeof approved) => { s.reviews!.decisions.push(structuredClone(s.reviews!.decisions[0])); },
    (s: typeof approved) => { s.reviews!.roster[0].skill = 'Fabricated skill'; },
    (s: typeof approved) => { s.reviews!.decisions[0].checklist!.skill = false; },
    (s: typeof approved) => { s.reviews!.decisions[0].at = 0; },
    (s: typeof approved) => { Object.assign(s.user.teaching!, { response: 3 }); },
    (s: typeof approved) => { s.user.teaching!.response = 'x'.repeat(5001); },
    (s: typeof approved) => { s.events.at(-1)!.actor = 'user'; },
  ];
  for (const corrupt of corruptions) { const s = structuredClone(approved); corrupt(s); const raw = JSON.stringify(s); data.set(USER_DEMO_KEY, raw); assert.ok(loadSharedDemo().recovery); assert.equal(data.get(USER_DEMO_KEY), raw); assert.equal(saveSharedDemo(s), false); }
  assert.equal(data.get('mosaic-v1'), 'sandbox');
}));

test('another needs-changes cycle rejects unchanged teaching response and evidence', () => {
  let s = teaching(); s = decideReview(s, decision(s, 'teaching', 'needs-changes')).session; s = respondToTeaching(s, s.user.teaching!, 'I clarified the approach.').session;
  s = decideReview(s, decision(s, 'teaching', 'needs-changes')).session; const before = structuredClone(s);
  assert.ok(respondToTeaching(s, s.user.teaching!, 'I clarified the approach.').error); assert.deepEqual(s, before);
  const changed = respondToTeaching(s, { ...s.user.teaching!, explanation: 'A revised teaching approach' }, 'I clarified the approach.'); assert.equal(changed.error, undefined); assert.equal(changed.session.submissions.length, 3);
});
test('support clarification preserves optional blank availability with valid response', () => {
  let s = support(); s = decideReview(s, decision(s, 'support', 'needs-clarification')).session;
  s = updateSharedDemo(s, { ...s.user, support: [{ ...s.user.support[0], available: '' }] });
  const response = respondToSupport(s, 'Please advise on device access.'); assert.equal(response.error, undefined); assert.equal(response.session.user.supportRequest!.items[0].available, '');
});
test('decision checklist is an immutable copy of command input', () => {
  const s = teaching(), cmd = { ...decision(s, 'teaching', 'approved'), checklist: { ...rubric } }; const d = decideReview(s, cmd).session;
  cmd.checklist.skill = false; assert.equal(d.reviews!.decisions[0].checklist!.skill, true);
});
test('reversed or duplicate revision histories preserve source and reject obsolete review commands', () => storage(data => {
  let s = support(); s = decideReview(s, decision(s, 'support', 'needs-clarification')).session; s = respondToSupport(s, 'Clarified request').session;
  const reversed = structuredClone(s); reversed.submissions.reverse(); reversed.user.supportRequest = structuredClone(reversed.submissions.at(-1)!.payload) as typeof reversed.user.supportRequest;
  const raw = JSON.stringify(reversed); data.set(USER_DEMO_KEY, raw); assert.ok(loadSharedDemo().recovery); assert.equal(data.get(USER_DEMO_KEY), raw); assert.ok(decideReview(reversed, decision(reversed, 'support', 'closed')).error);
  const duplicate = structuredClone(s); duplicate.submissions[1].revision = duplicate.submissions[0].revision; const duplicateRaw = JSON.stringify(duplicate); data.set(USER_DEMO_KEY, duplicateRaw); assert.ok(loadSharedDemo().recovery); assert.equal(data.get(USER_DEMO_KEY), duplicateRaw);
}));
test('incomplete historical teaching evidence remains reviewable but cannot be approved', () => storage(data => {
  for (const key of ['skill', 'examples', 'explanation', 'accessibility'] as const) {
    for (const value of [' ', 'x'.repeat(5001)]) {
      const s = teaching(); s.user.teaching![key] = value; (s.submissions.at(-1)!.payload as TeachingInput)[key] = value;
      const raw = JSON.stringify(s); data.set(USER_DEMO_KEY, raw); const loaded = loadSharedDemo(); assert.equal(loaded.recovery, undefined); assert.equal(loaded.session.user.teaching![key], value);
      assert.ok(decideReview(loaded.session, decision(loaded.session, 'teaching', 'approved')).error); assert.equal(decideReview(loaded.session, decision(loaded.session, 'teaching', 'needs-changes')).error, undefined);
    }
  }
}));
