import test from 'node:test';
import assert from 'node:assert/strict';
import { commandScenario, freshScenario, loadScenario, resetScenario, saveScenario, scenarioComplete, scenarioLearners, scenarioNextStep, validScenario, SCENARIO_KEY, type ActionType, type LearnerId, type ScenarioRole, type ScenarioState } from './teachingScenario';

let serial = 0;
function act(state: ScenarioState, role: ScenarioRole, type: ActionType, learnerId: LearnerId = 'ada', text = 'A meaningful fictional demonstration note') {
 const result = commandScenario(state, { id: `action-${++serial}`, expectedVersion: state.events.length, role, type, learnerId, text });
 assert.equal(result.error, undefined); assert.ok(validScenario(result.state)); return result.state;
}
function storage(run: (data: Map<string, string>) => void) {
 const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'sessionStorage');
 const data = new Map<string, string>([['mosaic-user-demo-v1', 'existing shared records'], ['mosaic-v1', 'existing sandbox']]);
 Object.defineProperty(globalThis, 'sessionStorage', { configurable: true, value: { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => data.set(k, v), removeItem: (k: string) => data.delete(k) } });
 try { run(data); } finally { if (descriptor) Object.defineProperty(globalThis, 'sessionStorage', descriptor); else Reflect.deleteProperty(globalThis, 'sessionStorage'); }
}

test('guided teaching follows role handoffs, immutable evidence and completion gates', () => {
 let s = freshScenario(); const original = structuredClone(s);
 assert.equal(scenarioNextStep(s).role, 'Facilitator');
 s = act(s, 'Facilitator', 'request-changes', 'ada', 'Explain safe filenames and a low-connectivity backup.');
 const decision = structuredClone(s.events[0]); assert.equal(scenarioNextStep(s).role, 'User');
 s = act(s, 'User', 'submit-work', 'ada', 'A clear filename, an offline copy and a safe sample mentoring message.');
 assert.equal(scenarioLearners(s)[0].review, undefined); assert.equal(scenarioNextStep(s).role, 'Administration');
 const denied = commandScenario(s, { id: 'premature-approval', expectedVersion: s.events.length, role: 'Facilitator', type: 'approve-work', learnerId: 'ada', text: 'Approve the newer evidence' });
 assert.ok(denied.error); assert.equal(denied.state, s);
 s = act(s, 'Administration', 'assign-work'); assert.equal(scenarioNextStep(s).role, 'Facilitator');
 s = act(s, 'Facilitator', 'approve-work'); assert.equal(scenarioComplete(scenarioLearners(s)[0]), true);
 assert.deepEqual(s.events[0], decision); assert.deepEqual(original, freshScenario());
 s = act(s, 'Facilitator', 'reply-question', 'sani', 'Save permitted text lessons when connected and read them offline.');
 s = act(s, 'Facilitator', 'refer-support', 'sani', 'Coordinate access to downloadable text materials.');
 assert.equal(scenarioNextStep(s).role, 'Administration');
 s = act(s, 'Administration', 'respond-support', 'sani', 'Plan reviewed; contact the learner to arrange an offline option. No delivery is recorded.');
 assert.match(scenarioNextStep(s).title, /completed handoffs/);
 assert.equal(scenarioLearners(s)[1].reply, s.events[4].text);
 assert.equal(scenarioLearners(s)[1].supportResponse, s.events[6].text);
 s = act(s, 'User', 'submit-work', 'ada'); assert.equal(scenarioComplete(scenarioLearners(s)[0]), false);
 // Practical approval cannot manufacture lesson completion or a passing quiz for Sani.
 s = act(s, 'User', 'submit-work', 'sani'); s = act(s, 'Administration', 'assign-work', 'sani'); s = act(s, 'Facilitator', 'approve-work', 'sani');
 assert.equal(scenarioLearners(s)[1].review, 'approved'); assert.equal(scenarioComplete(scenarioLearners(s)[1]), false);
});

