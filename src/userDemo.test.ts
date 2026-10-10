import test from "node:test";
import assert from "node:assert/strict";
import { enrol, grade, updateEnrolment } from "./store";
import { freshDemo, loadDemo, saveDemo, syncLearner, recommendationReasons, addAttachment, submitSupport, submitTeaching, teachingEligibility, submitWork, addToPortfolio, USER_DEMO_KEY, USER_LEARNER_ID, type Demo } from "./userDemo";

function completedCourse(demo: Demo, index = 0): Demo {
  let d = syncLearner(demo);
  const course = d.learning.courses[index];
  d = { ...d, learning: enrol(d.learning, USER_LEARNER_ID, course.id) };
  const e = d.learning.enrolments.find(e => e.courseId === course.id)!;
  d = submitWork(d, e.id, `My practical work for ${course.title}`);
  return { ...d, learning: updateEnrolment(d.learning, e.id, {
    lessons: course.lessons.map((_, i) => i), scores: [grade(course, course.quiz.map(q => q.answer))],
    approved: true, feedback: "Reviewed in the local demo",
  }) };
}
test("fresh user session has optional profile and isolated catalogue without fictional learner", () => {
  const d = freshDemo();
  assert.deepEqual(d.learning.learners, []);
  assert.deepEqual(d.learning.enrolments, []);
  assert.deepEqual(d.learning.requests, []);
  assert.equal(d.profile.name, "");
  const other = freshDemo();
  d.learning.courses[0].title = "Changed";
  assert.notEqual(other.learning.courses[0].title, "Changed");
  d.profile.name = "New learner";
  const synced = syncLearner(d);
  assert.equal(synced.learning.learners[0].name, "New learner");
  assert.equal(synced.learning.learners[0].id, USER_LEARNER_ID);
  assert.equal(synced.profile.gender, "");
  assert.deepEqual(synced.profile.disabilities, []);
});
test("versioned user storage stays separate and recovers from invalid data or unavailable storage", () => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, "sessionStorage");
  const data = new Map<string, string>([["mosaic-v1", '{"legacy":true}']]);
  Object.defineProperty(globalThis, "sessionStorage", { configurable: true, value: {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => data.set(key, value),
  } });
  try {
    const d = freshDemo(); d.profile.name = "Saved learner";
    assert.equal(saveDemo(d), true);
    assert.equal(loadDemo().profile.name, "Saved learner");
    assert.equal(data.get("mosaic-v1"), '{"legacy":true}');
    data.set(USER_DEMO_KEY, JSON.stringify({ ...d, schemaVersion: 2 }));
    assert.equal(loadDemo().profile.name, "");
    data.set(USER_DEMO_KEY, JSON.stringify({ schemaVersion: 1 }));
    assert.equal(loadDemo().step, 0);
    data.set(USER_DEMO_KEY, "broken JSON");
    assert.equal(loadDemo().step, 0);
    Object.defineProperty(globalThis, "sessionStorage", { configurable: true, get() { throw new Error("Unavailable"); } });
    assert.equal(saveDemo(d), false);
    assert.equal(loadDemo().profile.name, "");
  } finally {
    if (previous) Object.defineProperty(globalThis, "sessionStorage", previous);
    else Reflect.deleteProperty(globalThis, "sessionStorage");
  }
});
test("recommendation reasons use only skills, interests and goals", () => {
  const d = freshDemo(); const c = d.learning.courses[0];
  assert.deepEqual(recommendationReasons(d.profile, c), []);
  d.profile.interests = ["Digital confidence"]; d.profile.goals = ["Communication"];
  d.profile.skills = ["Online safety"];
  const before = recommendationReasons(d.profile, c);
  assert.equal(before.length, 3);
  d.profile.gender = "Woman"; d.profile.disabilities = ["Digital confidence"];
  d.profile.disabilityDescription = "Communication"; d.profile.access = ["Online safety"];
  assert.deepEqual(recommendationReasons(d.profile, c), before);
});

