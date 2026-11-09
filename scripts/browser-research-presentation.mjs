import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('output/playwright',{recursive:true});
const origin=process.env.STORY_URL || 'http://127.0.0.1:4175/';
const browser=await chromium.launch({channel:'chrome',headless:true});
const evidence={audits:[],errors:[],csp:[],failed:[],checks:[]};
try {
 const context=await browser.newContext({viewport:{width:1440,height:900}});
 await context.addInitScript(()=>{
  window.__spoken=[];window.__fullscreenRequests=0;
  window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};
  Object.defineProperty(window.speechSynthesis,'speak',{value:u=>window.__spoken.push(u.text)});
  Object.defineProperty(window.speechSynthesis,'cancel',{value:()=>{}});
  const original=Element.prototype.requestFullscreen;
  Element.prototype.requestFullscreen=function(...args){window.__fullscreenRequests++; if(window.__refuseFullscreen)return Promise.reject(Error('Simulated refusal')); return original.apply(this,args);};
  document.addEventListener('securitypolicyviolation',e=>{ if(!window.top.__auditInProgress)console.error('CSP',e.violatedDirective,e.blockedURI); });
 });
 const page=await context.newPage(); page.setDefaultTimeout(10000);
 page.on('pageerror',e=>evidence.errors.push(e.message));
 page.on('console',m=>{if(m.text().startsWith('CSP '))evidence.csp.push(m.text());});
 page.on('response',r=>{if(r.status()>=400)evidence.failed.push(`${r.status()} ${r.url()}`);});
 await page.goto(origin);
 await page.getByRole('button',{name:'Research',exact:true}).waitFor();
 const stored=await page.evaluate(()=>({local:{...localStorage},session:{...sessionStorage}}));
 await page.getByRole('button',{name:'Research',exact:true}).click();
 const f=page.frameLocator('#research-deck');
 await f.locator('#slide-count').filter({hasText:'1 / 5'}).waitFor();
 assert.equal(await page.locator('header,footer,.accessbar,.research-page').count(),0);
 assert.equal(await page.evaluate(()=>window.__fullscreenRequests),1);
 assert.equal(await page.evaluate(()=>!!document.fullscreenElement),true);
 await page.keyboard.press('Escape');
 // Escape leaves presentation in place. Headless OS handling varies; explicitly exit if needed.
 await page.evaluate(()=>document.fullscreenElement ? document.exitFullscreen():undefined);
 assert.equal(await page.locator('#research-deck').count(),1);
 const audit=async name=>{
  await page.evaluate(()=>window.__auditInProgress=true);
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  await page.evaluate(()=>window.__auditInProgress=false);
  await writeFile(`output/playwright/research-axe-${name}.json`,JSON.stringify(result.violations,null,2));
  assert.deepEqual(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],name);evidence.audits.push(name);
 };
 const select=async i=>{await f.locator('#menu-trigger').focus();await f.locator('#menu-trigger').click();await f.locator('#slide-selector').selectOption(String(i));await f.locator('#slide-count').filter({hasText:`${i+1} / 5`}).waitFor();};
 assert.equal(await f.locator('#back').isDisabled(),true);
 const expected=['IMPACT MOSAIC','Our roadmap','Talent is everywhere. Access to learning should be too.','Gufwan’s story connects mobility with opportunity.','Reaching the classroom is only the beginning.'];
 for(let i=0;i<5;i++){
  if(i)await f.locator('#next').click();
  if(i===2){await f.locator('#back').click();assert.equal(await f.locator('#slide-count').innerText(),'2 / 5');await f.locator('#next').click();}
  assert.equal((await f.locator('.present .slide-copy h2').innerText()).replace(/\s+/g,' '),expected[i]);
  assert.equal(await f.locator('.slides>section:not([inert])').count(),1);
  for(const img of await f.locator('.present img').all())assert.equal(await img.evaluate(e=>e.complete&&e.naturalWidth>0),true);
  await page.waitForTimeout(230);
  assert.equal(await f.locator('.slides > section.present').evaluate(e=>e.scrollHeight<=e.clientHeight+2),true,`desktop fits ${i+1}`);
  await audit(`mosaic-desktop-${i+1}`);
  await page.locator('#research-deck').screenshot({path:`output/playwright/research-slide-${i+1}.png`});
 }
 assert.equal(await f.locator('#next').innerText(),'Finish');
 await f.locator('#menu-trigger').focus();await f.locator('#menu-trigger').click();await f.locator('#sources').click();
 await f.locator('#sources-dialog[open] img').waitFor();
 assert.match(await f.locator('#source-content').innerText(),/2024-09-26/);
 await audit('mosaic-sources');
 await page.keyboard.press('Escape');assert.equal(await f.locator('#sources-dialog').isVisible(),false);
 assert.equal(await f.locator('#menu-trigger').evaluate(e=>e===document.activeElement),true);
 await f.locator('#next').focus();
 for(const [key,count] of [['Home','1 / 5'],['PageDown','2 / 5'],['ArrowRight','3 / 5'],['PageUp','2 / 5'],['ArrowLeft','1 / 5'],['End','5 / 5']]){await page.keyboard.press(key);assert.equal(await f.locator('#slide-count').innerText(),count);}
 await select(3);
 await f.locator('#menu-trigger').click();await f.getByText('Accessibility options',{exact:true}).click();await f.locator('#deck-read').click();
 assert.match(await f.locator('body').evaluate(()=>window.__spoken.at(-1)),/Gufwan’s story connects/);
 await f.locator('#deck-motion').click();await f.locator('[data-close]').first().click();
 await select(4);assert.equal(await f.locator('.present .composition').evaluate(e=>getComputedStyle(e).animationName),'none');
 await f.locator('#menu-trigger').click();await f.locator('#deck-motion').click();await f.locator('[data-close]').first().click();
 await page.emulateMedia({reducedMotion:'reduce'});await select(2);assert.equal(await f.locator('.present .composition').evaluate(e=>getComputedStyle(e).animationName),'none');
 for(const [width,size,name] of [[390,'','phone'],[390,'200%','phone-200'],[1440,'200%','desktop-200']]){
  await page.setViewportSize({width,height:900});
  await f.locator('html').evaluate((e,size)=>e.style.fontSize=size,size);
  for(let i=0;i<5;i++){
   await select(i);
   assert.equal(await f.locator('.slides > section.present').evaluate(e=>e.scrollWidth<=e.clientWidth+2),true,`${name}-${i+1} no horizontal overflow`);
   assert.equal(await f.locator('.present .slide-copy').evaluate(e=>{const r=e.getBoundingClientRect();return r.height>=e.scrollHeight-2;}),true,`${name}-${i+1} copy not clipped`);
   if(width===390&&i>=2)assert.equal(await f.locator('.present .slide-visual').evaluate(e=>e.getBoundingClientRect().top<e.parentElement.querySelector('.slide-copy').getBoundingClientRect().top),true);
  }
  const controls=await f.locator('#back').evaluate(e=>{const back=e.getBoundingClientRect(),next=document.querySelector('#next').getBoundingClientRect();return back.right<=next.left;});assert.equal(controls,true,`${name} controls do not overlap`);
  await audit(`mosaic-${name}`);await page.screenshot({path:`output/playwright/research-${name}.png`});
 }
 await f.locator('html').evaluate(e=>e.style.fontSize='');await page.setViewportSize({width:1440,height:900});
 await select(0);await f.locator('#menu-trigger').click();await f.locator('#previous:disabled').waitFor();await f.locator('[data-close]').first().click();
 // Horizontal swipes advance; vertical gestures keep the current slide.
 await f.locator('body').dispatchEvent('touchstart',{touches:[{identifier:0,clientX:300,clientY:300}]});await f.locator('body').dispatchEvent('touchend',{changedTouches:[{identifier:0,clientX:100,clientY:310}]});assert.equal(await f.locator('#slide-count').innerText(),'2 / 5');
 await f.locator('body').dispatchEvent('touchstart',{touches:[{identifier:0,clientX:300,clientY:300}]});await f.locator('body').dispatchEvent('touchend',{changedTouches:[{identifier:0,clientX:290,clientY:100}]});assert.equal(await f.locator('#slide-count').innerText(),'2 / 5');
 await select(4);await f.locator('#next').click();await page.getByRole('button',{name:'Research',exact:true}).waitFor();
 assert.deepEqual(await page.evaluate(()=>({local:{...localStorage},session:{...sessionStorage}})),stored,'stored demo bytes unchanged');
 await page.evaluate(()=>window.__refuseFullscreen=true);await page.getByRole('button',{name:'Research',exact:true}).click();await f.locator('.slides > section.present').waitFor();assert.equal(await page.evaluate(()=>!!document.fullscreenElement),false);
 await page.goto(new URL('?page=research',origin).href);await f.locator('#slide-count').filter({hasText:'1 / 5'}).waitFor();assert.equal(await page.locator('header,footer').count(),0);
 assert.equal(await page.evaluate(()=>window.__fullscreenRequests),0);
 await f.locator('#menu-trigger').focus();await f.locator('#menu-trigger').click();await f.getByRole('link',{name:'Detailed Research proposal',exact:true}).click();await page.locator('.research-page').waitFor();
 await page.getByRole('link',{name:'Return to the presentation',exact:true}).click();await f.locator('.slides > section.present').waitFor();
 await page.goto(new URL('research/reading.html',origin).href);assert.equal(await page.locator('article').count(),5);assert.equal(await page.locator('figure').count(),4);await audit('mosaic-reading');
 await page.pdf({path:'output/playwright/research-reading.pdf',format:'A4',printBackground:true});
 await page.goto(new URL('research/index.html',origin).href);await page.locator('#slide-count').filter({hasText:'1 / 5'}).waitFor();await page.emulateMedia({media:'print'});
 for(const slide of await page.locator('.slides>section').all())assert.equal(await slide.isVisible(),true);
 await page.pdf({path:'output/playwright/research-slides.pdf',format:'A4',landscape:true,printBackground:true});
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:900}}),np=await nojs.newPage();await np.goto(origin);
 assert.equal(await np.locator('#static-research iframe').count(),0);assert.equal(await np.locator('#static-research .research-linear[open] article').count(),5);
 await np.goto(new URL('research/index.html',origin).href);await np.getByRole('link',{name:'Read all five slides without JavaScript'}).click();assert.equal(await np.locator('article').count(),5);assert.equal(await np.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 await nojs.close();
 evidence.checks=['fullscreen entry/refusal/direct links','five exact headlines and loaded uncropped images','Next/Finish/menu/keyboard/swipe/exit','sources/dialog focus/read aloud','OS and manual reduced motion','desktop/phone/200% text','reading/detailed proposal/no-JS/print','stored demo bytes preserved'];
 assert.deepEqual(evidence.errors,[]);assert.deepEqual(evidence.csp,[]);assert.deepEqual(evidence.failed,[]);
 await writeFile('output/playwright/research-verification.json',JSON.stringify(evidence,null,2));console.log('Research presentation checks passed:',evidence);
}finally{await browser.close();}
