import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { freshSharedDemo, updateSharedDemo } from '../output/tests/src/sharedDemo.js';
import { syncLearner, submitTeaching, submitWork } from '../output/tests/src/userDemo.js';
import { enrol } from '../output/tests/src/store.js';
import { decideReview, reviewRecord } from '../output/tests/src/reviewDemo.js';
import { assignLearning } from '../output/tests/src/coordinationDemo.js';

await mkdir('output/playwright', { recursive: true });
let session = freshSharedDemo();
let demo = syncLearner({ ...session.user, signedIn: true, onboarded: true, profile: { ...session.user.profile, name: 'Fictional teaching learner', adult: true } });
demo.learning = enrol(demo.learning, 'user-demo', 'digital-essentials');
const enrolment = demo.learning.enrolments[0];
demo = submitWork(demo, enrolment.id, 'Original assigned practical evidence');
demo.learning.requests.push({ id: 'facilitator-question', learnerId: 'user-demo', courseId: 'digital-essentials', kind: 'question', text: 'How do I make the instructions clearer?', createdAt: Date.now() });
demo = submitTeaching(demo, { route: 'experience', skill: 'Digital foundation mentoring', examples: 'Fictional teaching example', explanation: 'Short clear steps', accessibility: 'Text-first flexible pacing' }).demo;
session = updateSharedDemo(session, demo, { kind: 'work-submitted', recordId: enrolment.id });
const review = reviewRecord(session, 'teaching');
session = decideReview(session, { kind: 'teaching', submissionId: review.submission.id, expectedRevision: review.submission.revision, outcome: 'approved', reason: 'Simulated mentoring only', reviewer: 'Demo administrator', checklist: { skill: true, examples: true, explanation: true, accessibility: true } }).session;
const unassigned = structuredClone(session);
for (const [kind, recordId] of [['course', 'digital-essentials'], ['enrolment', enrolment.id], ['question', 'facilitator-question']]) {
 const result = assignLearning(session, { kind, recordId, expectedRevision: session.recordMetadata[`${kind}:${recordId}`].revision, rosterId: 'user-demo-trainer', suitabilityNote: 'Text-first digital foundation mentoring', reason: 'Inspect assigned learning evidence', reviewer: 'Demo administrator', ...(kind === 'enrolment' ? { submissionId: session.submissions.filter(s => s.kind === 'work').at(-1).id } : {}) });
 assert.equal(result.error, undefined); session = result.session;
}
// Resubmission must display the assigned snapshot, not substitute newer work.
session = updateSharedDemo(session, submitWork(session.user, enrolment.id, 'Newer unassigned practical evidence'), { kind: 'work-submitted', recordId: enrolment.id });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
const errors = [], posts = [], audits = [];
page.on('pageerror', e => errors.push(e.message));
page.on('request', r => { if (r.method() === 'POST') posts.push(r.url()); });
const button = name => page.getByRole('button', { name, exact: true });
const role = name => page.getByRole('tab', { name, exact: true });
async function open() { await button('Projects & Possibilities').click(); await page.getByRole('button', { name: 'Open the app demo', exact: false }).click(); await role('Facilitator').click(); }
async function audit(name) { const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze(); audits.push({ name, violations: result.violations }); assert.deepEqual(result.violations, [], name); }
async function nav(name) { const toggle = button('Facilitator menu'); if (await toggle.isVisible() && await toggle.getAttribute('aria-expanded') === 'false') await toggle.click(); await page.getByRole('navigation', { name: 'Facilitator', exact: true }).getByRole('button', { name, exact: true }).click(); }
const read = () => page.evaluate(() => sessionStorage.getItem('mosaic-user-demo-v1'));
try {
 await page.goto('http://127.0.0.1:5173/?workspace=earlier'); await open();
 await page.getByRole('heading', { name: 'No approved demo trainers yet' }).waitFor(); await audit('facilitator-empty');
 await button('Open Administration').click(); assert.equal(await role('Administration').getAttribute('aria-selected'), 'true');
 await page.evaluate(raw => sessionStorage.setItem('mosaic-user-demo-v1', raw), JSON.stringify(unassigned));
 await page.reload(); await open(); await page.getByLabel('Demo facilitator identity').selectOption('user-demo-trainer');
 await page.getByText('No assignments yet.', { exact: false }).waitFor(); await audit('facilitator-unassigned');
 await page.evaluate(raw => sessionStorage.setItem('mosaic-user-demo-v1', raw), JSON.stringify(session));
 await page.reload(); await open(); await page.getByRole('heading', { name: 'Choose your demo identity' }).waitFor(); await audit('facilitator-no-identity');
 await page.getByLabel('Demo facilitator identity').selectOption('user-demo-trainer');
 await page.getByRole('heading', { name: 'Start with the assigned evidence.' }).waitFor();
 const baseline = await read(); await audit('facilitator-overview');
 await nav('Practical submissions'); await page.locator('summary').filter({ hasText: 'Inspect assigned practical evidence' }).click();
 await page.getByText('Original assigned practical evidence', { exact: true }).waitFor();
 assert.equal(await page.getByText('Newer unassigned practical evidence', { exact: true }).count(), 0);
 await page.getByText('Evidence changed since assignment.', { exact: false }).waitFor();
 await page.locator('summary').filter({ hasText: 'Retained course requirements' }).click(); await audit('facilitator-practical');
 await page.getByLabel('Assignment evidence', { exact: true }).selectOption('current'); await page.getByRole('heading', { name: 'No matching assignments' }).waitFor();
 await button('Clear assignment filters').click(); await page.getByLabel('Search assigned learning').fill('unmatched'); await page.getByRole('heading', { name: 'No matching assignments' }).waitFor();
 await nav('Learning questions'); await page.locator('summary').filter({ hasText: 'Inspect learning question' }).click(); await page.getByText('How do I make the instructions clearer?', { exact: true }).waitFor(); await audit('facilitator-question');
 await nav('Assigned courses'); await page.getByRole('heading', { name: 'Digital Essentials', exact: true }).waitFor();
 await page.setViewportSize({ width: 390, height: 844 }); await audit('facilitator-mobile'); assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
 await page.screenshot({ path: 'output/playwright/facilitator-mobile.png', fullPage: true });
 await nav('Practical submissions'); await page.locator('summary').filter({ hasText: 'Inspect assigned practical evidence' }).click();
 await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; }); await audit('facilitator-enlarged'); assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
 await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
 await role('User').click(); await role('Facilitator').click(); assert.equal(await page.getByLabel('Demo facilitator identity').inputValue(), '');
 assert.equal(await read(), baseline, 'read-only browsing preserves all persisted bytes');
 await page.setViewportSize({ width: 1440, height: 1000 });
 await page.getByLabel('Demo facilitator identity').selectOption('user-demo-trainer');
 const coursesButton = page.getByRole('navigation', { name: 'Facilitator', exact: true }).getByRole('button', { name: 'Assigned courses', exact: true });
 await coursesButton.focus(); await page.keyboard.press('Enter'); assert.equal(await coursesButton.getAttribute('aria-current'), 'page');
 await nav('Overview'); await page.screenshot({ path: 'output/playwright/facilitator-desktop.png', fullPage: true });
 await page.reload(); await open(); assert.equal(await page.getByLabel('Demo facilitator identity').inputValue(), '');
 assert.deepEqual(errors, []); assert.deepEqual(posts, []);
 await writeFile('output/playwright/facilitator-axe.json', JSON.stringify(audits, null, 2));
 console.log(`Facilitator wave 1 passed: ${audits.length} clean axe audits; assigned snapshots, stale evidence, search, mobile/enlarged text, role exit, reload, unchanged saved bytes and zero POST.`);
} catch (error) { await page.screenshot({ path: 'output/playwright/facilitator-failure.png', fullPage: true }); console.error((await page.locator('body').innerText()).slice(-6500)); throw error; }
finally { await browser.close(); }
