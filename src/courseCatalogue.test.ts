import test from 'node:test';
import assert from 'node:assert/strict';
import { courses } from './catalogue';
import { fresh, loadState, grade } from './store';
import { freshDemo, loadDemo, USER_DEMO_KEY } from './userDemo';
import { skillCategories, courseCategory } from './skillCategories';

test('AI Essentials is a complete published course with valid assessments and offline practice', () => {
  const course = courses.find(c => c.id === 'ai-essentials')!;
  assert.equal(course.status, 'published');
  assert.equal(course.lessons.length, 6);
  assert.equal(course.quiz.length, 5);
  assert.ok(course.lessons.every(l => l.body && l.resource));
  assert.ok(course.quiz.every(q => q.answer >= 0 && q.answer < q.options.length));
  assert.equal(grade(course, course.quiz.map(q => q.answer)), 100);
  assert.match(course.assignment, /No live AI, paid account or real personal data/);
  assert.equal(new Set(courses.map(c => c.id)).size, courses.length);
});

test('existing user and sandbox sessions gain AI Essentials without losing progress or authored courses', () => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'sessionStorage');
  const demo = freshDemo();
  demo.profile.name = 'Existing learner';
  demo.onboarded = true;
  demo.learning.courses = demo.learning.courses.filter(c => ['digital-essentials', 'spreadsheet-data', 'business-foundations'].includes(c.id));
  demo.learning.enrolments = [{ id: 'saved', learnerId: 'user-demo', courseId: 'digital-essentials', assisted: false, lessons: [0, 1], scores: [75], approved: false, submitted: 'Saved work' }];
  demo.checklist = ['Build my skills summary'];
  const sandbox = fresh();
  sandbox.courses = sandbox.courses.filter(c => ['digital-essentials', 'spreadsheet-data', 'business-foundations'].includes(c.id));
  sandbox.courses.push({ ...sandbox.courses[0], id: 'authored-course', title: 'Saved authored course', status: 'draft' });
  const legacy = JSON.parse(JSON.stringify(demo));
  delete legacy.profile.categories;
  const data = new Map([[USER_DEMO_KEY, JSON.stringify(legacy)], ['mosaic-v1', JSON.stringify(sandbox)]]);
  Object.defineProperty(globalThis, 'sessionStorage', { configurable: true, value: { getItem: (key: string) => data.get(key) || null } });
  try {
    const restored = loadDemo();
    assert.equal(restored.profile.name, demo.profile.name);
    assert.deepEqual(restored.learning.enrolments, demo.learning.enrolments);
    assert.deepEqual(restored.checklist, demo.checklist);
    assert.deepEqual(restored.profile.categories, []);
    assert.equal(restored.learning.courses.length, courses.length);
    assert.equal(restored.learning.courses.filter(c => c.id === 'ai-essentials').length, 1);
    const restoredSandbox = loadState();
    assert.equal(restoredSandbox.courses.find(c => c.id === 'authored-course')?.status, 'draft');
    assert.equal(restoredSandbox.courses.length, courses.length + 1);
    assert.equal(restoredSandbox.courses.filter(c => c.id === 'ai-essentials').length, 1);
    data.set(USER_DEMO_KEY, JSON.stringify(restored));
    data.set('mosaic-v1', JSON.stringify(restoredSandbox));
    assert.equal(loadDemo().learning.courses.filter(c => c.id === 'ai-essentials').length, 1);
    assert.equal(loadState().courses.filter(c => c.id === 'ai-essentials').length, 1);
  } finally {
    if (previous) Object.defineProperty(globalThis, 'sessionStorage', previous);
    else Reflect.deleteProperty(globalThis, 'sessionStorage');
  }
});

test('all skill areas have complete courses and honest practical-foundation metadata', () => {
  assert.equal(courses.length, 8);
  assert.equal(courses.reduce((count, c) => count + c.lessons.length, 0), 48);
  assert.equal(courses.reduce((count, c) => count + c.quiz.length, 0), 39);
  for (const category of skillCategories) assert.ok(courses.some(c => courseCategory(c) === category.id));
  for (const c of courses) {
    assert.ok(skillCategories.some(category => category.id === courseCategory(c)));
    assert.ok(c.quiz.every(q => Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length));
    assert.equal(grade(c, c.quiz.map(q => q.answer)), 100);
    assert.equal(c.lessons.length, 6);
    if (c.delivery === 'foundation') {
      assert.equal(c.category, 'livelihoods');
      assert.ok(c.tools?.length);
      assert.ok(c.outcome);
      assert.match(c.assignment, /fictional|paper|written/i);
    }
  }
});
