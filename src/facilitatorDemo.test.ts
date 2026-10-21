import test from 'node:test';
import assert from 'node:assert/strict';
import { freshSharedDemo, updateSharedDemo } from './sharedDemo';
import { syncLearner, submitTeaching, submitWork } from './userDemo';
import { enrol } from './store';
import { decideReview, reviewRecord } from './reviewDemo';
import { assignLearning, currentAssignment, type LearningAssignmentInput } from './coordinationDemo';
import { facilitatorAssignments } from './facilitatorAssignments';

function fixture() {
 let s = freshSharedDemo();
 let d = syncLearner({ ...s.user, profile: { ...s.user.profile, name: 'Fictional facilitator learner' } });
 d = submitTeaching(d, { route: 'experience', skill: 'Digital learning', examples: 'Fictional example', explanation: 'One step at a time', accessibility: 'Text and flexible pacing' }).demo;
 d.learning = enrol(d.learning, 'user-demo', 'digital-essentials');
 const id = d.learning.enrolments[0].id;
 d = submitWork(d, id, 'Original assigned evidence');
 s = updateSharedDemo(s, d, { kind: 'work-submitted', recordId: id });
 const r = reviewRecord(s, 'teaching')!;
 s = decideReview(s, { kind: 'teaching', submissionId: r.submission.id, expectedRevision: r.submission.revision, outcome: 'approved', reason: 'Demo mentoring only', reviewer: 'Demo administrator', checklist: { skill: true, examples: true, explanation: true, accessibility: true } }).session;
 const input: LearningAssignmentInput = { kind: 'enrolment', recordId: id, expectedRevision: s.recordMetadata[`enrolment:${id}`].revision, rosterId: 'user-demo-trainer', submissionId: s.submissions.filter(x => x.kind === 'work').at(-1)!.id, suitabilityNote: 'Digital foundation evidence only', reason: 'Review practice', reviewer: 'Demo administrator' };
 const result = assignLearning(s, input); assert.equal(result.error, undefined);
 return { s: result.session, input };
}

test('facilitator workload requires approved identity, latest assignment and preserves source', () => {
 const { s, input } = fixture(); const before = structuredClone(s);
 assert.deepEqual(facilitatorAssignments(s, ''), []);
 assert.deepEqual(facilitatorAssignments(s, 'unknown'), []);
 assert.equal(facilitatorAssignments(s, input.rosterId).length, 1);
 assert.equal(facilitatorAssignments(s, input.rosterId)[0].stale, false);
 assert.deepEqual(s, before);
 // A replacement to the same identity must count once, not once per history row.
 const replaced = assignLearning(s, { ...input, expectedAssignmentId: currentAssignment(s, input.kind, input.recordId)!.assignment.id, reason: 'Updated coordination reason' });
 assert.equal(replaced.error, undefined);
 const items = facilitatorAssignments(replaced.session, input.rosterId);
 assert.equal(items.length, 1); assert.equal(items[0].assignment.reason, 'Updated coordination reason');
});

test('resubmission marks assigned evidence stale and retains its original snapshot', () => {
 const { s, input } = fixture();
 const changed = updateSharedDemo(s, submitWork(s.user, input.recordId, 'Revised practical evidence'), { kind: 'work-submitted', recordId: input.recordId });
 const item = facilitatorAssignments(changed, input.rosterId)[0];
 assert.equal(item.stale, true);
 assert.equal((changed.submissions.find(x => x.id === item.assignment.submissionId)!.payload as { submitted: string }).submitted, 'Original assigned evidence');
 assert.equal(changed.user.learning.enrolments[0].submitted, 'Revised practical evidence');
 const withoutRoster = structuredClone(changed); withoutRoster.reviews!.roster = [];
 assert.deepEqual(facilitatorAssignments(withoutRoster, input.rosterId), []);
});
