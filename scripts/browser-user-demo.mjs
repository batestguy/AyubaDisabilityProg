import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { courses } from '../output/tests/src/catalogue.js';
await mkdir('output/playwright', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
const errors = [], audits = [], writes = [];
page.on('pageerror', e => errors.push(e.message));
page.on('request', r => { if (r.method() === 'POST') writes.push(r.url()); });
const button = name => page.getByRole('button', { name, exact: true });
async function open() {
  await button('Projects & Possibilities').click();
  await page.getByRole('button', { name: 'Open the app demo', exact: false }).click();
}
async function nav(name) {
  const toggle = button('My pathway menu');
  if (await toggle.isVisible() && await toggle.getAttribute('aria-expanded') === 'false') await toggle.click();
  await page.getByRole('navigation', { name: 'My pathway', exact: true }).getByRole('button', { name, exact: true }).click();
}
async function audit(name) {
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  audits.push({ name, violations: result.violations });
  assert.deepEqual(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), [], name);
}
await page.goto('http://127.0.0.1:5173'); await open();
await audit('welcome');
await button('Start my demo journey').click();
await page.getByLabel('Display name', { exact: true }).fill('Tola (demo)');
await button('Continue').click();
await page.getByRole('alert').filter({ hasText: 'confirm you are aged' }).waitFor();
assert.equal(await page.getByRole('alert').evaluate(e => e === document.activeElement), true);
await page.getByLabel('I confirm I am aged 18 or above').check();
await button('Continue').click();
await page.getByLabel('LGA (optional)', { exact: true }).fill('Sample LGA');
await button('Back').click(); await button('Continue').click();
assert.equal(await page.getByLabel('LGA (optional)', { exact: true }).inputValue(), 'Sample LGA');
await page.reload(); await open();
assert.equal(await page.getByLabel('LGA (optional)', { exact: true }).inputValue(), 'Sample LGA');
await button('Skip optional step').click(); await audit('access-step');
await button('Skip optional step').click(); await button('Skip optional step').click();
await audit('skills-step');
await button('Skip optional step').click(); await button('Skip optional choices and finish').click();
await page.getByRole('heading', { name: 'Welcome, Tola (demo).' }).waitFor();
let stored = await page.evaluate(() => JSON.parse(sessionStorage.getItem('mosaic-user-demo-v1')).user);
assert.deepEqual(stored.profile.disabilities, []); assert.equal(stored.profile.gender, ''); assert.equal(stored.profile.certificates, '');
await audit('overview');
await nav('My profile'); await button('Edit my profile').click();
await button('Continue').click(); await button('Continue').click();
await page.getByLabel('Physical or mobility', { exact: true }).check();
await page.getByLabel('Hearing', { exact: true }).check();
await page.getByLabel('Larger text', { exact: true }).check();
await page.getByLabel('Captions and transcripts', { exact: true }).check();
await button('Continue').click(); await button('Continue').click();
await page.getByLabel('Add sample files').setInputFiles({ name: 'bad.txt', mimeType: 'text/plain', buffer: Buffer.from('unsupported') });
await page.getByRole('alert').filter({ hasText: 'PDF, JPEG or PNG' }).waitFor();
await page.getByLabel('Add sample files').setInputFiles({ name: 'too-large.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(5 * 1024 * 1024 + 1) });
await page.getByRole('alert').filter({ hasText: '5 MB' }).waitFor();
await page.getByLabel('Add sample files').setInputFiles({ name: 'sample.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4 sample') });
await page.getByLabel('Description for sample.pdf').fill('Sample certificate, unverified');
await page.reload(); await open();
await page.getByLabel('Reselect sample.pdf to view').waitFor();
assert.equal(await page.getByLabel('Description for sample.pdf').inputValue(), 'Sample certificate, unverified');
await page.getByLabel('Reselect sample.pdf to view').setInputFiles({ name: 'sample.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4 sample') });
await button('View / download sample.pdf').waitFor();
await button('Continue').click();
await page.getByLabel('Employment', { exact: true }).check();
await page.getByLabel('Freelancing', { exact: true }).check();
await page.getByRole('checkbox', { name: /^Digital & AI Skills/ }).check();
await page.getByRole('checkbox', { name: /^People & Workplace Skills/ }).check();
await page.getByRole('checkbox', { name: /^Hands-On & Livelihood Skills/ }).check();
await button('Back').click(); await button('Continue').click();
await page.reload(); await open();
assert.equal(await page.getByRole('checkbox', { name: /^Hands-On & Livelihood Skills/ }).isChecked(), true);
await page.setViewportSize({ width: 390, height: 900 });
assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'mobile skill-area selection');
await page.screenshot({ path: 'output/playwright/user-demo-skill-areas.png', fullPage: true });
await page.setViewportSize({ width: 1440, height: 1000 });
await audit('skill-area-selection');
await page.getByLabel('Digital Essentials', { exact: true }).check();
await button('Open dashboard').click();
await page.getByLabel('Build my skills summary').check();
await page.getByLabel('Define a service I can offer').check();
stored = await page.evaluate(() => JSON.parse(sessionStorage.getItem('mosaic-user-demo-v1')).user);
assert.equal(stored.profile.disabilities.length, 2); assert.equal(stored.profile.access.length, 2); assert.equal(stored.checklist.length, 2);
assert.deepEqual(stored.profile.categories, ['digital', 'people', 'livelihoods']);
await nav('My learning');
await button('Hands-On & Livelihood Skills').click();
assert.equal(await page.getByRole('button', { name: /^Enrol / }).count(), 3);
await button('People & Workplace Skills').click();
assert.equal(await page.getByRole('button', { name: /^Enrol / }).count(), 1);
await button('All skill areas').click();
assert.equal(await page.getByRole('button', { name: /^Enrol / }).count(), 8);
for (const course of courses) {
  await nav('My learning'); await button(`Enrol ${course.title}`).click();
  if (course.delivery === 'foundation') await page.getByRole('heading', { name: 'Foundation learning and practice plan' }).waitFor();
  for (let i = 0; i < course.lessons.length; i++) {
    await page.getByText(`${i + 1}. ${course.lessons[i].title}`, { exact: true }).click();
    await button(`Mark lesson ${i + 1} complete`).click();
  }
  for (let i = 0; i < course.quiz.length; i++) await page.locator(`input[name="question-${i}"][value="${(course.quiz[i].answer + 1) % course.quiz[i].options.length}"]`).check();
  await button('Submit quiz').click(); await page.getByRole('status').filter({ hasText: 'Quiz score: 0%' }).waitFor();
  for (let i = 0; i < course.quiz.length; i++) await page.locator(`input[name="question-${i}"][value="${course.quiz[i].answer}"]`).check();
  await button('Submit quiz').click();
  await page.getByLabel('My practical work', { exact: true }).fill(`Sample practical work for ${course.title}`);
  await button('Submit practical work').click();
  assert.equal(await page.getByRole('heading', { name: 'Course complete · Demo achievement' }).count(), 0);
  await page.getByLabel('My question', { exact: true }).fill(`Help me practise ${course.title}`);
  await button('Send question').click();
  await page.getByText('Pending trainer reply — demo question', { exact: true }).waitFor();
  await page.getByText('Demo controls · Presenter actions', { exact: true }).click();
  await button('Add sample trainer feedback').click();
  assert.equal(await page.getByRole('heading', { name: 'Course complete · Demo achievement' }).count(), 0);
  await button('Approve submitted work in demo').click();
  await page.getByRole('button', { name: `Reply to question: ${`Help me practise ${course.title}`.slice(0, 50)}`, exact: true }).click();
  await page.getByRole('heading', { name: 'Course complete · Demo achievement' }).waitFor();
  if (course.delivery === 'foundation') {
    await button('View printable demo achievement').click();
    await page.getByRole('article', { name: 'Demo achievement record' }).getByText(/No observed trade competence is certified/).waitFor();
  }
  await button('Add completed work to portfolio').click();
  if (course.id === 'digital-essentials') {
    await button('View printable demo achievement').click(); await audit('completed-learning-and-print');
    await page.screenshot({ path: 'output/playwright/user-demo-learning.png', fullPage: true });
    // Even an identical submission requires explicit fresh approval.
    await button('Resubmit practical work').click();
    assert.equal(await page.getByRole('heading', { name: 'Course complete · Demo achievement' }).count(), 0);
    let d = await page.evaluate(() => JSON.parse(sessionStorage.getItem('mosaic-user-demo-v1')).user);
    assert.equal(d.portfolio.length, 0); assert.equal(d.learning.enrolments[0].approved, false);
    await button('Approve submitted work in demo').click(); await button('Add completed work to portfolio').click();
    await page.reload(); await open();
  }
}
await nav('My portfolio'); await audit('portfolio');
await page.getByRole('heading', { name: 'Demonstrated practical work' }).waitFor();
await nav('Tools and support'); await button('Submit demo support request').click();
await page.getByRole('alert').filter({ hasText: 'Describe what you need' }).waitFor();
await button('Add support item').click();
await page.getByLabel('What I need — item 1').fill('Accessible laptop and data');
await page.getByLabel('Already available — item 1').fill('Shared mobile phone');
await button('Submit demo support request').click();
assert.equal(await button('Demo request already submitted').isDisabled(), true);
await audit('support-pending');
await page.getByLabel('Already available — item 1').fill('Shared mobile phone and power bank');
await button('Submit demo support request').click();
await nav('Teach others');
await page.getByLabel('Learning progression', { exact: true }).check();
await page.getByLabel('Teaching preparation: explain one task clearly').fill('Open your learning folder. Choose New file. Give the file a clear name.');
await page.getByLabel('How I would make this lesson accessible').fill('Provide text, captions, keyboard instructions and flexible practice time.');
await button('Submit trainer/mentor demo application').click();
await page.getByRole('heading', { name: 'Trainer/mentor application: pending review' }).waitFor(); await audit('teaching-pending');
await nav('Overview');
for (const width of [1440, 768, 390]) {
  await page.setViewportSize({ width, height: 900 });
  for (const name of ['Overview', 'My learning', 'My portfolio', 'Tools and support', 'Teach others', 'My profile']) {
    await nav(name);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${name} overflow ${width}`);
  }
}
await nav('Overview'); await button('A+ Text').click();
assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'enlarged mobile overview');
await page.screenshot({ path: 'output/playwright/user-demo-mobile.png', fullPage: true }); await button('A+ Text').click();
await button('Sign out of demo').click(); await button('Resume demo').click();
await page.reload(); await open();
stored = await page.evaluate(() => JSON.parse(sessionStorage.getItem('mosaic-user-demo-v1')).user);
assert.equal(stored.learning.enrolments.filter(e => e.completedAt).length, courses.length); assert.equal(stored.teaching.status, 'pending');
const sandbox = await page.evaluate(() => sessionStorage.getItem('mosaic-v1'));
await button('Reset demo').click(); await button('Clear user demo records').click();
assert.equal(await page.evaluate(() => sessionStorage.getItem('mosaic-v1')), sandbox);
await button('Explore a sample profile').click(); await nav('Teach others');
await page.getByLabel('Learning progression', { exact: true }).check();
await page.getByText('Complete at least one course, including explicit sample trainer approval, to use this route.').waitFor();
await page.getByLabel('Existing experience', { exact: true }).check();
await page.getByLabel('Skill I could teach').fill('Sewing');
await page.getByLabel('Work examples and what I could teach').fill('I make bags. I could teach measuring fabric.');
await page.getByLabel('Teaching preparation: explain one task clearly').fill('Place a ruler along the fabric and mark a straight line.');
await page.getByLabel('How I would make this lesson accessible').fill('Offer large diagrams and clear text steps.');
await button('Submit trainer/mentor demo application').click();
await page.getByRole('heading', { name: 'Trainer/mentor application: pending review' }).waitFor();
assert.deepEqual(writes, []); assert.deepEqual(errors, []);
await writeFile('output/playwright/user-demo-accessibility.json', JSON.stringify(audits, null, 2));
await browser.close();
console.log('User demo passed: skill-area selection/filtering/persistence, optional onboarding, local attachments, all eight courses/retries/pending/sample review/resubmission, portfolio, support, both teaching routes, reset isolation, responsive/enlarged layouts and accessibility audits; zero POST requests.');
