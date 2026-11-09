import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

await mkdir('output/playwright', { recursive: true });
const target = process.env.STORY_URL || 'http://127.0.0.1:5173/';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const audits = [], errors = [], posts = [];
try {
 const context = await browser.newContext();
 const page = await context.newPage();
 page.on('pageerror', e => errors.push(e.message));
 page.on('request', r => { if (r.method() === 'POST') posts.push(r.url()); });
 await page.goto(target);
 assert.equal(await page.locator('.documentary-hero + .pilot-proposal').count(), 1);
 const objective = await page.locator('.pilot-proposal .lead').innerText();
 const briefPath = await page.locator('.pilot-proposal').getByRole('link', { name: /Discussion Brief/ }).getAttribute('href');
 await page.locator('.pilot-proposal').getByRole('link', { name: /research plan/ }).click();
 await page.getByRole('heading', { name: 'Research & Data Collection.', exact: true }).waitFor();
 assert.ok((await page.locator('.research-page').innerText()).includes(objective));
 assert.equal(await page.locator('.sampling-outline[open]').count(), 1);
 assert.equal(await page.locator('.sampling-methods').first().locator('tbody tr').count(), 8);
 assert.equal(await page.getByRole('region', { name: 'Proposed pilot measurements' }).locator('tbody tr').count(), 6);
 for (const [width, textSize, mode] of [[1440, '', 'desktop'], [390, '', 'phone'], [390, '200%', 'phone-200']]) {
  await page.setViewportSize({ width, height: 900 });
  await page.evaluate(size => document.documentElement.style.fontSize = size, textSize);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, mode);
  for (const name of ['Sampling methods and pilot time frames', 'Proposed pilot measurements']) {
   const region = page.getByRole('region', { name });
   if (width === 390) {
    await region.focus();
    await page.keyboard.press('ArrowRight');
    await page.waitForFunction(label => [...document.querySelectorAll('[role=region]')].find(e => e.getAttribute('aria-label') === label).scrollLeft > 0, name);
   }
  }
  const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  assert.deepEqual(audit.violations, [], mode);
  audits.push(`research-${mode}`);
  await page.screenshot({ path: `output/playwright/pilot-${mode}.png`, fullPage: true });
 }
 await page.getByRole('button', { name: 'Reduce motion', exact: true }).click();
 assert.equal(await page.locator('.sampling-mini-group').first().evaluate(e => getComputedStyle(e).animationName), 'none');
 await page.goto(new URL(briefPath, target).href);
 await page.getByRole('heading', { name: 'Plateau Pilot Discussion Brief', exact: true }).waitFor();
 assert.ok((await page.locator('main').innerText()).includes(objective));
 for (const width of [1440, 390]) {
  await page.setViewportSize({ width, height: 900 });
  await page.evaluate(size => document.documentElement.style.fontSize = size, width === 390 ? '200%' : '');
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  assert.deepEqual(audit.violations, []);
  audits.push(`brief-${width}`);
 }
 await page.evaluate(() => document.documentElement.style.fontSize = '');
 await page.emulateMedia({ media: 'print' });
 assert.equal(await page.locator('header .proposal-links').isVisible(), false);
 await page.pdf({ path: 'output/playwright/plateau-pilot-discussion-brief.pdf', preferCSSPageSize: true, printBackground: true });
 await page.screenshot({ path: 'output/playwright/pilot-brief-print.png', fullPage: true });
 const nojsContext = await browser.newContext({ javaScriptEnabled: false });
 const nojs = await nojsContext.newPage();
 await nojs.goto(target);
 await nojs.locator('#static-home .pilot-proposal').getByRole('link', { name: /research plan/ }).click();
 assert.equal(new URL(nojs.url()).hash, '#static-research');
 assert.equal(await nojs.locator('#static-research .sampling-methods').count(), 1);
 await nojs.setViewportSize({ width: 390, height: 900 });
 await nojs.evaluate(() => document.documentElement.style.fontSize = '200%');
 assert.equal(await nojs.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
 await nojs.locator('#static-research').getByRole('link', { name: /Discussion Brief/ }).click();
 await nojs.getByRole('heading', { name: 'Plateau Pilot Discussion Brief' }).waitFor();
 assert.equal(await nojs.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
 await nojs.getByRole('link', { name: /learning sandbox/ }).click();
 assert.equal(new URL(nojs.url()).hash, '#static-explore');
 assert.equal(await nojs.locator('#static-explore').isVisible(), true);
 await nojsContext.close();
 await page.emulateMedia({ media: 'screen' });
 await page.goto(target);
 await page.locator('.pilot-proposal').getByRole('link', { name: /learning sandbox/ }).click();
 await page.getByRole('heading', { name: 'Learning Sandbox.', exact: true }).waitFor();
 assert.deepEqual(errors, []);
 assert.deepEqual(posts, []);
 await writeFile('output/playwright/pilot-results.json', JSON.stringify({ audits, errors, posts, noJavaScriptLinks: true, printPDF: true }, null, 2));
 console.log('Pilot passed: shared proposal, live/static links, five clean axe audits, phone/200% reflow, two keyboard-scrollable tables, reduced motion, printable PDF, zero errors/POST.');
} finally { await browser.close(); }
