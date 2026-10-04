import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('output/playwright',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000}});
const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:5173');
await page.locator('.scene-enhanced').waitFor();
assert.equal(await page.locator('.programme').count(),8);
assert.equal(await page.locator('#in-pictures').count(),0);
assert.equal(await page.locator('.chapter-stack .gallery-open').count(),10);
assert.equal(await page.locator('.sticky-scene').evaluate(e=>getComputedStyle(e).position),'sticky');
await page.screenshot({path:'output/playwright/cinematic-opening.png'});
const chapters=['mobility','livelihoods','education','civic','communities','enforcement','health','institutions'];
const matches=['mobility-2','farm','education-2','civic','abia','enforcement','health','noa'];
for(let i=0;i<chapters.length;i++) {
 await page.locator(`#${chapters[i]}`).evaluate(e=>window.scrollTo(0,e.getBoundingClientRect().top+window.scrollY-window.innerHeight*.25));
 await page.waitForFunction(id=>document.querySelector('.programme-scenes').dataset.activeChapter===id,chapters[i]);
 assert.match(await page.locator('.scene-layer.is-active img').getAttribute('src'),new RegExp(`${matches[i]}\\.webp$`));
 assert.equal(await page.locator('.chapter-index [aria-current=step]').getAttribute('href'),`#${chapters[i]}`);
 const offset=await page.locator('.scene-image').evaluate(e=>new DOMMatrix(getComputedStyle(e).transform).m42);
 assert.ok(Math.abs(offset)<=24);
 assert.equal(await page.locator('.scene-layer.is-active img').evaluate(e=>getComputedStyle(e).objectFit),'contain');
}
await page.locator('#education').evaluate(e=>window.scrollTo(0,e.getBoundingClientRect().top+window.scrollY-window.innerHeight*.25));
await page.waitForFunction(()=>document.querySelector('.programme-scenes').dataset.activeChapter==='education');
await page.waitForFunction(()=>getComputedStyle(document.querySelector('.scene-layer.is-active')).opacity==='1');
await page.screenshot({path:'output/playwright/cinematic-chapter.png'});
await page.locator('#contributions').scrollIntoViewIfNeeded();
const first=page.locator('.scene-layer.is-active .gallery-open');
await first.focus();
await page.keyboard.press('Enter');
await page.getByRole('dialog').waitFor();
assert.equal(await page.getByRole('button',{name:'Close photograph'}).evaluate(e=>e===document.activeElement),true);
await page.keyboard.press('Shift+Tab');
assert.equal(await page.getByRole('dialog').locator('a').evaluate(e=>e===document.activeElement),true);
await page.keyboard.press('Tab');
assert.equal(await page.getByRole('button',{name:'Close photograph'}).evaluate(e=>e===document.activeElement),true);
const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
await writeFile('output/playwright/gallery-accessibility.json',JSON.stringify(audit.violations,null,2));
assert.deepEqual(audit.violations.map(v=>v.id),[]);
await page.screenshot({path:'output/playwright/cinematic-dialog.png'});
await page.keyboard.press('Escape');
assert.equal(await page.getByRole('dialog').count(),0);
assert.equal(await first.evaluate(e=>e===document.activeElement),true);
await page.getByRole('button',{name:'Reduce motion',exact:true}).click();
assert.equal(await page.locator('.scene-layer').first().evaluate(e=>getComputedStyle(e).transitionDuration),'0s');
assert.equal(await page.locator('.scene-image').evaluate(e=>getComputedStyle(e).transform),'none');
await page.getByRole('button',{name:'Reduce motion',exact:true}).click();
await page.emulateMedia({reducedMotion:'reduce'});
await page.emulateMedia({reducedMotion:'no-preference'});
for (const width of [1440,1024,768,480,390]) {
 await page.setViewportSize({width,height:900});
 if(width<1024) {
  await page.waitForFunction(()=>!document.querySelector('.sticky-scene'));
    assert.equal(await page.locator('.programme-visual:visible').count(),8);
 }
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),true,`Overflow at ${width}`);
  await page.evaluate(()=>window.scrollTo(0,0));
 await page.screenshot({path:`output/playwright/story-${width}.png`,fullPage:true});
 if (width===390 || width===768) {
  await page.screenshot({path:`output/playwright/story-opening-${width}.png`});
  await page.locator('#education').scrollIntoViewIfNeeded();
  await page.screenshot({path:`output/playwright/story-chapter-${width}.png`});
  await page.locator('#contributions').scrollIntoViewIfNeeded();
  await page.screenshot({path:`output/playwright/story-gallery-${width}.png`});
 }
}
// All ten original photographs open from contribution chapters, with matched captions and sources.
const contributionPhotos=page.locator('.chapter-stack .gallery-open');
const expectedPhotos=['noa','farm','abia','leadership','education-2','civic','enforcement','health','cbm','mobility-2'];
const paths=await contributionPhotos.locator('img').evaluateAll(nodes=>nodes.map(img=>img.getAttribute('src')));
assert.deepEqual(paths.map(path=>path.split('/').pop().replace('.webp','')).sort(),expectedPhotos.sort());
for (let i=0;i<10;i++) {
 const opener=contributionPhotos.nth(i);
 const photoPath=await opener.locator('img').getAttribute('src');
 const alt=await opener.locator('img').getAttribute('alt');
 const source=await opener.locator('..').locator('figcaption a').first().getAttribute('href');
 await opener.click();
 const dialog=page.getByRole('dialog');
 await dialog.waitFor();
 assert.equal(await dialog.locator('img').getAttribute('src'),photoPath);
 assert.equal(await dialog.locator('img').getAttribute('alt'),alt);
 assert.equal(await dialog.locator('figcaption a').first().getAttribute('href'),source);
 await page.keyboard.press('Escape');
 assert.equal(await opener.evaluate(e=>e===document.activeElement),true);
}
const basic=await browser.newPage({viewport:{width:1440,height:900}});
await basic.addInitScript(()=>{delete window.IntersectionObserver;});
await basic.goto('http://127.0.0.1:5173');
assert.equal(await basic.locator('.programme-visual:visible').count(),8);
assert.equal(await basic.locator('.sticky-scene').count(),0);
const failed=await browser.newPage({viewport:{width:390,height:844}});
await failed.route('**/photos/health.webp',r=>r.abort());
await failed.goto('http://127.0.0.1:5173');
const healthButton=failed.locator('#health .gallery-open').first();
await healthButton.focus();
await failed.locator('#health').getByText('Photograph unavailable.',{exact:false}).first().waitFor();
await healthButton.focus();
await failed.keyboard.press('Enter');
await failed.getByRole('dialog').getByText('Photograph unavailable.').waitFor();
assert.match(await failed.getByRole('dialog').locator('figcaption').innerText(),/Lawrence Idemudia/);
const nojs=await browser.newPage({javaScriptEnabled:false});
await nojs.goto('http://127.0.0.1:5173');
assert.equal(await nojs.locator('.static-story article[id^=static-]').count(),8);
assert.equal(await nojs.locator('.static-gallery').count(),0);
assert.equal(await nojs.locator('.static-story article[id^=static-] figure').count(),10);
assert.match(await nojs.locator('.static-story').innerText(),/Lawrence Edelifo Idemudia/);
assert.equal(await nojs.locator('#static-home details').count(),12);
assert.equal(await nojs.locator('#static-explore details').count(),5);
assert.deepEqual(await nojs.getByRole('navigation',{name:'Main navigation'}).getByRole('link').allTextContents(),['Home','Projects & Possibilities','About']);
for (const name of ['Jerry Bannister Zachary','Strong']) {
 const profile=nojs.locator('#static-about').getByRole('region',{name,exact:true});
 assert.equal(await profile.innerText(),name+'\nPhoto space');
 assert.equal(await profile.locator('img,p').count(),0);
}

