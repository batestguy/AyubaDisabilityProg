import test from 'node:test';
import assert from 'node:assert/strict';
import { enrol, updateEnrolment } from './store';
import { freshDemo, syncLearner, submitSupport, submitTeaching, submitWork, addToPortfolio, USER_DEMO_KEY, USER_LEARNER_ID } from './userDemo';
import { freshSharedDemo, loadSharedDemo, saveSharedDemo, resetSharedDemo, updateSharedDemo, USER_DEMO_BACKUP_KEY } from './sharedDemo';
function storage(run: (data: Map<string, string>, store: Storage) => void) {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'sessionStorage');
  const data = new Map<string, string>([['mosaic-v1', 'sandbox untouched']]);
  const store = { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => { data.set(key, value); }, removeItem: (key: string) => { data.delete(key); } } as Storage;
  Object.defineProperty(globalThis, 'sessionStorage', { configurable: true, value: store });
  try { run(data, store); } finally { if (descriptor) Object.defineProperty(globalThis, 'sessionStorage', descriptor); else Reflect.deleteProperty(globalThis, 'sessionStorage'); }
}
function fullLegacy() {
  let d = freshDemo(); d.profile.name = 'Preserved learner'; d.onboarded = true; d.editingProfile = true; d.step = 4;
  d = syncLearner(d);
  for (const c of d.learning.courses) {
    d.learning = enrol(d.learning, USER_LEARNER_ID, c.id);
    const e = d.learning.enrolments.find(e => e.courseId === c.id)!;
    d = submitWork(d, e.id, `Evidence ${c.id}`);
    d.learning = updateEnrolment(d.learning, e.id, { lessons: c.lessons.map((_, i) => i), scores: [100], approved: true });
    d = addToPortfolio(d, e.id);
  }
  d.attachments = [{ id: 'attachment1', name: 'sample.pdf', type: 'application/pdf', size: 100, description: 'Description' }];
  d.support = [{ id: 'support1', need: 'Device', available: 'Shared', priority: 'High' }]; d = submitSupport(d);
  d = submitTeaching(d, { route: 'experience', skill: 'Sewing', examples: 'Garments', explanation: 'Steps', accessibility: 'Text' }).demo;
  d.learning.requests.push({ id: 'question1', learnerId: USER_LEARNER_ID, courseId: d.learning.courses[0].id, kind: 'question', text: 'Help?', createdAt: 123, reply: 'Sample answer', repliedAt: 456 });
  d.learning.courses[0].lessons[0].body = 'Authored lesson retained';
  return d;
}
test('full legacy migration preserves every gate, profile, authored content, timestamp and submission, without duplicate reloads', () => storage(data => {
  const d = fullLegacy(); const legacy = structuredClone(d) as unknown as { profile: { categories?: string[] } }; delete legacy.profile.categories;
  const raw = JSON.stringify(legacy); data.set(USER_DEMO_KEY, raw);
  const first = loadSharedDemo(); assert.equal(first.storageOk, true); assert.equal(first.recovery, undefined);
  assert.deepEqual(first.session.user, JSON.parse(JSON.stringify(d))); assert.equal(data.get(USER_DEMO_BACKUP_KEY), raw);
  assert.equal(first.session.submissions.length, 10); assert.equal(first.session.submissions.filter(s => s.kind === 'work').every(s => s.submittedAt === null), true);
  assert.equal(first.session.submissions.find(s => s.kind === 'support')!.submittedAt, d.supportRequest!.submittedAt);
  assert.equal(first.session.events.length, 1);
  assert.deepEqual(loadSharedDemo().session, first.session); assert.equal(data.get('mosaic-v1'), 'sandbox untouched');
  assert.equal(resetSharedDemo(), true); assert.equal(data.has(USER_DEMO_KEY), false); assert.equal(data.has(USER_DEMO_BACKUP_KEY), false); assert.equal(data.get('mosaic-v1'), 'sandbox untouched');
}));
test('legacy course additions retain saved custom content', () => storage(data => {
  const d = freshDemo(); d.learning.courses = d.learning.courses.slice(0, 1); d.learning.courses[0].title = 'My custom title'; data.set(USER_DEMO_KEY, JSON.stringify(d));
  const s = loadSharedDemo().session; assert.equal(s.user.learning.courses.length, 8); assert.equal(s.user.learning.courses[0].title, 'My custom title'); assert.deepEqual(loadSharedDemo().session, JSON.parse(JSON.stringify(s)));
}));
test('invalid, future, duplicate and dangling payloads are preserved and require explicit reset', () => storage(data => {
  const duplicate = freshDemo(); duplicate.attachments = [{ id: 'x', name: 'x', type: 'x', size: 1, description: '' }, { id: 'x', name: 'x', type: 'x', size: 1, description: '' }];
  const dangling = fullLegacy(); dangling.learning.enrolments[0].learnerId = 'missing';
  const corrupt = freshSharedDemo(); corrupt.recordMetadata = {};
  for (const raw of ['broken JSON', JSON.stringify({ schemaVersion: 3 }), JSON.stringify(duplicate), JSON.stringify(dangling), JSON.stringify(corrupt)]) {
    data.set(USER_DEMO_KEY, raw); const result = loadSharedDemo(); assert.ok(result.recovery); assert.equal(result.session.user.profile.name, ''); assert.equal(data.get(USER_DEMO_KEY), raw); assert.equal(data.has(USER_DEMO_BACKUP_KEY), false);
  }
}));
test('inconsistent completion preserves legacy/shared bytes and refuses saves using retained course gates', () => storage(data => {
  const valid = fullLegacy();
  for (const patch of [{ lessons: [] }, { lessons: [0, 0, 0, 0, 0, 0] }, { scores: [69] }, { approved: false }, { submitted: '   ' }]) {
    data.clear();
    const shared = updateSharedDemo(freshSharedDemo(), structuredClone(valid));
    Object.assign(shared.user.learning.enrolments[0], patch);
    for (const value of [shared.user, shared]) {
      const raw = JSON.stringify(value);
      data.set(USER_DEMO_KEY, raw);
      assert.ok(loadSharedDemo().recovery);
      assert.equal(data.get(USER_DEMO_KEY), raw);
      assert.equal(data.has(USER_DEMO_BACKUP_KEY), false);
      data.delete(USER_DEMO_KEY);
    }
    assert.equal(saveSharedDemo(shared), false);
    assert.equal(data.has(USER_DEMO_KEY), false);
  }
  const retained = updateSharedDemo(freshSharedDemo(), structuredClone(valid));
  retained.user.learning.enrolments[0].courseVersion = structuredClone(retained.user.learning.courses[0]);
  retained.user.learning.courses[0].lessons.push({ title: 'Later published lesson', body: 'Existing enrolment retains its original course.' });
  assert.equal(saveSharedDemo(retained), true);
  assert.equal(loadSharedDemo().recovery, undefined);
  data.clear();
  retained.user.learning.enrolments[0].courseVersion!.lessons.push({ title: 'Missing retained lesson', body: 'This version requires another lesson.' });
  assert.equal(saveSharedDemo(retained), false);
}));
test('storage denial and failed migration verification retain original legacy source', () => storage((data, store) => {
  const d = fullLegacy(), raw = JSON.stringify(d); data.set(USER_DEMO_KEY, raw);
  const set = store.setItem; store.setItem = (key, value) => { if (key === USER_DEMO_KEY && JSON.parse(value).schemaVersion === 2) { data.set(key, 'wrong bytes'); } else set(key, value); };
  const r = loadSharedDemo(); assert.equal(r.storageOk, false); assert.ok(r.warning); assert.equal(r.recovery, undefined); assert.equal(r.memoryOnly, true); assert.equal(r.session.user.profile.name, d.profile.name); assert.equal(data.get(USER_DEMO_KEY), raw); assert.equal(data.get(USER_DEMO_BACKUP_KEY), raw);
  Object.defineProperty(globalThis, 'sessionStorage', { configurable: true, get() { throw new Error('Blocked'); } });
  assert.equal(loadSharedDemo().storageOk, false); assert.equal(saveSharedDemo(freshSharedDemo()), false); assert.equal(resetSharedDemo(), false);
}));
test('meaningful edits revise stable records without keystroke events or phantom learner', () => {
  const initial = freshSharedDemo(); assert.equal(updateSharedDemo(initial, initial.user), initial); assert.deepEqual(initial.user.learning.learners, []);
  const edited = updateSharedDemo(initial, { ...initial.user, profile: { ...initial.user.profile, contact: '123' } });
  assert.deepEqual(edited.user.learning.learners, []); assert.equal(edited.recordMetadata['profile:user-demo'].revision, 2); assert.equal(edited.events.length, 0);
  assert.equal(updateSharedDemo(edited, edited.user), edited);
  const named = updateSharedDemo(edited, { ...edited.user, profile: { ...edited.user.profile, name: 'Learner' }, onboarded: true });
  assert.equal(named.user.learning.learners[0].id, USER_LEARNER_ID); assert.equal(named.events[0].kind, 'onboarding-completed');
});
test('support and teaching capture current immutable submissions and unchanged support adds no history', () => {
  let s = freshSharedDemo(); let d = { ...s.user, support: [{ id: 's', need: 'Device', available: 'Shared', priority: 'High' }] };
  s = updateSharedDemo(s, submitSupport(d)); assert.equal(s.submissions.length, 1); assert.equal(updateSharedDemo(s, submitSupport(s.user)), s);
  d = { ...s.user, support: [{ ...s.user.support[0], priority: 'Low' }] }; const old = structuredClone(s.submissions[0]);
  s = updateSharedDemo(s, submitSupport(d)); assert.equal(s.submissions.length, 2); assert.deepEqual(s.submissions[0], old);
  s = updateSharedDemo(s, submitTeaching(s.user, { route: 'experience', skill: 'Skill', examples: 'Evidence', explanation: 'Method', accessibility: 'Text' }).demo);
  assert.equal(s.submissions.length, 3); assert.equal(s.recordMetadata['support:user-demo-support'].revision, 2);
});
test('all8 work intents preserve unchanged submissions and approval/resubmission completion rules', () => storage(() => {
  let s = freshSharedDemo(); let d = syncLearner({ ...s.user, profile: { ...s.user.profile, name: 'Learner' } });
  for (const c of d.learning.courses) {
    d = { ...d, learning: enrol(d.learning, USER_LEARNER_ID, c.id) }; s = updateSharedDemo(s, d); d = s.user;
    const e = d.learning.enrolments.find(e => e.courseId === c.id)!;
    s = updateSharedDemo(s, submitWork(d, e.id, 'Same text'), { kind: 'work-submitted', recordId: e.id });
    const first = structuredClone(s.submissions.at(-1));
    s = updateSharedDemo(s, submitWork(s.user, e.id, 'Same text'), { kind: 'work-submitted', recordId: e.id });
    assert.deepEqual(s.submissions.at(-2), first); assert.equal(s.submissions.at(-1)!.revision, first!.revision + 1);
    s = updateSharedDemo(s, { ...s.user, learning: updateEnrolment(s.user.learning, e.id, { lessons: c.lessons.map((_, i) => i), scores: [100], approved: true }) });
    assert.ok(s.user.learning.enrolments.find(x => x.id === e.id)!.completedAt);
    s = updateSharedDemo(s, submitWork(s.user, e.id, 'Same text'), { kind: 'work-submitted', recordId: e.id });
    assert.equal(s.user.learning.enrolments.find(x => x.id === e.id)!.completedAt, undefined); d = s.user;
  }
  assert.equal(s.submissions.length, 24); assert.equal(s.events.filter(e => e.kind === 'completion-invalidated').length, 8); assert.equal(saveSharedDemo(s), true);
  assert.deepEqual(loadSharedDemo().session, JSON.parse(JSON.stringify(s)));
}));

