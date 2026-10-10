import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { freshDemo, syncLearner, submitSupport, submitTeaching, submitWork, addToPortfolio, USER_LEARNER_ID } from '../output/tests/src/userDemo.js';
import { fresh as freshSandbox, enrol, updateEnrolment } from '../output/tests/src/store.js';

await mkdir('output/playwright', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const errors = [], writes = [], audits = [];
const key = 'mosaic-user-demo-v1', backupKey = 'mosaic-user-demo-v1-backup';
const sandboxValue = JSON.stringify(freshSandbox());
const button = (page, name) => page.getByRole('button', { name, exact: true });
const role = (page, name) => page.getByRole('tab', { name, exact: true });
async function open(page) {
 await button(page, 'Projects & Possibilities').click();
 await page.getByRole('button', { name: 'Open the app demo', exact: false }).click();
}
async function adminNav(page, name) {
 const toggle = button(page, 'Administration menu');
 if (await toggle.isVisible() && await toggle.getAttribute('aria-expanded') === 'false') await toggle.click();
 await page.getByRole('navigation', { name: 'Administration', exact: true }).getByRole('button', { name, exact: true }).click();
}
async function userNav(page, name) {
 const toggle = button(page, 'My pathway menu');
 if (await toggle.isVisible() && await toggle.getAttribute('aria-expanded') === 'false') await toggle.click();
 await page.getByRole('navigation', { name: 'My pathway', exact: true }).getByRole('button', { name, exact: true }).click();
}
async function audit(page, name) {
 const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
 audits.push({ name, violations: result.violations });
 assert.deepEqual(result.violations, [], `Accessibility violations: ${name}`);
}
async function createPage(source, denyMigration = false) {
 const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
 if (source !== undefined) await context.addInitScript(({ source, key, sandboxValue }) => {
  if (!sessionStorage.getItem('admin-fixture-initialized')) {
   sessionStorage.setItem(key, source); sessionStorage.setItem('mosaic-v1', sandboxValue);
   sessionStorage.setItem('admin-fixture-initialized', '1');
  }
 }, { source, key, sandboxValue });
 if (denyMigration) await context.addInitScript(key => {
  const original = Storage.prototype.setItem;
  window.restoreDemoStorage = () => { Storage.prototype.setItem = original; };
  Storage.prototype.setItem = function(k, value) { if (k === key) throw new DOMException('Simulated full storage', 'QuotaExceededError'); return original.call(this, k, value); };
 }, key);
 const page = await context.newPage();
 page.on('pageerror', e => errors.push(e.message));
 page.on('request', r => { if (r.method() === 'POST') writes.push(r.url()); });
 await page.goto('http://127.0.0.1:5173/'); await open(page);
 return { page, context };
}
const readSession = page => page.evaluate(key => JSON.parse(sessionStorage.getItem(key)), key);
const readRaw = (page, storageKey = key) => page.evaluate(key => sessionStorage.getItem(key), storageKey);
function metric(page, label) { return page.locator('.ma-metrics article').filter({ has: page.getByText(label, { exact: true }) }).locator('strong'); }

try {
 // Empty state, draft profile sharing and keyboard role-tab focus.
 const fresh = await createPage(); let page = fresh.page;
 await role(page, 'Administration').click();
 assert.equal(await metric(page, 'Learners').innerText(), '0'); await audit(page, 'admin-empty-overview');
 await adminNav(page, 'Learners'); await page.getByRole('heading', { name: 'No learner profile yet' }).waitFor(); await audit(page, 'admin-empty-learners');
 await button(page, 'Open User to create a profile').click();
 assert.equal(await role(page, 'User').evaluate(el => el === document.activeElement), true);
 await button(page, 'Start my demo journey').click(); await page.getByLabel('Display name', { exact: true }).fill('Draft learner');
 await role(page, 'User').focus(); await page.keyboard.press('ArrowRight');
 assert.equal(await role(page, 'Administration').evaluate(el => el === document.activeElement), true, 'hidden User must not steal role-tab focus');
 await page.getByRole('heading', { name: 'Draft learner', exact: true }).waitFor();
 await page.getByText('PROFILE INCOMPLETE', { exact: true }).waitFor();
 await adminNav(page, 'Overview'); assert.equal(await metric(page, 'Learners').innerText(), '1');
 await role(page, 'User').click(); assert.equal(await page.getByLabel('Display name', { exact: true }).inputValue(), 'Draft learner');
 await page.reload(); await open(page); assert.equal(await page.getByLabel('Display name', { exact: true }).inputValue(), 'Draft learner');
 await fresh.context.close();

 // Full legacy fixture: all eight completions, custom catalogue, pending requests and editing position.
 let legacy = freshDemo(); Object.assign(legacy.profile, { name: 'Legacy learner', adult: true, state: 'Bauchi', lga: 'Demo LGA', gender: 'Woman', disabilities: ['Hearing'], contact: 'Fictional contact', certificates: 'Unverified fictional certificate', access: ['Larger text', 'Plain language'], categories: ['digital', 'livelihoods'], goals: ['Employment'] });
 legacy.signedIn = true; legacy.onboarded = true; legacy.editingProfile = true; legacy.step = 2; legacy = syncLearner(legacy);
 for (const course of legacy.learning.courses) {
  legacy.learning = enrol(legacy.learning, USER_LEARNER_ID, course.id);
  const entry = legacy.learning.enrolments.find(e => e.courseId === course.id);
  legacy = submitWork(legacy, entry.id, `Fictional work for ${course.title}`);
  legacy.learning = updateEnrolment(legacy.learning, entry.id, { lessons: course.lessons.map((_, i) => i), scores: [0, 100], approved: true, feedback: 'Sample approval' });
  legacy = addToPortfolio(legacy, entry.id);
 }
 legacy = syncLearner(legacy);
 legacy.learning.courses.push({ ...structuredClone(legacy.learning.courses[0]), id: 'authored-draft', title: 'Retained authored draft', status: 'draft' });
 legacy.attachments.push({ id: 'attachment-1', name: 'fictional.pdf', type: 'application/pdf', size: 16, description: 'Fictional evidence' });
 legacy.support.push({ id: 'support-1', need: 'Accessible laptop', available: 'Shared device', priority: 'High' }); legacy = submitSupport(legacy);
 legacy = submitTeaching(legacy, { route: 'progression', skill: legacy.learning.courses[0].skills[0], examples: 'Fictional completed work', explanation: 'Explain a clear task', accessibility: 'Provide text instructions' }).demo;
 legacy.learning.requests.push({ id: 'question-1', learnerId: USER_LEARNER_ID, courseId: legacy.learning.courses[0].id, kind: 'question', text: 'Fictional learning question', createdAt: Date.now() });
 const original = JSON.stringify(legacy);
 const migrated = await createPage(original); page = migrated.page;
 await page.getByRole('heading', { name: 'Access preferences', exact: true }).waitFor();
 assert.equal(await readRaw(page, backupKey), original, 'exact source backed up');
 let saved = await readSession(page); assert.equal(saved.schemaVersion, 2); assert.deepEqual(saved.user, legacy);
 const metadata = saved.recordMetadata, initialHistory = saved.submissions, initialEvents = saved.events;
 await role(page, 'Administration').click(); await audit(page, 'admin-migrated-overview');
 assert.equal(await metric(page, 'Learners').innerText(), '1'); assert.equal(await metric(page, 'Course enrolments').innerText(), '8'); assert.equal(await metric(page, 'Completed courses').innerText(), '8');
 assert.equal(await metric(page, 'Unanswered learning questions').innerText(), '1'); assert.equal(await metric(page, 'Support requests pending review').innerText(), '1'); assert.equal(await metric(page, 'Trainer applications pending review').innerText(), '1');
 await page.screenshot({ path: 'output/playwright/admin-overview-desktop.png', fullPage: true });
 const beforeNavigation = await readRaw(page);
 await button(page, 'View learner').click(); await audit(page, 'admin-learner-detail');
 const privateSection = page.locator('details').filter({ has: page.getByText('Optional personal details and unverified evidence', { exact: true }) });
 assert.equal(await privateSection.getAttribute('open'), null);
 assert.equal(await page.getByText('Fictional contact', { exact: true }).isVisible(), false);
 await page.getByRole('heading', { name: 'Demonstrated portfolio', exact: true }).waitFor();
 assert.equal(await page.getByText('Foundation learning only', { exact: true }).count(), 3);
 assert.equal(await page.getByRole('button', { name: /Approve|Decline|Publish/ }).count(), 0, 'administrator remains read-only');
 await button(page, 'Back to learners').click();
 await page.getByLabel('Search learners by name or location').fill('Hearing'); await page.getByRole('heading', { name: 'No matching learner' }).waitFor();
 await audit(page, 'admin-search-empty'); await button(page, 'Clear learner filters').click();
 await page.getByLabel('Search learners by name or location').fill('Bauchi'); await button(page, 'View learner details').waitFor();
 await page.getByLabel('Profile status', { exact: true }).selectOption('incomplete'); await page.getByRole('heading', { name: 'No matching learner' }).waitFor();
 await button(page, 'Clear learner filters').click(); assert.equal(await readRaw(page), beforeNavigation, 'read-only navigation does not change saved history');
 await page.reload(); await open(page); saved = await readSession(page);
 assert.deepEqual(saved.recordMetadata, metadata); assert.deepEqual(saved.submissions, initialHistory); assert.deepEqual(saved.events, initialEvents);

 // User changes propagate immediately; role changes preserve file metadata and editing state.
 await button(page, 'Return to dashboard').click(); await userNav(page, 'Tools and support');
 await page.getByLabel('Already available — item 1').fill('Updated shared device'); await button(page, 'Submit demo support request').click();
 saved = await readSession(page); assert.equal(saved.submissions.filter(s => s.kind === 'support').length, 2);
 await role(page, 'Administration').click(); await button(page, 'View support requests pending review').click();
 assert.equal(await page.getByRole('heading', { name: 'Support requests', exact: true }).evaluate(el => el === document.activeElement), true);
 await button(page, 'Open submitted evidence').waitFor();
 await adminNav(page, 'Learners'); await button(page, 'View learner details').click();
 await page.getByText('Support submission history (2)', { exact: true }).click();
 await page.getByText(/Already available: Shared device/, { exact: false }).waitFor();
 await role(page, 'User').click(); await userNav(page, 'My learning'); await button(page, 'Resume Digital Essentials').click();
 await button(page, 'Resubmit practical work').click();
 saved = await readSession(page); assert.equal(saved.user.learning.enrolments[0].approved, false); assert.equal(saved.user.portfolio.length, 7);
 const workSnapshots = saved.submissions.filter(s => s.kind === 'work' && s.recordId === saved.user.learning.enrolments[0].id);
 assert.equal(workSnapshots.length, 2); assert.equal(workSnapshots[0].submittedAt, null); assert.ok(workSnapshots[1].submittedAt > 0);
 await role(page, 'Administration').click(); await adminNav(page, 'Overview');
 assert.equal(await metric(page, 'Completed courses').innerText(), '7'); assert.equal(await metric(page, 'Practical work awaiting review').innerText(), '1');
 await role(page, 'User').click(); await button(page, 'Sign out of demo').click();
 await role(page, 'Administration').click(); assert.equal(await metric(page, 'Learners').innerText(), '1');
 await role(page, 'User').click(); await button(page, 'Resume demo').click();
 await userNav(page, 'My profile'); await button(page, 'Edit my profile').click(); await page.getByLabel('Display name', { exact: true }).fill('Updated learner');
 await role(page, 'Administration').click(); await button(page, 'View learner').click(); await page.getByRole('heading', { name: 'Updated learner', exact: true }).waitFor();
 await role(page, 'User').click(); await button(page, 'Return to dashboard').click();
 await role(page, 'Administration').click();
 for (const width of [1440, 768, 390]) {
  await page.setViewportSize({ width, height: 900 });
  for (const name of ['Overview', 'Learners']) { await adminNav(page, name); assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${name} overflow ${width}`); }
  await button(page, 'View learner details').click(); assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `detail overflow ${width}`);
 }
 await button(page, 'A+ Text').click(); assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'global larger-text detail overflow');
 await audit(page, 'admin-mobile-large-detail'); await page.screenshot({ path: 'output/playwright/admin-learner-mobile.png', fullPage: true }); await page.screenshot({ path: 'output/playwright/admin-learner-mobile-view.png' }); await button(page, 'A+ Text').click();
 await role(page, 'User').focus(); await page.keyboard.press('ArrowRight'); assert.equal(await role(page, 'Administration').evaluate(el => el === document.activeElement), true);
 await role(page, 'User').click(); await button(page, 'Reset demo').click(); await button(page, 'Keep my demo').click(); assert.equal((await readSession(page)).user.profile.name, 'Updated learner');
 await button(page, 'Reset demo').click(); await button(page, 'Clear user demo records').click();
 saved = await readSession(page); assert.equal(saved.user.profile.name, ''); assert.deepEqual(saved.submissions, []); assert.deepEqual(saved.events, []); assert.equal(await readRaw(page, backupKey), null); assert.equal(await readRaw(page, 'mosaic-v1'), sandboxValue);
 await role(page, 'Administration').click(); await adminNav(page, 'Overview'); assert.equal(await metric(page, 'Learners').innerText(), '0');
 await migrated.context.close();

 // Recovery never overwrites bad data; cancel/reset scope is explicit.
 const corrupt = await createPage('{broken-saved-data'); page = corrupt.page;
 await page.getByRole('heading', { name: 'Saved demo needs attention', exact: true }).waitFor(); assert.equal(await readRaw(page), '{broken-saved-data');
 await audit(page, 'admin-recovery'); await button(page, 'Retry loading saved demo').click(); assert.equal(await readRaw(page), '{broken-saved-data');
 await button(page, 'Reset saved demo').click(); await button(page, 'Keep saved records').click(); assert.equal(await readRaw(page), '{broken-saved-data');
 await button(page, 'Reset saved demo').click(); await button(page, 'Confirm reset saved demo').click(); await button(page, 'Start my demo journey').waitFor(); assert.equal(await readRaw(page, 'mosaic-v1'), sandboxValue);
 await corrupt.context.close();

 // Write failure retains in-memory changes and last saved state.
 const blocked = await createPage(); page = blocked.page;
 const persisted = await readRaw(page);
 await page.evaluate(({ key }) => { const original = Storage.prototype.setItem; window.restoreDemoStorage = () => { Storage.prototype.setItem = original; }; Storage.prototype.setItem = function(k, value) { if (k === key) throw new DOMException('Simulated full storage', 'QuotaExceededError'); return original.call(this, k, value); }; }, { key });
 await button(page, 'Explore a sample profile').click(); await page.getByRole('alert').filter({ hasText: 'Your changes remain in memory' }).waitFor();
 await role(page, 'Administration').click(); assert.equal(await metric(page, 'Learners').innerText(), '1'); assert.equal(await readRaw(page), persisted);
 await audit(page, 'admin-storage-warning');
 await page.evaluate(() => window.restoreDemoStorage()); await button(page, 'Retry saving this session').click();
 assert.equal((await readSession(page)).user.profile.name, 'Amina (sample)'); assert.equal(await page.getByRole('alert').count(), 0);
 await blocked.context.close();

 // A valid migration that cannot be persisted remains editable; retry preserves those edits.
 const memoryMigration = await createPage(original, true); page = memoryMigration.page;
 await page.getByRole('alert').filter({ hasText: 'Your changes remain in memory' }).waitFor();
 await page.getByRole('heading', { name: 'Access preferences', exact: true }).waitFor();
 assert.equal(await readRaw(page), original);
 await role(page, 'Administration').click(); assert.equal(await metric(page, 'Completed courses').innerText(), '8');
 await role(page, 'User').click(); await button(page, 'Return to dashboard').click(); await userNav(page, 'My profile'); await button(page, 'Edit my profile').click();
 await page.getByLabel('Display name', { exact: true }).fill('Memory-only learner');
 await role(page, 'Administration').click(); await button(page, 'View learner').click(); await page.getByRole('heading', { name: 'Memory-only learner', exact: true }).waitFor();
 await page.evaluate(() => window.restoreDemoStorage()); await button(page, 'Retry saving this session').click();
 assert.equal((await readSession(page)).user.profile.name, 'Memory-only learner'); assert.equal(await readRaw(page, backupKey), original);
 await memoryMigration.context.close();

 assert.deepEqual(errors, []); assert.deepEqual(writes, []);
 await writeFile('output/playwright/admin-accessibility.json', JSON.stringify(audits, null, 2));
 console.log(`Administrator wave 1 passed: exact legacy migration, all8 retained completions, live role sharing, histories/resubmission, read-only views, private fields, search/empty states, keyboard focus, reload/signout/reset isolation, responsive/larger text, recovery/storage errors; ${audits.length} axe audits; zero POST requests.`);
} finally { await browser.close(); }
