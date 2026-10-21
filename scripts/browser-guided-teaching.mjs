import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { freshSharedDemo, updateSharedDemo } from '../output/tests/src/sharedDemo.js';
import { fresh as freshSandbox } from '../output/tests/src/store.js';

await mkdir('output/playwright', { recursive: true });
const initial = freshSharedDemo();
const existing = updateSharedDemo(initial, { ...initial.user, profile: { ...initial.user.profile, name: 'Preserved existing profile' } });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1050 } });
await context.addInitScript(({ raw, sandbox }) => { if (!sessionStorage.getItem('guided-test-initialized')) { sessionStorage.setItem('mosaic-user-demo-v1', raw); sessionStorage.setItem('mosaic-v1', sandbox); sessionStorage.setItem('guided-test-initialized', 'true'); } }, { raw: JSON.stringify(existing), sandbox: JSON.stringify(freshSandbox()) });
const page = await context.newPage(); const errors = [], posts = [], audits = [];
const target = process.env.GUIDED_DEMO_URL || 'http://127.0.0.1:5173/?workspace=earlier';
if (process.env.GUIDED_CSP) {
 const headers = await readFile('public/_headers', 'utf8');
 const csp = headers.split('\n').find(line => line.includes('Content-Security-Policy:')).split('Content-Security-Policy:')[1].trim();
 await page.route(`${new URL(target).origin}/`, async route => { const response = await route.fetch(); await route.fulfill({ response, headers: { ...response.headers(), 'content-security-policy': csp } }); });
}
page.on('pageerror', e => errors.push(e.message)); page.on('request', r => { if (r.method() === 'POST') posts.push(r.url()); });
const button = name => page.getByRole('button', { name, exact: true });
const role = name => page.getByRole('tab', { name, exact: true });
const guide = () => page.getByRole('region', { name: 'Guided walkthrough', exact: true });
const saved = () => page.evaluate(() => JSON.parse(sessionStorage.getItem('mosaic-guided-teaching-v1')));
async function open() { await button('Projects & Possibilities').click(); await page.getByRole('button', { name: 'Open the app demo', exact: false }).click(); }
async function sample() { await button('Open guided teaching demo').click(); }
async function next() { await guide().getByRole('button').click(); }
async function nav(name) { const toggle = button('Teaching demo menu'); if (await toggle.isVisible() && await toggle.getAttribute('aria-expanded') === 'false') await toggle.click(); await page.getByRole('navigation', { name: 'Teaching demo', exact: true }).getByRole('button', { name, exact: true }).click(); }
async function audit(name) { const result = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze(); audits.push({ name, violations: result.violations }); assert.deepEqual(result.violations, [], name); }
try {
 await page.goto(target); await open();
 const existingBytes = await page.evaluate(() => sessionStorage.getItem('mosaic-user-demo-v1'));
 const sandboxBytes = await page.evaluate(() => sessionStorage.getItem('mosaic-v1'));
 await sample(); await page.getByRole('heading', { name: 'Help each learner move forward.' }).waitFor(); await audit('guided-overview');
 await page.screenshot({ path: 'output/playwright/guided-teaching-desktop.png', fullPage: true });
 await nav('My learners'); await page.getByLabel('Fictional learner').selectOption('sani');
 await page.getByRole('heading', { name: 'Sani Musa', exact: true }).waitFor(); await page.getByText('Quiz: 60%', { exact: false }).waitFor();
 await next(); await page.getByLabel('Feedback for the learner').fill('Add a safe filename and explain an offline backup for weak connectivity.');
 await button('Request changes').click(); assert.equal((await saved()).events.length, 1);
 await next(); assert.equal(await role('User').getAttribute('aria-selected'), 'true');
 await page.getByLabel('Your revised practical work').fill('Use customer-order-October.txt, keep an offline copy, adjust text size and send a clear sample message without sharing passwords.');
 await button('Submit revised work').click(); assert.equal((await saved()).events.length, 2);
 await next(); assert.equal(await role('Administration').getAttribute('aria-selected'), 'true'); assert.equal(await button('Approve practical work').count(), 0);
 await page.getByLabel('Assignment note').fill('Assign Ada’s revised evidence to Amaka for a fresh digital foundation review.'); await button('Assign latest work').click();
 await next(); assert.equal(await role('Facilitator').getAttribute('aria-selected'), 'true');
 await page.getByLabel('Approval feedback').fill('The revised plan explains clear filenames, offline access and safe communication.'); await button('Approve practical work').click();
 await nav('My learners'); await page.getByLabel('Fictional learner').selectOption('ada'); await page.getByText('Demo course completed', { exact: false }).waitFor(); await audit('guided-approved');
 await next(); await page.getByLabel('Your reply').fill('Save the permitted text lessons when connected. Read them offline and write questions to send when your connection returns.'); await button('Send learning reply').click();
 await role('User').click(); await page.getByText('Save the permitted text lessons when connected.', { exact: false }).waitFor(); await audit('guided-learner-reply');
 await next(); await page.getByLabel('Support referral note').fill('Sani needs an accessible offline lesson pack and a flexible check-in time. Please coordinate an option with the learner.'); await button('Refer to Administration').click();
 await next(); await page.getByLabel('Support response').fill('Demo plan reviewed: arrange a text lesson pack and agree a check-in with Sani. No equipment or service delivery is recorded.'); await button('Record support response').click();
 await guide().getByText('WALKTHROUGH COMPLETE', { exact: true }).waitFor();
 await role('User').click(); await page.getByText('Demo plan reviewed:', { exact: false }).waitFor(); await audit('guided-support-response');
 assert.equal((await saved()).events.length, 7); await nav('Activity history'); assert.equal(await page.locator('.gt-history li').count(), 7); await audit('guided-history');
 await page.reload(); await open(); await sample(); await guide().getByText('WALKTHROUGH COMPLETE', { exact: true }).waitFor();
 await nav('My courses'); await page.locator('summary').filter({ hasText: 'lesson outlines' }).focus(); await page.keyboard.press('Enter'); await page.getByRole('heading', { name: '1. Make your device work for you' }).waitFor();
 await page.setViewportSize({ width: 390, height: 844 }); await nav('My learners'); await audit('guided-mobile'); assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
 await page.screenshot({ path: 'output/playwright/guided-teaching-mobile.png', fullPage: true });
 await button('Use larger text').click(); await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; }); await audit('guided-large-text'); assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false); await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
 await button('Return to my existing demo').click(); assert.equal(await page.evaluate(() => sessionStorage.getItem('mosaic-user-demo-v1')), existingBytes); assert.equal(await page.evaluate(() => sessionStorage.getItem('mosaic-v1')), sandboxBytes);
 await sample(); await button('Restart guided scenario').click(); await button('Keep sample progress').click(); assert.equal((await saved()).events.length, 7);
 await button('Restart guided scenario').click(); await button('Confirm restart guided demo').click(); assert.equal(await page.evaluate(() => sessionStorage.getItem('mosaic-guided-teaching-v1')), null); await guide().getByText('Review Ada’s first submission', { exact: true }).waitFor();
 // Malformed scenario data must never overwrite either itself or existing records.
 await page.evaluate(() => sessionStorage.setItem('mosaic-guided-teaching-v1', '{malformed'));
 await page.reload(); await open(); await sample(); await page.getByRole('heading', { name: 'Saved guided demo needs attention' }).waitFor();
 assert.equal(await page.evaluate(() => sessionStorage.getItem('mosaic-guided-teaching-v1')), '{malformed'); await audit('guided-recovery');
 assert.equal(await page.evaluate(() => sessionStorage.getItem('mosaic-user-demo-v1')), existingBytes);
 assert.deepEqual(errors, []); assert.deepEqual(posts, []);
 await writeFile('output/playwright/guided-teaching-axe.json', JSON.stringify(audits, null, 2));
 console.log(`Guided teaching passed: ${audits.length} clean axe audits, 7 cross-role actions, completion gates, reload/reset/recovery, mobile/enlarged text, preserved existing records and zero POST.`);
} catch (error) { console.error((await page.locator('body').innerText()).slice(-9500)); await page.screenshot({ path: 'output/playwright/guided-teaching-failure.png', fullPage: true }); throw error; }
finally { await browser.close(); }
