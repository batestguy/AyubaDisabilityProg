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
async function artworkVisible() {
 const network = page.getByRole('figure', { name: 'How the Learning Sandbox connects' });
 await network.waitFor({ state: 'visible' });
 const title = page.getByRole('heading', { name: 'Learning Sandbox.', level: 1, exact: true });
 assert.equal(await title.count(), 1);
 assert.ok(await title.evaluate(node => !!(node.compareDocumentPosition(document.querySelector('.roles-network')) & Node.DOCUMENT_POSITION_FOLLOWING)), 'Learning Sandbox heading precedes the roles network');
 assert.equal(await page.locator('.sandbox-story').count(), 0, 'Learner story is removed');
 assert.equal(await page.locator('img[src*="sandbox-skills-rooms"], .remote-learning').count(), 0, 'Older artwork is removed');
 assert.equal(await network.locator('.roles-node').count(), 3, 'One node for each role');
 for (const role of ['Administration', 'Facilitators', 'Learners']) assert.equal(await network.getByRole('heading', { name: role, exact: true }).count(), 1);
 assert.equal(await network.locator('.roles-node li').count(), 18, 'Six duties per role');
 assert.equal(await network.locator('[data-connection]').count(), 3, 'Each role links to the other two');
 assert.equal(await network.locator('.roles-monitoring li').count(), 6, 'Six Administration monitoring steps');
}
async function audit(name) {
 const results = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
 assert.deepEqual(results.violations, [], name);
 audits.push(name);
}
try {
 await page.goto(target);
 assert.deepEqual(await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('button').allTextContents(), ['Home – Tribute to Gufwan', 'Research', 'Learning Sandbox', 'About']);
 assert.deepEqual(await page.getByRole('group', { name: 'Possible Projects' }).getByRole('button').allTextContents(), ['Research', 'Learning Sandbox']);
 await button('Learning Sandbox').click();
 await page.getByRole('heading', { name: 'Learning Sandbox.', exact: true }).waitFor();
 await artworkVisible();
 for (const [width, size, name, height] of [[1366, '', 'desktop', 768], [390, '', 'mobile', 844], [390, '200%', 'mobile-200', 844]]) {
  await page.setViewportSize({ width, height });
  await page.evaluate(size => document.documentElement.style.fontSize = size, size);
  await artworkVisible();
  if (!size) {
   await page.evaluate(() => scrollTo(0, 0));
   const story = await page.locator('.roles-network').boundingBox();
   assert.ok(story.y < height, `${name}: roles network begins in the initial viewport`);
   const drawn = await page.locator('.roles-lines line').count();
   assert.equal(drawn, width > 860 ? 3 : 0, `${name}: network lines drawn on wide screens only`);
  }
  await page.screenshot({ path: `output/playwright/sandbox-artwork-${name}.png`, fullPage: true });
 }
 await page.setViewportSize({ width: 1440, height: 1000 });
 await page.evaluate(() => document.documentElement.style.fontSize = '');
 assert.equal(await page.locator('.remote-flow,.remote-animation-toggle').count(), 0, 'Flowchart arrows are static');
 assert.match(await page.locator('.roles-network-intro').innerText(), /Administration sits at the top because it monitors every step/);
 assert.doesNotMatch(await page.locator('main').innerText(), /snowball|Bayesian|sampling/i);
 await audit('learning-entry');
 await button('Research').click();
 await page.frameLocator('#research-deck').locator('#menu-trigger').focus();
 await page.frameLocator('#research-deck').locator('#menu-trigger').click();
 await page.frameLocator('#research-deck').getByRole('link', {name:'Detailed Research proposal',exact:true}).click();
 await page.getByRole('heading', { name: 'Research & Data Collection.', exact: true }).waitFor();
 assert.equal(await page.locator('.sampling-outline').getAttribute('open'), '');
 assert.equal(await page.locator('.sampling-outline li').count(), 6);
 assert.equal(await page.getByRole('region', { name: 'Sampling methods and pilot time frames' }).locator('tbody tr').count(), 8);
 assert.deepEqual(await page.getByRole('region', { name: 'Sampling methods and pilot time frames' }).locator('thead th').allTextContents(), ['Stage', 'Statistical method', 'In everyday language', 'Practical time frame']);
 await page.emulateMedia({ reducedMotion: 'reduce' });
 assert.equal(await page.locator('.sampling-mini-group').first().evaluate(node => getComputedStyle(node).animationName), 'none');
 await page.emulateMedia({ reducedMotion: 'no-preference' });
 assert.equal(await page.locator('.research-page form').count(), 0);
 assert.equal(await page.locator('.sampling-blank,.sampling-spaces').count(), 0, 'Research has no empty placeholders');
 await audit('research-outline');
 await page.screenshot({ path: 'output/playwright/research-page-desktop.png', fullPage: true });
 await button('About').click();
 await page.getByRole('heading', { name: 'About.', exact: true }).waitFor();
 assert.equal(await page.locator('.empty-portrait,.empty-biography').count(), 0);
 assert.match(await page.locator('.about-page').innerText(), /The co-creators/);
 await audit('about-page');
 await page.screenshot({ path: 'output/playwright/about-page-desktop.png', fullPage: true });
 await button('Learning Sandbox').click();
 assert.equal(await button('Learning Sandbox').getAttribute('aria-current'), 'page');
 const savedBefore = await page.evaluate(() => localStorage.getItem('mosaic-connected-v1'));
 await artworkVisible();
 await page.screenshot({ path: 'output/playwright/sandbox-artwork-signin.png', fullPage: true });
 const heading = page.locator('#cd-signin');
 for (const mobile of [false, true]) {
  await page.setViewportSize(mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 });
  await page.evaluate(mobile => document.documentElement.style.fontSize = mobile ? '200%' : '', mobile);
  assert.equal(await page.getByLabel('Username', { exact: true }).count(), 0, 'Sign-in form is hidden before role selection');
  await page.getByRole('link', { name: 'Sign in to the sandbox', exact: false }).click();
  await page.waitForFunction(() => document.activeElement?.id === 'cd-role-choice');
  assert.equal(await page.getByRole('heading', { name: 'How would you like to sign in?', exact: true }).count(), 1);
  assert.equal(await page.locator('.cd-role-option').count(), 3);
  assert.equal(await page.getByLabel('Username', { exact: true }).count(), 0, 'Opening sign-in shows roles only');
  assert.equal(await page.locator('.cd-registration,.cd-funding-guide,.fresh-demo-controls,footer').count(), 0, 'Unrelated entry-page content is hidden');
  assert.equal(await page.getByRole('heading', { name: 'Find a facilitator', exact: true }).count(), 0);
  assert.equal(await button('Sign out').count(), 0, 'Role choice does not sign anyone in');
  await page.screenshot({ path: `output/playwright/signin-role-choice-${mobile ? 'mobile' : 'desktop'}.png` });
  for (const [role, username, desk] of [['Learner','ada','Your next steps'],['Facilitator','amaka','Your teaching desk'],['Administration','admin','Administration action queue']]) {
   await button(`Use ${role} interface`).focus();
   await page.keyboard.press('Enter');
   await page.waitForFunction(() => document.activeElement?.id === 'cd-signin');
   assert.equal(await page.getByLabel('Username', { exact: true }).inputValue(), username);
   assert.equal(await page.locator('.cd-registration').count(), role === 'Administration' ? 0 : 1, 'Registration applies only to learner and facilitator roles');
   if (role === 'Learner') {
    await button('Choose a different role').click();
    assert.equal(await page.getByLabel('Username', { exact: true }).count(), 0, 'Changing role hides the previous form');
    await button('Use Learner interface').click();
    await page.waitForFunction(() => document.activeElement?.id === 'cd-signin');
    if (!mobile) {
     await page.getByLabel('Username', { exact: true }).fill('admin');
     await page.getByLabel('Demo access code', { exact: true }).fill('DEMO-ADMIN');
     await button('Sign in').click();
     await page.getByRole('alert').filter({ hasText: 'This profile belongs to Administration' }).waitFor();
     assert.equal(await button('Sign out').count(), 0);
     await button('Use Learner interface').click();
     await page.waitForFunction(() => document.activeElement?.id === 'cd-signin');
    }
   }
   const bounds = await heading.boundingBox();
   assert.ok(bounds.y >= 0 && bounds.y + bounds.height <= page.viewportSize().height, `${role}: role-specific sign-in heading is visible (${bounds.y})`);
   assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
   if (role === 'Facilitator') await page.screenshot({ path: `output/playwright/facilitator-signin-${mobile ? 'mobile' : 'desktop'}.png` });
   // The role button selects credentials; signing in still requires a separate action.
   assert.equal(await button('Sign out').count(), 0);
   await button('Sign in').click();
   await page.getByRole('heading', { name: desk, exact: true }).waitFor();
   await page.locator('.roles-network').waitFor({ state: 'detached' });
   assert.equal(await page.locator('.roles-network').count(), 0, 'Roles network hides after sign-in');
   await button('Sign out').click();
   await artworkVisible();
  }
  await audit(mobile ? 'signin-mobile-200' : 'signin-desktop');
  await button('Research').click();
 await page.frameLocator('#research-deck').locator('#menu-trigger').focus();
 await page.frameLocator('#research-deck').locator('#menu-trigger').click();
 await page.frameLocator('#research-deck').getByRole('link', {name:'Detailed Research proposal',exact:true}).click();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  if (mobile) {
   const tableRegion = page.getByRole('region', { name: 'Sampling methods and pilot time frames' });
   await tableRegion.focus();
   await tableRegion.press('ArrowRight');
   await page.waitForFunction(() => document.querySelector('.sampling-table-scroll').scrollLeft > 0);
  }
  if (mobile) await audit('research-mobile-200');
  await button('Learning Sandbox').click();
 }
 assert.equal(await page.evaluate(() => localStorage.getItem('mosaic-connected-v1')), savedBefore);
 const nojsContext = await browser.newContext({ javaScriptEnabled: false });
 const nojs = await nojsContext.newPage();
 await nojs.goto(target);
 assert.deepEqual(await nojs.getByRole('navigation', { name: 'Main navigation' }).getByRole('link').allTextContents(), ['Home – Tribute to Gufwan', 'Research & Data Collection', 'Learning Sandbox', 'About']);
 assert.doesNotMatch(await nojs.locator('#static-explore').innerText(), /sampling|Bayesian|snowball/i);
 assert.equal(await nojs.locator('#static-research .sampling-outline[open]').count(), 1);
 assert.equal(await nojs.locator('#static-research .research-linear article').count(), 8);
 assert.equal(await nojs.locator('#static-app-demo').count(), 0);
 for (const section of ['#static-explore']) {
  assert.equal(await nojs.locator(`${section} .sandbox-artwork`).count(), 0);
  assert.equal(await nojs.locator(`${section} .roles-node`).count(), 3);
  assert.equal(await nojs.locator(`${section} .sandbox-story`).count(), 0);
 }
 await nojsContext.close();
 assert.deepEqual(errors, []);
 assert.deepEqual(posts, []);
 await writeFile('output/playwright/learning-navigation-results.json', JSON.stringify({ audits, errors, posts, storagePreserved: true }, null, 2));
 console.log(`Learning navigation passed: ${audits.length} clean accessibility audits, six keyboard role selections/sign-ins, desktop/mobile 200% scroll and reflow, unchanged storage, static parity, zero errors/POST.`);
} finally {
 await browser.close();
}
