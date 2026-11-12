import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

// Isolated browser contexts: this audit never reads or replaces an owner's saved demo.
const target = process.env.MOBILE_URL || 'http://127.0.0.1:4175/';
const viewFilter = process.env.MOBILE_VIEWS ? new RegExp(process.env.MOBILE_VIEWS) : null;
const output = process.env.MOBILE_OUTPUT || 'output/playwright/mobile-pages';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [], errors = [], posts = [];
const sizes = [
  { name: '320', width: 320, height: 740 },
  { name: '390', width: 390, height: 844 },
  { name: '430', width: 430, height: 932 },
  { name: 'landscape', width: 844, height: 390 },
  { name: '200-text', width: 390, height: 844, enlarged: true },
];
async function check(page, name) {
  if (viewFilter && !viewFilter.test(name)) return;
  for (const size of sizes) {
    await page.setViewportSize({ width: size.width, height: size.height });
    // Increase every computed text size, including px-based public styles.
    await page.evaluate(enlarged => {
      for (const el of document.querySelectorAll('[data-mobile-original-style]')) {
        const original = el.getAttribute('data-mobile-original-style');
        if (original) el.setAttribute('style', original); else el.removeAttribute('style');
        el.removeAttribute('data-mobile-original-style');
      }
      if (enlarged) {
        const elements = [...document.querySelectorAll('body, body *')].map(el => [el, parseFloat(getComputedStyle(el).fontSize)]);
        for (const [el, fontSize] of elements) {
          el.setAttribute('data-mobile-original-style', el.getAttribute('style') || '');
          el.style.fontSize = `${fontSize * 2}px`;
        }
      }
    }, Boolean(size.enlarged));
    await page.evaluate(() => document.fonts.ready);
    const layout = await page.evaluate(() => ({
      width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
      outside: [...document.querySelectorAll('body *')].filter(el => {
        const r = el.getBoundingClientRect(), s = getComputedStyle(el);
        return r.width && s.position !== 'absolute' && s.position !== 'fixed' && (r.right > innerWidth + 1 || r.left < -1) && !el.closest('.sampling-table-scroll');
      }).filter(el => !el.closest('.timeline-strip')).slice(0, 12).map(el => ({ tag: el.tagName, class: el.className, text: el.textContent.slice(0, 90) })),
    }));
    const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    const violations = audit.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) }));
    await page.screenshot({ path: `${output}/${name}-${size.name}.png`, fullPage: true });
    results.push({ name, size: size.name, layout, violations });
    await writeFile(`${output}/results.json`, JSON.stringify({ results, errors, posts }, null, 2));
    console.log(name, size.name, layout.scrollWidth > layout.width ? `OVERFLOW ${layout.scrollWidth}` : 'fits', violations.map(v => v.id).join(','));
  }
  await page.evaluate(() => { for (const el of document.querySelectorAll('[data-mobile-original-style]')) { const s = el.getAttribute('data-mobile-original-style'); if (s) el.setAttribute('style', s); else el.removeAttribute('style'); el.removeAttribute('data-mobile-original-style'); } });
  // Keyboard entry and a visible focus indicator are required on each current view.
  await page.keyboard.press('Tab');
  const focused = await page.evaluate(() => { const el = document.activeElement, s = getComputedStyle(el); return { tag: el.tagName, outline: s.outlineStyle, width: s.outlineWidth }; });
  assert.notEqual(focused.tag, 'BODY', `${name}: keyboard reaches a control`);
  assert.notEqual(focused.outline, 'none', `${name}: focus is visible`);
}
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  // Keep concurrent Vite edits from resetting a role halfway through its audit.
  await page.routeWebSocket('**', socket => socket.close());
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (request.method() === 'POST') posts.push(request.url()); });
  for (const [name, path] of [['home', '/'], ['about', '/?page=about'], ['research-reading', '/?page=research-reading'], ['brief', '/downloads/pilot-discussion-brief.html']]) {
    await page.goto(new URL(path, target).href);
    await page.locator('h1').first().waitFor();
    await check(page, name);
  }
  await page.goto(target);
  const button = name => page.getByRole('button', { name, exact: true });
  await button('Learning Sandbox').click();
  await check(page, 'sandbox-entry');
  for (const [role, username, code, tabs] of [
    ['Learner', 'ada', 'DEMO-ADA', ['My learning', 'Messages']],
    ['Facilitator', 'amaka', 'DEMO-AMAKA', ['Learners', 'Messages']],
    ['Administration', 'admin', 'DEMO-ADMIN', ['Learners', 'Reports']],
  ]) {
    await button(`Use ${role} interface`).click();
    await check(page, `${username}-signin`);
    await page.getByLabel('Username', { exact: true }).fill(username);
    await page.getByLabel('Demo access code', { exact: true }).fill(code);
    await button('Sign in').click();
    await button('Sign out').waitFor();
    await check(page, `${username}-overview`);
    for (const tab of tabs) {
      await page.getByRole('navigation', { name: 'Connected workspace', exact: true }).getByRole('button', { name: tab, exact: tab !== 'Messages' }).click();
      await check(page, `${username}-${tab.toLowerCase().replaceAll(' ', '-')}`);
    }
    await button('Sign out').click();
  }
} finally {
  await writeFile(`${output}/results.json`, JSON.stringify({ results, errors, posts }, null, 2));
  await browser.close();
}
assert.deepEqual(errors, []);
assert.deepEqual(posts, []);
assert.deepEqual(results.filter(r => r.layout.scrollWidth > r.layout.width + 1 || r.violations.length), [], 'All pages fit and have clean axe checks');
console.log(`Passed ${results.length} mobile page checks; keyboard focus, no script errors or POST requests.`);
