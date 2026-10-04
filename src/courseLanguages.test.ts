import test from "node:test";
import assert from "node:assert/strict";
import { courses } from "./catalogue";
import { localizeCourse } from "./courseLanguages";
test("all localized course journeys preserve assessments and metadata", () => {
  for (const lang of ["ha", "yo", "ig"])
    for (const c of courses) {
      const x = localizeCourse(c, lang);
      assert.notEqual(x.title, c.title);
      assert.equal(x.lessons.length, 6);
      assert.ok(
        x.lessons.every((l, i) => l.body && l.body !== c.lessons[i].body),
      );
      assert.equal(x.quiz.length, c.quiz.length);
      assert.deepEqual(
        x.quiz.map((q) => q.answer),
        c.quiz.map((q) => q.answer),
      );
      assert.ok(
        x.quiz.every(
          (q, i) =>
            q.question !== c.quiz[i].question &&
            q.options.length === c.quiz[i].options.length,
        ),
      );
      assert.equal(x.id, c.id);
      assert.deepEqual(x.skills, c.skills);
      assert.notEqual(x.assignment, c.assignment);
    }
});
