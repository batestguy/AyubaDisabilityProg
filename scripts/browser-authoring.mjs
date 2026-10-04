import { mkdir } from "node:fs/promises";
await mkdir("output/playwright", { recursive: true });
import { chromium } from "playwright";
import assert from "node:assert/strict";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext();
const page = await context.newPage();
await page.goto("http://127.0.0.1:5173");
await page.locator("h1").waitFor();
await page
  .getByRole("button", { name: "Projects & Possibilities", exact: true })
  .click();
await page.getByRole("button", { name: "Explore the learning sandbox" }).click();
await page.getByLabel("Perspective", { exact: true }).selectOption("expert");
const profile = page.locator("section").filter({
  has: page.getByRole("heading", { name: "Expert workspace · My profile" }),
});
await profile.getByRole("button", { name: "Save", exact: true }).click();
const author = page
  .locator("section")
  .filter({ has: page.getByRole("heading", { name: "Author a course" }) });
for (const [label, value] of [
  ["Course title", "Fictional new course"],
  ["Description", "Practice a new skill"],
  ["Demonstrated skills (comma-separated)", "Demo communication"],
  [
    "Lesson titles and structured text",
    "First lesson\nPractice clear communication.\n---\nSecond lesson\nAsk a useful question.",
  ],
  ["Practical assignment instructions", "Write a useful question."],
])
  await author.getByLabel(label, { exact: true }).fill(value);
await author
  .getByRole("button", { name: "Submit for publication review" })
  .click();
await page.getByLabel("Perspective", { exact: true }).selectOption("learner");
assert.equal(
  await page
    .locator(".course-card")
    .filter({ hasText: "Fictional new course" })
    .count(),
  0,
);
await page.getByLabel("Perspective", { exact: true }).selectOption("admin");
const review = page
  .locator("article")
  .filter({ has: page.getByRole("heading", { name: "Fictional new course" }) });
assert.equal(
  await review
    .getByRole("button", { name: "Publish", exact: true })
    .isDisabled(),
  true,
);
await page.getByRole("button", { name: "Approve consultant profile" }).click();
await review.getByRole("button", { name: "Publish", exact: true }).click();
await page.getByLabel("Perspective", { exact: true }).selectOption("learner");
assert.equal(
  await page
    .locator(".course-card")
    .filter({ hasText: "Fictional new course" })
    .count(),
  1,
);
for (const lang of ["ha", "yo", "ig"]) {
  await page.locator("header select").selectOption(lang);
  await page.locator(".course-card button").first().click();
  await page.locator(".study").waitFor();
  assert.equal(await page.locator(".study details").count(), 6);
  assert.ok((await page.locator(".study fieldset").count()) >= 4);
  assert.ok(
    !(await page.locator(".study h2").innerText()).includes(
      "Digital Essentials",
    ),
  );
  await page.screenshot({
    path: `output/playwright/course-${lang}.png`,
    fullPage: true,
  });
}
console.log(
  "PASS course authoring, pending profile and publication gates; all sample lessons/assessments/assignment journeys render in Hausa, Yoruba and Igbo.",
);
await browser.close();
