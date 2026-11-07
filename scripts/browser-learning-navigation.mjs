import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

await mkdir('output/playwright', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext();
const page = await context.newPage();
const errors = [], posts = [], audits = [];
page.on('pageerror', error => errors.push(error.message));
page.on('request', request => { if (request.method() === 'POST') posts.push(request.url()); });
const target = process.env.LEARNING_URL || 'http://127.0.0.1:5173/';
const button = name => page.getByRole('button', { name, exact: true });
async function audit(name) {
 const results = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
 assert.deepEqual(results.violations, [], name);
 audits.push(name);
}
try {
 await page.goto(target);
 assert.deepEqual(await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('button').allTextContents(), ['Home', 'Learning Sandbox', 'Research & Data Collection', 'About']);
 await button('Learning Sandbox').click();
 await page.getByRole('heading', { name: 'Learning Sandbox.', exact: true }).waitFor();
 assert.doesNotMatch(await page.locator('main').innerText(), /snowball|Bayesian|sampling/i);
 await audit('learning-entry');
 await button('Research & Data Collection').click();
 await page.getByRole('heading', { name: 'Research & Data Collection.', exact: true }).waitFor();
 await page.locator('.sampling-outline summary').click();
 assert.equal(await page.locator('.sampling-outline li').count(), 6);
 assert.equal(await page.locator('.research-page form').count(), 0);
 await audit('research-outline');
 await page.screenshot({ path: 'output/playwright/research-page-desktop.png', fullPage: true });
 await button('Learning Sandbox').click();
 await page.getByRole('button', { name: 'Open the app demo', exact: false }).click();
 assert.equal(await button('Learning Sandbox').getAttribute('aria-current'), 'page');
 const savedBefore = await page.evaluate(() => localStorage.getItem('mosaic-connected-v1'));
 const heading = page.locator('#cd-signin');
 for (const mobile of [false, true]) {
  await page.setViewportSize(mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 });
  await page.evaluate(mobile => document.documentElement.style.fontSize = mobile ? '200%' : '', mobile);
  for (const [role, username, desk] of [['Learner','ada','Your next steps'],['Facilitator','amaka','Your teaching desk'],['Administration','admin','Administration action queue']]) {
   await button(`Use ${role} interface`).focus();
   await page.keyboard.press('Enter');
   await page.waitForFunction(() => document.activeElement?.id === 'cd-signin');
   assert.equal(await page.getByLabel('Username', { exact: true }).inputValue(), username);
   const bounds = await heading.boundingBox();
   assert.ok(bounds.y >= 0 && bounds.y < 90, `${role}: sign-in heading scrolled to top (${bounds.y})`);
   assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
   if (role === 'Facilitator') await page.screenshot({ path: `output/playwright/facilitator-signin-${mobile ? 'mobile' : 'desktop'}.png` });
   // The role button selects credentials; signing in still requires a separate action.
   assert.equal(await button('Sign out').count(), 0);
   await button('Sign in').click();
   await page.getByRole('heading', { name: desk, exact: true }).waitFor();
   await button('Sign out').click();
  }
  await audit(mobile ? 'signin-mobile-200' : 'signin-desktop');
  await button('Research & Data Collection').click();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  if (mobile) await audit('research-mobile-200');
  await button('Learning Sandbox').click();
  await page.getByRole('button', { name: 'Open the app demo', exact: false }).click();
 }
 assert.equal(await page.evaluate(() => localStorage.getItem('mosaic-connected-v1')), savedBefore);
 const nojsContext = await browser.newContext({ javaScriptEnabled: false });
 const nojs = await nojsContext.newPage();
 await nojs.goto(target);
 assert.deepEqual(await nojs.getByRole('navigation', { name: 'Main navigation' }).getByRole('link').allTextContents(), ['Home', 'Learning Sandbox', 'Research & Data Collection', 'About']);
 assert.doesNotMatch(await nojs.locator('#static-explore').innerText(), /sampling|Bayesian|snowball/i);
 assert.equal(await nojs.locator('#static-research details').count(), 1);
 await nojsContext.close();
 assert.deepEqual(errors, []);
 assert.deepEqual(posts, []);
 await writeFile('output/playwright/learning-navigation-results.json', JSON.stringify({ audits, errors, posts, storagePreserved: true }, null, 2));
 console.log(`Learning navigation passed: ${audits.length} clean accessibility audits, six keyboard role selections/sign-ins, desktop/mobile 200% scroll and reflow, unchanged storage, static parity, zero errors/POST.`);
} finally {
 await browser.close();
}
