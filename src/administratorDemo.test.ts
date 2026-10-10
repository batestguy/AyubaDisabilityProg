import test from 'node:test';
import assert from 'node:assert/strict';
import { administratorCounts, matchesLearner, demoDate } from './administratorMetrics';
import { freshDemo, syncLearner, submitSupport, submitTeaching, submitWork, USER_LEARNER_ID } from './userDemo';
import { enrol, updateEnrolment } from './store';

test('administrator totals follow actual learning and pending records, including resubmission', () => {
 let d = freshDemo();
 assert.deepEqual(administratorCounts(d), { learners: 0, enrolments: 0, completed: 0, practical: 0, questions: 0, support: 0, teaching: 0, availableCourses: 8 });
 d.profile.name = 'Demo learner'; d = syncLearner(d);
 d.learning = enrol(d.learning, USER_LEARNER_ID, d.learning.courses[0].id);
 const entry = d.learning.enrolments[0], course = d.learning.courses[0];
 d = submitWork(d, entry.id, 'My fictional work');
 d.learning.requests.push({ id: 'question-1', learnerId: USER_LEARNER_ID, courseId: course.id, kind: 'question', text: 'How do I practise?', createdAt: 1 });
 d.support.push({ id: 'support-1', need: 'Tools', available: 'A shared device', priority: 'Medium' });
 d = submitSupport(d);
 d = submitTeaching(d, { route: 'experience', skill: 'Writing', examples: 'Sample', explanation: 'Sample explanation', accessibility: 'Text instructions' }).demo;
 assert.equal(administratorCounts(d).practical, 1);
 assert.equal(administratorCounts(d).questions, 1);
 assert.equal(administratorCounts(d).support, 1);
 assert.equal(administratorCounts(d).teaching, 1);
 d.learning = updateEnrolment(d.learning, entry.id, { approved: true, lessons: course.lessons.map((_, i) => i), scores: [100] });
 assert.equal(administratorCounts(d).completed, 1);
 assert.equal(administratorCounts(d).practical, 0);
 d = submitWork(d, entry.id, 'My fictional work');
 assert.equal(administratorCounts(d).completed, 0);
 assert.equal(administratorCounts(d).practical, 1);
 d.signedIn = false;
 assert.equal(administratorCounts(d).learners, 1);
});

test('learner search uses name/location and profile readiness without sensitive ranking', () => {
 const d = freshDemo();
 assert.equal(matchesLearner(d, '', 'all'), false);
 Object.assign(d.profile, { name: 'Amina', state: 'Bauchi', lga: 'Sample LGA', gender: 'Woman', disabilities: ['Hearing'] });
 assert.equal(matchesLearner(d, ' BAUCHI ', 'incomplete'), true);
 assert.equal(matchesLearner(d, 'sample lga', 'all'), true);
 assert.equal(matchesLearner(d, 'Hearing', 'all'), false);
 assert.equal(matchesLearner(d, 'Woman', 'all'), false);
 assert.equal(matchesLearner(d, 'Amina', 'ready'), false);
 d.onboarded = true;
 assert.equal(matchesLearner(d, 'Amina', 'ready'), true);
 assert.equal(matchesLearner(d, '', 'incomplete'), false);
 assert.match(demoDate(0), /Africa\/Lagos, UTC\+01:00/);
 assert.equal(demoDate(null), 'Original submission time not recorded');
});
