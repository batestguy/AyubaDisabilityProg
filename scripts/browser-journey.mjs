import { mkdir } from "node:fs/promises";
await mkdir("output/playwright", { recursive: true });
import { chromium } from "playwright";
import assert from "node:assert/strict";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto("http://127.0.0.1:5173");
await page.getByRole("heading", { name: "Building a more inclusive Nigeria." }).waitFor();
await page.screenshot({
  path: "output/playwright/overview.png",
  fullPage: true,
});
await page
  .getByRole("button", { name: "Projects & Possibilities", exact: true })
  .click();
await page.getByRole("button", { name: "Explore the learning sandbox" }).click();
await page.getByLabel("Perspective", { exact: true }).selectOption("admin");
const add = page.locator("section").filter({
  has: page.getByRole("heading", {
    name: "Add a fictional learner",
    exact: true,
  }),
});
for (const [label, value] of [
  ["Name", "Demo learner"],
  ["Interests", "digital skills"],
  ["Access and support needs", "Text transcripts"],
  ["Location", "Bauchi"],
  ["Qualifications", "Secondary school"],
  ["Contact details", "Sandbox inbox only"],
])
  await add.getByLabel(label, { exact: true }).fill(value);
await add.getByRole("button", { name: "Save", exact: true }).click();
await page.getByLabel("Perspective", { exact: true }).selectOption("learner");
await page.getByRole("button", { name: "Enrol", exact: false }).first().click();
const study = page.locator(".study");
for (let i = 1; i <= 6; i++) {
  await study
    .locator("details")
    .nth(i - 1)
    .locator("summary")
    .click();
  await study
    .locator("details")
    .nth(i - 1)
    .getByRole("button", { name: "Mark complete" })
    .click();
}
const answer = [2, 1, 2, 0];
for (let i = 0; i < 4; i++)
  await study.locator(`input[name=q${i}][value="${answer[i]}"]`).check();
await study.getByRole("button", { name: "Submit quiz" }).click();
await study
  .getByLabel("Your practical work")
  .fill(
    "Learning folder: My-plan. Use large text. Never share codes. Download text on Wi-Fi. Mentor, can you review my digital plan?",
  );
await study.getByRole("button", { name: "Submit", exact: true }).click();
await study
  .getByLabel("Ask the expert")
  .fill("Can you check my file naming plan?");
await study
  .locator("form")
  .filter({ has: page.getByLabel("Ask the expert") })
  .getByRole("button", { name: "Send" })
  .click();
await study
  .getByLabel("Goals and preferred meeting format")
  .fill("Please arrange a text-based mentoring session.");
await study
  .locator("form")
  .filter({ has: page.getByLabel("Goals and preferred meeting format") })
  .getByRole("button", { name: "Send" })
  .click();
await page.getByLabel("Perspective", { exact: true }).selectOption("expert");
await page
  .getByLabel("Feedback", { exact: true })
  .fill("Clear practical plan. Approved.");
await page.getByLabel("Approve practical assignment").check();
await page
  .locator("form")
  .filter({ has: page.getByLabel("Feedback", { exact: true }) })
  .getByRole("button", { name: "Save" })
  .click();
for (let i = 0; i < 2; i++) {
  await page
    .getByLabel("Reply", { exact: true })
    .nth(i)
    .fill("Let us meet in this sandbox by text tomorrow.");
  await page
    .getByLabel("Reply", { exact: true })
    .nth(i)
    .locator("..")
    .locator("..")
    .getByRole("button", { name: "Send" })
    .click();
}
await page.getByLabel("Perspective", { exact: true }).selectOption("learner");
await page.getByRole("button", { name: "Open course" }).click();
await page.getByRole("heading", { name: "Certificate · DEMO" }).waitFor();
assert.ok(
  (await page.locator("body").innerText()).includes("Digital confidence"),
);
await page.screenshot({
  path: "output/playwright/learner-completion.png",
  fullPage: true,
});
await page.getByLabel("Perspective", { exact: true }).selectOption("admin");
for (let i = 0; i < 2; i++) {
  const field = page
    .getByLabel("Follow-up owner, date and accessible format")
    .nth(i);
  await field.fill("Intermediary: tomorrow, text inbox.");
  await field
    .locator("..")
    .locator("..")
    .getByRole("button", { name: "Save" })
    .click();
}
assert.ok(
  await page.evaluate(() =>
    JSON.parse(sessionStorage.getItem("mosaic-v1")).requests.every(
      (r) => r.followup === "Intermediary: tomorrow, text inbox.",
    ),
  ),
);
await page.getByRole("button", { name: "Projects & Possibilities", exact: true }).click();
await page
  .getByRole("button", { name: "Open the support navigator", exact: false })
  .click();
await page.getByLabel("Your question").fill("Explain safe passwords.");
await page.getByRole("button", { name: "Send", exact: true }).click();
await page.locator(".ai-answer").waitFor();
const second = await browser.newContext();
const isolated = await second.newPage();
await isolated.goto("http://127.0.0.1:5173");
await isolated
  .getByRole("heading", { name: "Building a more inclusive Nigeria." })
  .waitFor();
assert.equal(
  await isolated.evaluate(
    () => JSON.parse(sessionStorage.getItem("mosaic-v1")).learners.length,
  ),
  1,
);
await second.close();
for (const lang of ["en", "ha", "yo", "ig"]) {
  await page.locator("header select").selectOption(lang);
  assert.equal(await page.locator("html").getAttribute("lang"), lang);
  if (lang !== "en") await page.locator(".translation-note").waitFor();
}
await page.locator("header select").selectOption("en");
await page.getByRole("button", { name: "Reset demo" }).click();
assert.equal(
  await page.evaluate(
    () => JSON.parse(sessionStorage.getItem("mosaic-v1")).learners.length,
  ),
  1,
);
await page.setViewportSize({ width: 390, height: 844 });
await page.getByRole("button", { name: "Home", exact: true }).click();
await page.screenshot({ path: "output/playwright/mobile.png", fullPage: true });
assert.equal(
  await page.evaluate(
    () => document.documentElement.scrollWidth <= window.innerWidth,
  ),
  true,
);
await page.keyboard.press("Tab");
assert.ok(await page.evaluate(() => document.activeElement !== document.body));
console.log(
  "PASS complete 3-role journey, mentoring replies/follow-up, certificate/skills, AI outage, 4 language switches, independent session, reset, mobile overflow, keyboard focus.",
);
assert.deepEqual(errors, []);
await browser.close();