test('blocked backup writes keep valid migrated session in memory and never overwrite source', () => storage((data, store) => {
  const d = fullLegacy(), raw = JSON.stringify(d); data.set(USER_DEMO_KEY, raw);
  const set = store.setItem; store.setItem = (key, value) => { if (key === USER_DEMO_BACKUP_KEY) throw new Error('Quota'); set(key, value); };
  const result = loadSharedDemo(); assert.equal(result.storageOk, false); assert.ok(result.warning); assert.equal(result.recovery, undefined); assert.equal(result.memoryOnly, true); assert.equal(result.session.user.profile.name, d.profile.name); assert.equal(result.session.submissions.length, 10); assert.equal(data.get(USER_DEMO_KEY), raw);
}));
test('save rejects malformed existing source and corrupt snapshot or event references', () => storage(data => {
  data.set(USER_DEMO_KEY, 'unreadable source'); assert.equal(saveSharedDemo(freshSharedDemo()), false); assert.equal(data.get(USER_DEMO_KEY), 'unreadable source');
  data.delete(USER_DEMO_KEY);
  let s = freshSharedDemo(); s = updateSharedDemo(s, submitSupport({ ...s.user, support: [{ id: 's', need: 'Device', available: '', priority: 'High' }] }));
  const badPayload = structuredClone(s); badPayload.submissions[0].payload = {}; assert.equal(saveSharedDemo(badPayload), false);
  const badReference = structuredClone(s); badReference.events[0].recordId = 'missing'; assert.equal(saveSharedDemo(badReference), false);
  const duplicate = structuredClone(s); duplicate.submissions.push(structuredClone(duplicate.submissions[0])); assert.equal(saveSharedDemo(duplicate), false);
  assert.equal(saveSharedDemo(s), true);
}));