// Every dated record remains selectable, with only its source-matched photograph.
const timeline=page.locator('#milestones');
const records=[
 ['2024-08-06','Appointment announced',null],
 ['2024-09-21','Civic participation','civic'],
 ['2024-09-26','Inclusive education','education-2'],
 ['2024-10-31','CBM partnership engagement','cbm'],
 ['2025-01-19','Services closer to communities','abia'],
 ['2025-06-14','Accessibility and enforcement','enforcement'],
 ['2025-07-07','Skills and livelihoods','farm'],
 ['2025-10-11','Mobility and participation','mobility-2'],
 ['2025-11-07','Skills partnership proposed',null],
 ['2025-12-10','NOA inclusion engagement','noa'],
 ['2025-12-19','Health and community outreach','health'],
 ['2026-05-22','NDMIS workshop reported',null],
];
const strip=timeline.locator('.timeline-strip');
const event=timeline.locator('.timeline-event');
assert.equal(await strip.getByRole('button').count(),12);
assert.equal(await strip.evaluate(e=>getComputedStyle(e).overflowX),'auto');
for (let i=0;i<records.length;i++) {
 const [date,title,photo]=records[i];
 const marker=strip.getByRole('button').nth(i);
 await marker.click();
 assert.equal(await marker.getAttribute('aria-pressed'),'true');
 assert.equal(await strip.locator('[aria-pressed=true]').count(),1);
 assert.equal(await event.count(),1);
 assert.equal(await event.locator('time').getAttribute('datetime'),date);
 assert.equal(await event.getByRole('heading',{name:title,exact:true}).count(),1);
 assert.equal(await timeline.getByRole('button',{name:'Previous event',exact:true}).isDisabled(),i===0);
 assert.equal(await timeline.getByRole('button',{name:'Next event',exact:true}).isDisabled(),i===records.length-1);
 assert.equal(await event.locator('figure').count(),photo?1:0);
 if (photo) {
  assert.match(await event.locator('img').getAttribute('src'),new RegExp(`${photo}\\.webp$`));
  assert.equal(await event.locator('figure a').first().getAttribute('href'),await event.getByRole('link',{name:/^Source/ }).first().getAttribute('href'));
 }
}
await timeline.getByRole('button',{name:'Previous event',exact:true}).click();
assert.equal(await event.locator('time').getAttribute('datetime'),'2025-12-19');
await timeline.getByRole('button',{name:'Next event',exact:true}).click();
assert.equal(await event.locator('time').getAttribute('datetime'),'2026-05-22');
for (const [year,count] of [['2024',4],['2025',7],['2026',1]]) {
 const filter=timeline.getByRole('button',{name:year,exact:true});
 await filter.click();
 assert.equal(await filter.getAttribute('aria-pressed'),'true');
 assert.equal(await strip.getByRole('button').count(),count);
 assert.equal(await timeline.getByRole('button',{name:'Previous event',exact:true}).isDisabled(),true);
 assert.equal(await timeline.getByRole('button',{name:'Next event',exact:true}).isDisabled(),count===1);
 for (const date of await strip.locator('time').evaluateAll(nodes=>nodes.map(e=>e.dateTime))) assert.ok(date.startsWith(year));
}
await timeline.getByRole('button',{name:'All years',exact:true}).click();
assert.equal(await strip.getByRole('button').count(),12);
assert.equal(await event.locator('time').getAttribute('datetime'),'2024-08-06');
await strip.getByRole('button').nth(2).focus();
await page.keyboard.press('Enter');
assert.equal(await event.locator('time').getAttribute('datetime'),'2024-09-26');
assert.equal(await page.locator('.opportunity').count(),0);
assert.deepEqual(await page.getByRole('navigation',{name:'Main navigation'}).getByRole('button').allTextContents(),['Home','Projects & Possibilities','About']);
const timelineFailure=await browser.newPage();
await timelineFailure.route('**/photos/civic.webp',route=>route.abort());
await timelineFailure.goto('http://127.0.0.1:5173');
await timelineFailure.locator('.timeline-strip button').nth(1).click();
await timelineFailure.locator('.timeline-event').getByText('Photograph unavailable.',{exact:false}).waitFor();
assert.match(await timelineFailure.locator('.timeline-event figcaption').innerText(),/Gufwan/);
assert.equal(await timelineFailure.locator('.timeline-event').getByRole('link',{name:/^Source/ }).count(),1);
await timelineFailure.close();
// Main navigation, blank role spaces and named About profiles.
await page.getByRole('button',{name:'Projects & Possibilities',exact:true}).click();
assert.equal(await page.locator('.opportunity').count(),5);
assert.equal(await page.getByRole('tab').count(),0);
await page.getByRole('button',{name:'Open the app demo',exact:false}).click();
for (const name of ['User','Administration','Facilitator']) {
 const tab=page.getByRole('tab',{name,exact:true});
 await tab.click();
 assert.equal(await tab.getAttribute('aria-selected'),'true');
 const panel=page.getByRole('tabpanel',{name,exact:true});
 assert.equal(await panel.count(),1);
 assert.equal(await panel.innerText(),'');
 assert.equal(await panel.locator('*').count(),0);
}
await page.getByRole('tab',{name:'User',exact:true}).focus();
await page.keyboard.press('ArrowRight');
assert.equal(await page.getByRole('tab',{name:'Administration',exact:true}).getAttribute('aria-selected'),'true');
await page.keyboard.press('End');
assert.equal(await page.getByRole('tab',{name:'Facilitator',exact:true}).getAttribute('aria-selected'),'true');
await page.keyboard.press('Home');
assert.equal(await page.getByRole('tab',{name:'User',exact:true}).getAttribute('aria-selected'),'true');
await page.getByRole('button',{name:'About',exact:true}).click();
for (const name of ['Jerry Bannister Zachary','Strong']) {
 const profile=page.getByRole('region',{name,exact:true});
 assert.equal(await profile.getByRole('heading',{name,exact:true}).count(),1);
 assert.equal(await profile.evaluate(el=>el.querySelector('.empty-portrait').compareDocumentPosition(el.querySelector('.empty-biography'))&Node.DOCUMENT_POSITION_FOLLOWING),4);
 for (const part of ['portrait','biography']) {
  const blank=profile.getByLabel(`${name} ${part} space`,{exact:true});
  assert.equal(await blank.innerText(),part==='portrait'?'Photo space':'');
  assert.equal(await blank.locator('img').count(),0);
  if(part==='biography') assert.equal(await blank.locator('*').count(),0);
 }
}
await page.getByRole('button',{name:'A+ Text',exact:true}).click();
for (const width of [390,768,1440]) {
 await page.setViewportSize({width,height:900});
 for (const section of ['Projects & Possibilities','About']) {
  await page.getByRole('button',{name:section,exact:true}).click();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),true,`${section} enlarged-text overflow at ${width}`);
 }
}
await page.getByRole('button',{name:'A+ Text',exact:true}).click();
await page.getByRole('button',{name:'Home',exact:true}).click();
await page.locator('.photo-carousel').waitFor();
assert.deepEqual(errors,[]);
await browser.close();
console.log('Story checks passed: eight chapter/photo matches, sticky scene, bounded parallax, full frames, gallery keyboard/focus/Escape, dialog axe, reduced motion, five viewport widths, observer fallback, image failure captions, 12-record timeline/filter/boundaries/source photos, role tabs and blank About profiles.');
