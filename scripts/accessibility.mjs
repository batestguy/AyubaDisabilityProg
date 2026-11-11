import { mkdir } from "node:fs/promises";
await mkdir("output/playwright", { recursive: true });
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext();
const page = await context.newPage();
const results = [];
await page.goto("http://127.0.0.1:5173/?workspace=earlier");
await page.locator("h1").waitFor();
for (const section of ["Learning Sandbox", "About"]) {
  await page.getByRole("button", { name: section, exact: true }).click();
  if (section === "Learning Sandbox") {
    const projectAudit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    results.push({ view: section, violations: projectAudit.violations });
    for (const role of ["User", "Administration", "Facilitator"]) {
      await page.getByRole("tab", { name: role, exact: true }).click();
      const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      results.push({ view: section + "-" + role, violations: audit.violations });
      console.log(section + "-" + role, audit.violations.map(v => v.id));
    }
  } else {
    const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    results.push({ view: section, violations: audit.violations });
    console.log(section, audit.violations.map(v => v.id));
  }
}
await page.getByRole("button", { name: "Home – Tribute to Gufwan", exact: true }).click();
for (const view of ["overview", "learner", "expert", "admin"]) {
  if (view === "learner") {
    await page
      .getByRole("button", { name: "Learning Sandbox", exact: true })
      .click();
    await page.getByText("Original sandbox tools", { exact: true }).click();
    await page.getByRole("button", { name: "Explore the learning sandbox" }).click();
  }
  if (view === "expert" || view === "admin")
    await page.getByLabel("Perspective", { exact: true }).selectOption(view);
  const r = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  results.push({ view, violations: r.violations });
  console.log(
    view,
    r.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.map((n) => n.target),
    })),
  );
}
// The language picker was removed (11 November 2026); audit the English course view.
for (const lang of ["en"]) {
  await page.getByLabel("Perspective", { exact: true }).selectOption("learner");
  await page.locator(".course-card button").first().click();
  await page.locator(".study").waitFor();
  for (const summary of await page.locator(".study details summary").all())
    await summary.click();
  const r = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  results.push({ view: "expanded-course-" + lang, violations: r.violations });
  console.log(
    "expanded-course-" + lang,
    r.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  );
}
await writeFile(
  "output/playwright/accessibility.json",
  JSON.stringify(results, null, 2),
);
await browser.close();
assert.equal(
  results.reduce((n, r) => n + r.violations.length, 0),
  0,
);