test('guided commands reject wrong roles, stale screens, blank notes and conflicting retries', () => {
 const initial = freshScenario();
 const input = { id: 'review-1', expectedVersion: 0, role: 'Facilitator' as const, type: 'request-changes' as const, learnerId: 'ada' as const, text: 'Clarify the plan.' };
 const s = commandScenario(initial, input).state;
 assert.equal(commandScenario(s, input).state, s, 'exact retry is a no-op');
 assert.ok(commandScenario(s, { ...input, text: 'Changed retry' }).error);
 for (const role of ['User', 'Administration'] as const) assert.ok(commandScenario(initial, { ...input, role }).error);
 for (const text of ['', '   ', 'x'.repeat(3001), ' untrimmed ']) assert.ok(commandScenario(initial, { ...input, text }).error);
 assert.ok(commandScenario(s, { ...input, id: 'stale-submit', role: 'User', type: 'submit-work' }).error);
 const after = act(s, 'User', 'submit-work'); assert.equal(commandScenario(after, input).state, after, 'historical exact retry cannot replace later evidence');
 const replied = act(initial, 'Facilitator', 'reply-question', 'sani');
 assert.ok(commandScenario(replied, { ...input, id: 'second-reply', expectedVersion: replied.events.length, type: 'reply-question', learnerId: 'sani' }).error);
});

test('guided replay rejects corrupt role, order, IDs, future schema and invalid transitions', () => {
 const s = act(freshScenario(), 'Facilitator', 'request-changes');
 const variants: unknown[] = [null, { ...s, schemaVersion: 99 }, { ...s, extra: true }, { ...s, events: [null] }];
 for (const patch of [{ role: 'User' }, { at: -1 }, { at: Number.MAX_SAFE_INTEGER }, { expectedVersion: 9 }, { text: '' }, { learnerId: 'someone-else' }, { type: 'respond-support' }, { secret: 'unexpected' }]) variants.push({ ...s, events: [{ ...s.events[0], ...patch }] });
 variants.push({ ...s, events: [...s.events, { ...s.events[0], expectedVersion: 1 }] });
 for (const invalid of variants) assert.equal(validScenario(invalid), false);
});

test('guided storage preserves corrupt bytes, append-only history and existing demo keys', () => storage(data => {
 assert.deepEqual(loadScenario().state, freshScenario());
 const s = act(freshScenario(), 'Facilitator', 'request-changes'); assert.equal(saveScenario(s), true); assert.deepEqual(loadScenario().state, s);
 assert.equal(saveScenario(freshScenario()), false, 'cannot erase history by saving stale state');
 const other = act(freshScenario(), 'Facilitator', 'approve-work'); assert.equal(saveScenario(other), false, 'cannot replace a committed history prefix');
 for (const raw of ['{invalid', JSON.stringify({ ...s, schemaVersion: 8 }), JSON.stringify({ ...s, events: [{ ...s.events[0], at: Number.MAX_SAFE_INTEGER }] })]) {
  data.set(SCENARIO_KEY, raw); assert.ok(loadScenario().recovery); assert.equal(saveScenario(s), false); assert.equal(data.get(SCENARIO_KEY), raw);
 }
 assert.equal(resetScenario(), true); assert.deepEqual(loadScenario().state, freshScenario());
 assert.equal(data.get('mosaic-user-demo-v1'), 'existing shared records'); assert.equal(data.get('mosaic-v1'), 'existing sandbox');
}));

test('guided storage denial is an explicit in-memory mode without deleting any records', () => {
 const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'sessionStorage');
 Object.defineProperty(globalThis, 'sessionStorage', { configurable: true, get: () => { throw new Error('blocked storage'); } });
 try { assert.ok(loadScenario().warning); assert.equal(saveScenario(freshScenario()), false); assert.equal(resetScenario(), false); }
 finally { if (descriptor) Object.defineProperty(globalThis, 'sessionStorage', descriptor); else Reflect.deleteProperty(globalThis, 'sessionStorage'); }
});