test('selected skill areas explain recommendations without excluding other courses', () => {
  const d = freshDemo();
  d.profile.categories = ['people', 'livelihoods'];
  const people = d.learning.courses.find(c => c.id === 'people-workplace')!;
  const sewing = d.learning.courses.find(c => c.id === 'sewing-textiles')!;
  assert.ok(recommendationReasons(d.profile, people).includes('Chosen skill area: People & Workplace Skills'));
  assert.ok(recommendationReasons(d.profile, sewing).includes('Chosen skill area: Hands-On & Livelihood Skills'));
  const all = syncLearner(d);
  assert.equal(enrol(all.learning, USER_LEARNER_ID, 'digital-essentials').enrolments.length, 1);
  d.profile.gender = 'Prefer not to say'; d.profile.disabilities = ['Hearing'];
  assert.ok(recommendationReasons(d.profile, people).includes('Chosen skill area: People & Workplace Skills'));
});
test("attachment metadata validates allowed formats, five files and five megabytes", () => {
  let d = freshDemo();
  for (const type of ["application/pdf", "image/jpeg", "image/png"])
    d = addAttachment(d, { name: "Evidence", type, size: 5 * 1024 * 1024 }, "My evidence").demo;
  assert.equal(d.attachments.length, 3);
  assert.equal(d.attachments[0].description, "My evidence");
  assert.ok(addAttachment(d, { name: "video", type: "video/mp4", size: 1 }).error);
  assert.ok(addAttachment(d, { name: "large", type: "application/pdf", size: 5 * 1024 * 1024 + 1 }).error);
  assert.ok(addAttachment(d, { name: "empty", type: "application/pdf", size: 0 }).error);
  while (d.attachments.length < 5) d = addAttachment(d, { name: "image", type: "image/png", size: 12 }).demo;
  const rejected = addAttachment(d, { name: "sixth", type: "image/png", size: 12 });
  assert.ok(rejected.error); assert.equal(rejected.demo, d);
  assert.deepEqual(Object.keys(d.attachments[0]).sort(), ["description", "id", "name", "size", "type"]);
});
test("support submission snapshots checklist and blocks unchanged duplicates", () => {
  let d = freshDemo();
  assert.equal(submitSupport(d), d);
  d.support = [{ id: "data", need: "Data access", available: 'Limited data', priority: "High" }, { id: "device", need: "Device", available: 'Shared phone', priority: "Low" }];
  d = submitSupport(d);
  assert.equal(d.supportRequest?.status, "pending");
  assert.equal(d.supportRequest?.items.length, 2);
  assert.equal(submitSupport(d), d);
  const revised = { ...d, support: d.support.map(item => ({ ...item, priority: "Medium" })) };
  const resubmitted = submitSupport(revised);
  assert.notEqual(resubmitted, revised);
  assert.equal(resubmitted.supportRequest?.items[0].priority, "Medium");
  assert.equal(d.supportRequest?.items[0].priority, "High");
});
test("all catalogue courses require lesson completion, quiz pass and reviewed work; changed work resets evidence", () => {
  for (let index = 0; index < freshDemo().learning.courses.length; index++) {
    let d = syncLearner(freshDemo()); const course = d.learning.courses[index];
    d.learning = enrol(d.learning, USER_LEARNER_ID, course.id);
    const e = d.learning.enrolments[0];
    d = submitWork(d, e.id, "First attempt");
    d.learning = updateEnrolment(d.learning, e.id, { lessons: [0], scores: [100], approved: true });
    assert.equal(d.learning.enrolments[0].completedAt, undefined);
    assert.equal(addToPortfolio(d, e.id), d);
    d.learning = updateEnrolment(d.learning, e.id, { lessons: course.lessons.map((_, i) => i), scores: [25] });
    assert.equal(d.learning.enrolments[0].completedAt, undefined);
    d.learning = updateEnrolment(d.learning, e.id, { scores: [100], approved: false });
    assert.equal(d.learning.enrolments[0].completedAt, undefined);
    d.learning = updateEnrolment(d.learning, e.id, { approved: true, feedback: "Good work" });
    assert.ok(d.learning.enrolments[0].completedAt);
    assert.equal(d.portfolio.length, 0);
    d = addToPortfolio(d, e.id);
    assert.equal(d.portfolio.length, 1);
    assert.equal(addToPortfolio(d, e.id), d);
    const identical = submitWork(d, e.id, 'First attempt');
    assert.equal(identical.learning.enrolments[0].approved, false);
    assert.equal(identical.learning.enrolments[0].completedAt, undefined);
    d = submitWork(d, e.id, "Revised attempt");
    assert.equal(d.learning.enrolments[0].approved, false);
    assert.equal(d.learning.enrolments[0].feedback, undefined);
    assert.equal(d.learning.enrolments[0].completedAt, undefined);
    assert.equal(d.portfolio.length, 0);
    assert.deepEqual(d.learning.learners[0].skills, []);
    assert.equal(addToPortfolio(d, e.id), d);
  }
});
test("teaching experience and progression applications stay pending without role elevation", () => {
  const input = { route: "experience" as const, skill: "Sewing", examples: "I made three garments", explanation: "I explain each step", accessibility: "I offer text and audio" };
  const d = freshDemo(); const initialConsultant = structuredClone(d.learning.consultant);
  const experience = submitTeaching(d, input);
  assert.equal(experience.error, undefined);
  assert.equal(experience.demo.teaching?.status, "pending");
  assert.deepEqual(experience.demo.learning.consultant, initialConsultant);
  assert.ok(submitTeaching(d, { ...input, examples: " " }).error);
  assert.equal(teachingEligibility(d).progression, false);
  assert.ok(submitTeaching(d, { ...input, route: "progression" }).error);
  const completed = completedCourse(d);
  assert.equal(teachingEligibility(completed).progression, true);
  assert.ok(submitTeaching(completed, { ...input, route: 'progression' }).error);
  const progressed = submitTeaching(completed, { ...input, route: "progression", skill: completed.learning.courses[0].skills[0] });
  assert.equal(progressed.error, undefined);
  assert.equal(progressed.demo.teaching?.status, "pending");
  assert.deepEqual(progressed.demo.learning.consultant, initialConsultant);
});
