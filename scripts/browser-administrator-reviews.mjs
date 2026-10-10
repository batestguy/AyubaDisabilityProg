import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { freshDemo, submitTeaching, submitSupport, syncLearner } from '../output/tests/src/userDemo.js';
import { enrol, updateEnrolment } from '../output/tests/src/store.js';
import { freshSharedDemo, updateSharedDemo } from '../output/tests/src/sharedDemo.js';
await mkdir('output/playwright', { recursive: true });
let demo = freshDemo(); demo.signedIn = demo.onboarded = true; demo.profile.name = 'Review learner'; demo.profile.adult = true;
demo = submitTeaching(demo, { route: 'experience', skill: 'Budgeting', examples: 'A sample budget', explanation: 'Explain one expense at a time', accessibility: 'Plain language and large text' }).demo;
demo.support = [{ id: 'support-item', need: 'Practice materials', available: 'Paper', priority: 'Medium' }]; demo = submitSupport(demo);
const fixture = updateSharedDemo(freshSharedDemo(), demo);
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
await context.addInitScript(source => { if (!sessionStorage.getItem('review-initialized')) { sessionStorage.setItem('mosaic-user-demo-v1', source); sessionStorage.setItem('review-initialized', '1'); } }, JSON.stringify(fixture));
const page = await context.newPage(); const errors = [], posts = [], audits = [];
page.on('pageerror', e => errors.push(e.message)); page.on('request', r => { if (r.method() === 'POST') posts.push(r.url()); });
const button = name => page.getByRole('button', { name, exact: true });
const role = name => page.getByRole('tab', { name, exact: true });
const read = () => page.evaluate(() => JSON.parse(sessionStorage.getItem('mosaic-user-demo-v1')));
async function open() { await button('Projects & Possibilities').click(); await page.getByRole('button', { name: 'Open the app demo', exact: false }).click(); }
async function nav(name, admin = true) { const toggle = button(admin ? 'Administration menu' : 'My pathway menu'); if (await toggle.isVisible() && await toggle.getAttribute('aria-expanded') === 'false') await toggle.click(); await page.getByRole('navigation', { name: admin ? 'Administration' : 'My pathway', exact: true }).getByRole('button', { name, exact: true }).click(); }
async function audit(name) { const result = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze(); audits.push({ name, violations: result.violations }); assert.deepEqual(result.violations, [], name); }
async function decide(outcome, reason) { await page.getByLabel('Review outcome', { exact: true }).selectOption(outcome); await page.getByLabel('Reason and next steps').fill(reason); await button('Record decision').click(); }
try {
 await page.goto('http://127.0.0.1:5173/'); await open(); await role('Administration').click(); await nav('Trainer applications'); await audit('trainer-queue');
 await button('Open submitted evidence').click(); await audit('trainer-evidence');
 await decide('approved', 'Ready to mentor'); await page.getByRole('alert').filter({ hasText: 'Check all four' }).waitFor(); assert.equal((await read()).reviews.decisions.length, 0);
 await decide('needs-changes', 'Add an example with numbers'); assert.equal((await read()).reviews.decisions.length, 1); await audit('trainer-needs-changes');
 await role('User').click(); await nav('Teach others', false); await page.getByLabel('Work examples and what I could teach').fill('Income 100; expense 60; remaining 40'); await page.getByLabel('Response to requested changes').fill('Added a numeric example'); await button('Resubmit trainer/mentor response').click();
 await role('Administration').click(); await page.getByText('A newer submission is available.', { exact: false }).waitFor();
 assert.equal(await button('Record decision').count(), 0, 'Previously decided evidence cannot be reviewed again');
 await button('Open latest evidence').click(); for (const label of ['A clear skill','Supporting examples','A clear teaching explanation','An accessible approach']) await page.getByLabel(label, { exact: true }).check();
 await decide('approved', 'All four criteria met'); assert.equal((await read()).reviews.roster.length, 1); await audit('trainer-approved');
 await nav('Support requests'); await button('Open submitted evidence').click(); await decide('needs-clarification', 'Explain the practice activity');
 await role('User').click(); await nav('Tools and support', false); await page.getByLabel('Response to support clarification').fill('I will practise a paper budget'); await button('Resubmit support response').click();
 await role('Administration').click(); await button('Open latest evidence').click(); await page.getByLabel('Follow-up owner (optional, with date)').fill('Demo coordinator'); await page.getByLabel('Follow-up date (optional, with owner)').fill('2026-10-10'); await decide('plan-reviewed', 'Discuss materials for written practice');
 const final = await read(); assert.equal(final.reviews.decisions.length, 4); assert.equal(final.submissions.filter(s => s.kind === 'support').length, 2); assert.equal(final.submissions.filter(s => s.kind === 'teaching').length, 2); assert.equal(final.user.learning.enrolments.length, 0);
 await audit('support-plan-reviewed'); await page.setViewportSize({ width: 390, height: 844 }); await audit('review-mobile'); assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false); await page.screenshot({ path: 'output/playwright/admin-wave2-mobile.png', fullPage: true });
 await page.reload(); await open(); await role('Administration').click(); await nav('Support requests'); await button('Open submitted evidence').click(); assert.equal((await read()).reviews.decisions.length, 4); await audit('review-reload');
 await role('User').click(); await button('Reset demo').click(); await button('Clear user demo records').click(); await role('Administration').click(); await page.getByRole('heading', { name: 'No submissions yet' }).waitFor(); assert.equal(await page.getByText('Discuss materials for written practice', { exact: true }).count(), 0);
 // Additional outcomes and the progression response route use independent fresh evidence.
 for (const outcome of ['declined', 'closed']) {
  await page.evaluate(source => sessionStorage.setItem('mosaic-user-demo-v1', source), JSON.stringify(fixture)); await page.reload(); await open(); await role('Administration').click(); await nav('Support requests'); await button('Open submitted evidence').click(); await decide(outcome, `Demo support ${outcome}`); assert.equal((await read()).reviews.decisions.at(-1).outcome, outcome);
 }
 let progression = freshDemo(); progression.signedIn = progression.onboarded = true; progression.profile.name = 'Progression learner'; progression.profile.adult = true;
 progression = syncLearner(progression); const course = progression.learning.courses[0]; progression.learning = enrol(progression.learning, 'user-demo', course.id); const entry = progression.learning.enrolments[0];
 progression.learning = updateEnrolment(progression.learning, entry.id, { lessons: course.lessons.map((_,i) => i), scores: [100], submitted: 'Completed written practical example', approved: true });
 progression = submitTeaching(progression, { route: 'progression', skill: course.skills[0], examples: 'Demonstrated completed work', explanation: 'Break the task into small steps', accessibility: 'Provide plain text' }).demo;
 await page.evaluate(source => sessionStorage.setItem('mosaic-user-demo-v1', source), JSON.stringify(updateSharedDemo(freshSharedDemo(), progression))); await page.reload(); await open(); await role('Administration').click(); await nav('Trainer applications'); await button('Open submitted evidence').click(); await decide('needs-changes', 'Clarify one step');
 await role('User').click(); await nav('Teach others', false); assert.equal(await page.getByLabel('Practical work from my completed course').inputValue(), 'Demonstrated completed work'); assert.equal(await page.getByRole('group', { name: 'Application route', exact: true }).count(), 0); await page.getByLabel('Response to requested changes').fill('Clarified step one'); await button('Resubmit trainer/mentor response').click(); await role('Administration').click(); await button('Open latest evidence').click(); await decide('declined', 'More preparation needed'); assert.equal((await read()).reviews.roster.length, 0); await audit('progression-declined');
 assert.deepEqual(errors, []); assert.deepEqual(posts, []); await writeFile('output/playwright/admin-wave2-axe.json', JSON.stringify(audits, null, 2));
 console.log(`Administrator wave 2 passed: rubric, changes/clarification, stale evidence, approval roster, plan review/follow-up, history/reload, mobile; ${audits.length} axe audits; zero POST.`);
} catch (error) { await page.screenshot({ path: 'output/playwright/admin-wave2-error.png', fullPage: true }); console.log((await page.locator('body').innerText()).slice(-9000)); throw error; } finally { await browser.close(); }
