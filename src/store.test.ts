import test from "node:test";
import assert from "node:assert/strict";
import { fresh, enrol, updateEnrolment, grade, recommend } from "./store";
import { available } from "./evidence";
import { translations } from "./i18n";
test("complete three-role journey, certificate gates and demonstrated skills", () => {
  let s = fresh();
  const c = s.courses[0];
  s.learners.push({
    ...s.learners[0],
    id: "new",
    name: "New fictional learner",
  });
  assert.equal(recommend(s, s.learners[1])[0].course.status, "published");
  s = enrol(s, "new", c.id, true);
  const id = s.enrolments[0].id;
  assert.equal(enrol(s, "new", c.id).enrolments.length, 1);
  s = updateEnrolment(s, id, {
    lessons: c.lessons.map((_, i) => i),
    submitted: "Practical work",
    scores: [25, 75],
  });
  assert.equal(s.enrolments[0].completedAt, undefined);
  s = updateEnrolment(s, id, {
    feedback: "Practical work approved",
    approved: true,
  });
  assert.ok(s.enrolments[0].completedAt);
  assert.deepEqual(s.learners[1].skills, c.skills);
  s = updateEnrolment(s, id, {
    submitted: "Replacement work",
    approved: false,
  });
  assert.equal(s.enrolments[0].completedAt, undefined);
});
test("unpublished course, missing learner and partial lessons cannot complete", () => {
  let s = fresh();
  s.courses[0].status = "review";
  assert.equal(
    enrol(s, s.learners[0].id, s.courses[0].id).enrolments.length,
    0,
  );
  assert.equal(enrol(s, "invalid", s.courses[1].id).enrolments.length, 0);
  s = enrol(s, s.learners[0].id, s.courses[1].id);
  s = updateEnrolment(s, s.enrolments[0].id, {
    scores: [100],
    submitted: "work",
    approved: true,
    lessons: [0, 1],
  });
  assert.equal(s.enrolments[0].completedAt, undefined);
});
test("quiz scoring, fresh isolation, expired opportunities and language keys", () => {
  const s = fresh(),
    other = fresh();
  s.learners[0].skills.push("Changed");
  assert.deepEqual(other.learners[0].skills, []);
  assert.equal(
    grade(
      s.courses[0],
      s.courses[0].quiz.map((q) => q.answer),
    ),
    100,
  );
  assert.equal(grade(s.courses[0], []), 0);
  assert.equal(available("2020-01-01"), false);
  assert.equal(available(), false);
  for (const lang of ["ha", "yo", "ig"])
    assert.deepEqual(
      Object.keys(translations[lang]).sort(),
      Object.keys(translations.en).sort(),
    );
});