test('invalid optional course rendering fields preserve legacy and shared sources', () => storage(data => {
  for (const invalid of [{ category: 'unknown' }, { delivery: 'unsupported' }, { tools: {} }, { tools: ['ok', 2] }, { outcome: {} }, { lessons: [{ title: 'Lesson', body: 'Body', resource: 3 }] }]) {
    for (const shared of [false, true]) {
      const s = freshSharedDemo(); Object.assign(s.user.learning.courses[0], invalid);
      const raw = JSON.stringify(shared ? s : s.user); data.set(USER_DEMO_KEY, raw);
      const loaded = loadSharedDemo(); assert.ok(loaded.recovery); assert.equal(loaded.warning, undefined); assert.equal(loaded.memoryOnly, undefined); assert.equal(data.get(USER_DEMO_KEY), raw); assert.equal(data.has(USER_DEMO_BACKUP_KEY), false);
    }
  }
}));
test('memory-only migration allows edits and direct retry verifies exact legacy backup before overwrite', () => storage((data, store) => {
  const d = fullLegacy(), raw = JSON.stringify(d); data.set(USER_DEMO_KEY, raw);
  const set = store.setItem;
  store.setItem = (key, value) => { if (key === USER_DEMO_BACKUP_KEY) throw new Error('Quota'); set(key, value); };
  const loaded = loadSharedDemo(); assert.equal(loaded.memoryOnly, true); assert.equal(loaded.recovery, undefined); assert.ok(loaded.warning);
  const edited = updateSharedDemo(loaded.session, { ...loaded.session.user, profile: { ...loaded.session.user.profile, contact: 'Updated in memory' } });
  assert.equal(edited.user.profile.contact, 'Updated in memory'); assert.equal(saveSharedDemo(edited), false); assert.equal(data.get(USER_DEMO_KEY), raw);
  store.setItem = set; assert.equal(saveSharedDemo(edited), true); assert.equal(data.get(USER_DEMO_BACKUP_KEY), raw); assert.equal(loadSharedDemo().session.user.profile.contact, 'Updated in memory');
}));
test('direct save preserves legacy when existing backup differs or backup verification fails', () => storage((data, store) => {
  const raw = JSON.stringify(fullLegacy()); data.set(USER_DEMO_KEY, raw); data.set(USER_DEMO_BACKUP_KEY, 'different retained backup');
  assert.equal(saveSharedDemo(freshSharedDemo()), false); assert.equal(data.get(USER_DEMO_KEY), raw); assert.equal(data.get(USER_DEMO_BACKUP_KEY), 'different retained backup');
  data.delete(USER_DEMO_BACKUP_KEY);
  const set = store.setItem; store.setItem = (key, value) => set(key, key === USER_DEMO_BACKUP_KEY ? 'wrong backup bytes' : value);
  assert.equal(saveSharedDemo(freshSharedDemo()), false); assert.equal(data.get(USER_DEMO_KEY), raw);
}));
test('blocked storage access returns editable memory session without blocking recovery', () => storage(() => {
  Object.defineProperty(globalThis, 'sessionStorage', { configurable: true, get() { throw new Error('Denied'); } });
  const loaded = loadSharedDemo(); assert.equal(loaded.storageOk, false); assert.equal(loaded.memoryOnly, true); assert.ok(loaded.warning); assert.equal(loaded.recovery, undefined);
  assert.equal(updateSharedDemo(loaded.session, { ...loaded.session.user, profile: { ...loaded.session.user.profile, contact: 'Memory change' } }).user.profile.contact, 'Memory change');
}));
test('meaningful non-approval sample feedback has an auditable event and stable roundtrip', () => storage(() => {
  let s = freshSharedDemo(); let d = syncLearner({ ...s.user, profile: { ...s.user.profile, name: 'Learner' } });
  d.learning = enrol(d.learning, USER_LEARNER_ID, d.learning.courses[0].id); const e = d.learning.enrolments[0];
  s = updateSharedDemo(s, submitWork(d, e.id, 'Evidence'), { kind: 'work-submitted', recordId: e.id });
  const feedbackDemo = { ...s.user, learning: updateEnrolment(s.user.learning, e.id, { feedback: 'Please revise', approved: false }) };
  s = updateSharedDemo(s, feedbackDemo);
  const feedback = s.events.filter(event => event.kind === 'sample-practical-feedback'); assert.equal(feedback.length, 1); assert.equal(feedback[0].actor, 'sample trainer'); assert.equal(feedback[0].recordId, e.id);
  assert.equal(updateSharedDemo(s, s.user), s);
  s = updateSharedDemo(s, { ...s.user, learning: updateEnrolment(s.user.learning, e.id, { feedback: 'Add examples', approved: false }) });
  assert.equal(s.events.filter(event => event.kind === 'sample-practical-feedback').length, 2);
  assert.equal(saveSharedDemo(s), true); assert.deepEqual(loadSharedDemo().session, JSON.parse(JSON.stringify(s)));
}));
test('failed primary deletion retains backup for explicit reset recovery', () => storage((data, store) => {
  const raw = JSON.stringify(fullLegacy()); data.set(USER_DEMO_KEY, raw); data.set(USER_DEMO_BACKUP_KEY, raw);
  const remove = store.removeItem; store.removeItem = key => { if (key !== USER_DEMO_KEY) remove(key); };
  assert.equal(resetSharedDemo(), false); assert.equal(data.get(USER_DEMO_KEY), raw); assert.equal(data.get(USER_DEMO_BACKUP_KEY), raw);
}));
