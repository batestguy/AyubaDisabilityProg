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
 const records=await (await page.request.get(new URL('research/slides.json',origin).href)).json();
 const pathway=records.find(record=>record.pathway)?.pathway;
 assert.ok(pathway,'shared pathway content exists');
 const databaseSlide=records.find(record=>record.layout==='database');
 const database=databaseSlide?.database;
 assert.ok(database,'shared participant database content exists');
 assert.equal(records[5],databaseSlide,'database occupies slide six');
 assert.equal(databaseSlide.title,'A participant database that guides learning and support');
 assert.equal(database.quote,'In the long term, we plan to build a comprehensive, disaggregated database of PWDs in Nigeria.');
 assert.equal(database.attribution,'Ayuba Gufwan');
 assert.equal(database.interviewDate,'15 November 2025');
 assert.equal(database.interviewSource,'https://www.thecable.ng/interview-why-we-proposed-allocating-10-of-government-interventions-to-pwds-by-ayuba-gufwan/');
 assert.equal(databaseSlide.images[0].path,'/photos/leadership.webp');
 assert.match(databaseSlide.images[0].source,/fmino\.gov\.ng/);
 assert.equal(database.records.length,4);assert.equal(database.outcomes.length,4);
 const databaseText=[database.subtitle,database.quote,database.attribution,database.interviewDate,database.intro,...database.inlets.flatMap(inlet=>[inlet.title,inlet.detail]),...database.records,...database.outcomes,database.status];
 const assertDatabaseCopy=async(locator,name)=>{
  const text=await locator.textContent();
  for(const item of databaseText)assert.ok(text.includes(item),`${name} includes shared database content: ${item}`);
  assert.equal(await locator.locator(`a[href="${database.interviewSource}"]`).count()>=1,true,`${name} retains interview source link`);
 };
 const assertDatabaseFlow=async name=>{
  const section=f.locator('.slides > section.present');
  await assertDatabaseCopy(section,name);
  assert.equal(await section.locator('[data-database-flow]').count(),1,`${name} database process group`);
  assert.equal(await section.locator('svg.database-shell').count(),1,`${name} native database cylinder`);
  assert.equal(await section.locator('.database-vessel li').count(),4,`${name} four record types`);
  assert.equal(await section.locator('.database-outcomes li').count(),4,`${name} four decision outcomes`);
  assert.equal(await section.locator('.database-inlet').count(),2,`${name} distinct learner and facilitator routes`);
  for(const inlet of database.inlets){assert.ok((await section.locator('.database-inlets').innerText()).includes(inlet.title));assert.ok((await section.locator('.database-inlets').innerText()).includes(inlet.detail));}
  assert.ok(database.records.includes('Facilitator skills & availability'));
  assert.ok(database.outcomes.includes('Plan support together'));
  assert.ok(!database.outcomes.includes('Agree support'));
  assert.equal(await section.locator('[data-database-flow] svg [marker-end]').count(),5,`${name} one incoming and four outgoing SVG arrows`);
  assert.equal(await section.locator('blockquote.database-quote p').innerText(),database.quote);
  assert.equal(await section.locator('.database-interview-link').getAttribute('href'),database.interviewSource);
  assert.equal(await section.locator('.database-portrait img').count(),1);
  assert.match(await section.locator('.database-status').innerText(),/proposed.*Nigeria/i);
  assert.doesNotMatch(await section.innerText(),/\b\d+(?:\.\d+)?\s*%|\b\d+\s+(?:participants|records collected|people reached)\b/i,`${name} no invented participant results`);
 };
 const recruitmentSlide=records.find(record=>record.layout==='recruitment');
 const recruitment=recruitmentSlide?.recruitment;
 assert.ok(recruitment,'shared recruitment content exists');
 assert.equal(records.length,8,'working deck has eight slides');
 assert.doesNotMatch(JSON.stringify(records),/Plateau/i,'deck is framed for Nigeria, not Plateau');
 const closingSlide=records[7];const closing=closingSlide.closing;
 assert.equal(closingSlide.layout,'closing','thank-you slide closes the deck');
 assert.equal(closingSlide.images[0].path,'/photos/gufwan-cfr-dedication-2025.jpg');
 assert.match(closingSlide.images[0].caption,/Not an endorsement/i);
 const closingText=[closing.headline,closing.message,...closing.together,closing.brand,closing.tagline];
 assert.equal(records[4],recruitmentSlide,'recruitment occupies slide five');
 assert.match(recruitmentSlide.title,/Adaptive snowball recruitment/i);
 assert.equal(recruitment.rounds.length,3,'three recruitment rounds');
 for(const [index,pattern] of [/trusted contacts/i,/invite/i,/missing/i].entries())assert.match(recruitment.rounds[index].title,pattern,`recruitment round ${index+1}`);
 assert.match(recruitment.answer,/who our networks reach/i);
 assert.match(recruitment.limit,/few connections/i);
 const cycleSlide=records.find(record=>record.layout==='cycle');
 const cycle=cycleSlide?.cycle;
 assert.ok(cycle,'shared cycle-completion content exists');
 assert.equal(records[6],cycleSlide,'cycle completion occupies slide seven');
 assert.equal(cycle.stages.length,5,'five cycle stages');
 assert.deepEqual(cycle.restart.inputs,['Progress evidence','Participant and facilitator feedback']);
 assert.match(cycle.status,/No results yet/);
 const cycleText=[cycle.subtitle,...cycle.stages.flatMap(stage=>[stage.title,stage.need]),cycle.hub.title,cycle.hub.detail,cycle.restart.title,...cycle.restart.inputs,cycle.restart.result,cycle.statement,cycle.status];
 const flat=text=>text.replace(/\s+/g,' ');
 const assertCycle=async name=>{
  const section=f.locator('.slides > section.present');
  const text=flat(await section.innerText());
  for(const item of cycleText)assert.ok(text.includes(item),`${name} cycle shows: ${item}`);
  const stages=section.locator('[data-cycle-complete] ol.cycle7-stages > li');
  assert.equal(await stages.count(),5,`${name} five stages`);
  for(let i=0;i<5;i++)assert.ok(flat(await stages.nth(i).innerText()).includes(cycle.stages[i].title),`${name} ordered stage ${i+1}`);
  assert.match(await section.locator('[data-cycle-complete]').getAttribute('aria-label'),/restart arrow leads from stage 5 back to stage 1/i,`${name} ring text alternative`);
  assert.doesNotMatch(text,/\b\d+(?:\.\d+)?\s*%|\b\d+\s+(?:participants|learners|people|records)\b/i,`${name} no invented outcomes`);
  const ringMode=await stages.first().evaluate(e=>getComputedStyle(e).position==='absolute');
  if(ringMode){
   assert.equal(await section.locator('.cycle7-restart-arc').isVisible(),true,`${name} restart arc visible`);
   assert.equal(await section.locator('.cycle7-arrow:visible').count(),5,`${name} four stage arrows and one restart arrow`);
   const boxes=await section.locator('.cycle7-stages > li, .cycle7-hub').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return{l:r.left,t:r.top,r:r.right,b:r.bottom};}));
   for(let a=0;a<boxes.length;a++)for(let b=a+1;b<boxes.length;b++){const A=boxes[a],B=boxes[b];assert.ok(A.r<=B.l+1||B.r<=A.l+1||A.b<=B.t+1||B.b<=A.t+1,`${name} ring boxes ${a} and ${b} do not overlap`);}
  }
 };
 assert.equal(recruitmentSlide.images[0].path,'/photos/mobility-foundation-original.jpg');
 const bayesian={id:'bayesian',...recruitment.explanation};
 assert.ok(recruitmentSlide.points.some(point=>point.includes(bayesian.text)),'reading and speech source includes full Bayesian explanation');
 const explanations=[...pathway.steps.map((step,i)=>({id:`step-${i}`,title:step.title,text:step.explanation})),{id:'database',title:pathway.database.title,text:pathway.database.explanation}];
 assert.equal(explanations.length,6);
 for(const item of explanations)assert.ok(typeof item.text==='string'&&item.text.trim().length>0,`${item.id} has a shared explanation`);
 assert.equal(new Set(explanations.map(item=>item.text)).size,6,'six distinct explanations');
 const explanationDialog=f.locator('#explanation-dialog');
 const assertPanelFits=async name=>{
  assert.equal(await explanationDialog.evaluate(e=>{const r=e.getBoundingClientRect();return r.left>=-1&&r.top>=-1&&r.right<=innerWidth+1&&r.bottom<=innerHeight+1&&e.querySelector('.thought-content').scrollWidth<=e.querySelector('.thought-content').clientWidth+2;}),true,`${name} explanation fits viewport`);
  assert.equal(await explanationDialog.evaluate(e=>{const candidates=[e,...e.querySelectorAll('*')];const scroll=candidates.filter(n=>n.scrollHeight>n.clientHeight+2&&['auto','scroll'].includes(getComputedStyle(n).overflowY));return scroll.every(n=>{n.scrollTop=n.scrollHeight;const moved=n.scrollTop>0;n.scrollTop=0;return moved;});}),true,`${name} overflow can scroll`);
  await explanationDialog.locator('[data-close]').scrollIntoViewIfNeeded();
  assert.equal(await explanationDialog.locator('[data-close]').evaluate(e=>{const r=e.getBoundingClientRect();return r.top>=-1&&r.bottom<=innerHeight+1;}),true,`${name} Close reachable`);
 };
 const assertExplanationsIn=async (locator,name)=>{
  const text=await locator.textContent();
  for(const item of [...explanations,bayesian])assert.ok(text.includes(item.text),`${name} includes exact ${item.id} explanation`);
  assert.ok(text.includes(bayesian.symbols),`${name} includes symbol definitions`);
  assert.ok(text.includes(bayesian.status),`${name} includes proposed-model status`);
  for(const item of [...recruitment.distinction,...recruitment.gaps])assert.ok(text.includes(item),`${name} retains supporting recruitment detail`);
 };
 const assertRecruitmentFlow=async name=>{
  const loop=f.locator('.present [data-recruitment-loop]');
  const rounds=loop.locator('ol.recruitment-rounds > li');
  assert.equal(await rounds.count(),3,`${name} three recruitment rounds`);
  assert.equal(await loop.locator('svg.recruitment-round-art[role="img"]').count(),3,`${name} three labelled dot drawings`);
  assert.match(await loop.getAttribute('aria-label'),/three rounds/i,`${name} drawing group text alternative`);
  assert.ok((await loop.locator('.recruitment-next').innerText()).includes(recruitment.nextRound),`${name} next-round return`);
  assert.equal(await loop.locator('.recruitment-legend li').count(),3,`${name} dot key`);
  const bounds=await rounds.evaluateAll(nodes=>nodes.map(e=>{const r=e.getBoundingClientRect();return{left:r.left,right:r.right,top:r.top,bottom:r.bottom};}));
  const columns=await loop.locator('ol.recruitment-rounds').evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length);
  for(let i=0;i<3;i++){
   const text=flat(await rounds.nth(i).innerText());
   assert.ok(text.includes(recruitment.rounds[i].title)&&text.toLowerCase().includes(recruitment.rounds[i].label.toLowerCase()),`${name} ordered shared round ${i+1}`);
   assert.ok((await rounds.nth(i).locator('svg').getAttribute('aria-label')).includes(recruitment.rounds[i].detail),`${name} round ${i+1} drawing described`);
   if(i&&columns===3){assert.ok(Math.abs(bounds[i].top-bounds[0].top)<=2,`${name} rounds share a row`);assert.ok(bounds[i].left>=bounds[i-1].right-1,`${name} rounds flow left to right`);}
   if(i&&columns===1)assert.ok(bounds[i].top>=bounds[i-1].bottom-1,`${name} rounds stack on narrow screens`);
  }
 };
 const swipe=async()=>{await f.locator('body').dispatchEvent('touchstart',{touches:[{identifier:0,clientX:300,clientY:300}]});await f.locator('body').dispatchEvent('touchend',{changedTouches:[{identifier:0,clientX:100,clientY:310}]});};
 const checkBayesian=async(name,allDismissals=false)=>{
  const trigger=f.locator('[data-explanation="bayesian"]');
  assert.equal(await trigger.evaluate(e=>e.tagName),'BUTTON','Bayesian equation is a native button');
  assert.match(await trigger.getAttribute('aria-label'),/Bayesian updating/i);
  assert.equal(await trigger.getAttribute('aria-controls'),'explanation-dialog');
  assert.ok((await trigger.innerText()).includes(recruitment.equation),'equation retains native readable text');
  for(const [index,method] of (allDismissals?['Escape','Close','backdrop']:['Close']).entries()){
   await trigger.focus();await trigger.press(index%2?'Space':'Enter');
   await explanationDialog.waitFor({state:'visible'});
   assert.equal(await f.locator('#explanation-title').innerText(),bayesian.title);
   assert.equal(await f.locator('#explanation-text').innerText(),bayesian.text);
   assert.equal(await f.locator('#explanation-status').innerText(),bayesian.status);
   const symbolDetails=f.locator('#explanation-symbols');
   assert.equal(await symbolDetails.evaluate(e=>e.open),false,'symbol definitions start collapsed');
   await symbolDetails.locator('summary').focus();await page.keyboard.press('Enter');
   assert.equal(await symbolDetails.evaluate(e=>e.open),true,'keyboard expands symbol definitions');
   assert.equal(await f.locator('#explanation-symbol-text').innerText(),bayesian.symbols);
   await symbolDetails.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   await assertPanelFits(`expanded symbols ${name}`);
   await symbolDetails.locator('summary').focus();await page.keyboard.press('Enter');
   assert.equal(await symbolDetails.evaluate(e=>e.open),false,'keyboard collapses symbol definitions');
   assert.equal(await explanationDialog.evaluate(e=>getComputedStyle(e,'::backdrop').backgroundColor),'rgba(0, 0, 0, 0)','Bayesian thought leaves slide undimmed');
   assert.equal(await explanationDialog.evaluate(e=>e.contains(document.activeElement)),true,'Bayesian popup receives focus');
   for(const key of ['Tab','Shift+Tab','ArrowRight','ArrowLeft','PageDown','PageUp','Home','End']){
    await page.keyboard.press(key);
    assert.equal(await f.locator('#slide-count').innerText(),'5 / 8',`${name} ${key} cannot navigate behind Bayesian popup`);
    assert.equal(await explanationDialog.evaluate(e=>e.contains(document.activeElement)),true,'Bayesian popup retains keyboard focus');
   }
   await swipe();assert.equal(await f.locator('#slide-count').innerText(),'5 / 8','Bayesian popup blocks swipe');
   await assertPanelFits(`Bayesian ${name}`);
   if(index===0){await audit(`bayesian-${name}`);await page.screenshot({path:`output/playwright/research-bayesian-${name}.png`});}
   if(method==='Escape')await page.keyboard.press('Escape');
   else if(method==='Close')await explanationDialog.locator('[data-close]').click();
   else {
    const frameBox=await page.locator('#research-deck').boundingBox();
    const point=await explanationDialog.evaluate(e=>{const r=e.getBoundingClientRect();return{x:r.left>4?2:innerWidth-2,y:r.top>4?2:innerHeight-2};});
    await page.mouse.click(frameBox.x+point.x,frameBox.y+point.y);
   }
   await explanationDialog.waitFor({state:'hidden'});
   assert.equal(await trigger.evaluate(e=>e===document.activeElement),true,`${method} restores Bayesian equation focus`);
  }
 };
 await f.locator('#slide-count').filter({hasText:'1 / 8'}).waitFor();
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
 const select=async i=>{await f.locator('#menu-trigger').focus();await f.locator('#menu-trigger').click();await f.locator('#slide-selector').selectOption(String(i));await f.locator('#slide-count').filter({hasText:`${i+1} / 8`}).waitFor();};
 assert.equal(await f.locator('#back').isDisabled(),true);
 const expected=['IMPACT MOSAIC','Table of Contents','Talent is everywhere. Access to learning should be too.','Building on your work: one database, an adaptive cycle',recruitmentSlide.title,databaseSlide.title,cycleSlide.title,'Thank you'];
 // Contents lists every slide except itself: seven live destinations in four groups.
 await select(1);
 assert.equal(await f.locator('.contents-section').count(),4);
 assert.equal(await f.locator('.contents-section[open]').count(),0);
 assert.equal(await f.locator('.contents-subsections li a').count(),7);
 assert.equal(await f.locator('.planned-item').count(),0,'no planned placeholders');
 assert.match(await f.locator('.contents-section').nth(2).textContent(),/Adaptive snowball recruitment/i);
 assert.deepEqual(await f.locator('.contents-subsections li a').evaluateAll(n=>n.map(a=>a.dataset.slide)),[1,3,4,5,6,7,8].map(n=>`research-slide-${n}`),'contents lists every slide in order');
 await audit('contents-collapsed');
 await page.locator('#research-deck').screenshot({path:'output/playwright/research-contents-collapsed.png'});
 const firstGroup=f.locator('.contents-section').nth(0);
 await firstGroup.locator('summary').click();
 await page.locator('#research-deck').screenshot({path:'output/playwright/research-contents-expanded.png'});
 await audit('contents-expanded');
 for(const number of [1,3,4,5,6,7,8]) {
  const link=f.locator(`li a[data-slide="research-slide-${number}"]`);
  const group=f.locator('.contents-section').filter({has:link});
  if(!(await group.evaluate(e=>e.open)))await group.locator('summary').click();
  await link.click();
  assert.equal(await f.locator('#slide-count').innerText(),`${number} / 8`);
  await f.locator('#contents').click();
  assert.equal(await f.locator('#slide-count').innerText(),'2 / 8');
  assert.equal(await f.locator(`li a[data-slide="research-slide-${number}"][aria-current="page"]`).count(),1);
  assert.equal(await f.locator(`li a[data-slide="research-slide-${number}"]`).evaluate(e=>e===document.activeElement),true);
 }
 await firstGroup.evaluate(e=>{e.open=true;});await firstGroup.locator('.section-start').click();
 assert.equal(await f.locator('#slide-count').innerText(),'1 / 8');
 await f.locator('#contents').click();
 const thirdGroup=f.locator('.contents-section').nth(2);
 await thirdGroup.locator('summary').click();
 await firstGroup.locator('summary').evaluate(e=>new Promise(resolve=>setTimeout(resolve,30)));
 assert.equal(await f.locator('.contents-section[open]').count(),1);
 assert.equal(await thirdGroup.locator('li a').count(),2);
 await page.keyboard.press('ArrowRight');
 assert.equal(await f.locator('#slide-count').innerText(),'2 / 8','contents keyboard does not advance deck');
 await thirdGroup.locator('summary').press('Enter');
 assert.equal(await thirdGroup.getAttribute('open'),null);
 await firstGroup.locator('summary').focus();await page.keyboard.press('Enter');
 assert.equal(await firstGroup.evaluate(e=>e.open),true,'native disclosure keyboard support');
 await firstGroup.locator('summary').press('Enter');
 await select(0);
 for(let i=0;i<records.length;i++){
  if(i)await f.locator('#next').click();
  if(i===2){await f.locator('#back').click();assert.equal(await f.locator('#slide-count').innerText(),'2 / 8');await f.locator('#next').click();}
  assert.equal((await f.locator('.present .slide-copy h2').innerText()).replace(/\s+/g,' '),expected[i]);
  assert.equal(await f.locator('.slides>section:not([inert])').count(),1);
  if(i===3){
   assert.equal(await f.locator('.present .pathway-steps>li').count(),5);
   assert.equal(await f.locator('.present > .composition img').count(),2);
   assert.equal(await f.locator('.present .journey-art').count(),5);
   assert.equal(await f.locator('.present .foundation-photos figure').count(),2);
   for(const photo of await f.locator('.present .foundation-photos img').all()) assert.equal(await photo.evaluate(e=>e.naturalWidth>=950),true,'foundation collage uses original resolution');
   assert.equal(await f.locator('.present .pathway-steps h3').first().evaluate(e=>parseFloat(getComputedStyle(e).fontSize)>=24),true,'main stage labels are presentation-size');
   assert.equal(await f.locator('.present .journey-art').first().evaluate(e=>e.getBoundingClientRect().height<80),true,'illustrations remain secondary');

   assert.match(await f.locator('.present .pathway-foundation').innerText(),/Your community relationships/);
   assert.match(await f.locator('.present .pathway-database').innerText(),/Participant database/);
   assert.equal(await f.locator('.present .cycle-spoke').count(),5);
   assert.match(await f.locator('.present .cycle-hub').innerText(),/Participant database/);
   assert.match(await f.locator('.present .database-role').innerText(),/Records inform every decision/);
   assert.equal(await f.locator('.present .closed-cycle').count(),1);
   assert.match(await f.locator('.present .sampling-emphasis').innerText(),/Adaptive snowball recruitment/);
   assert.match(await f.locator('.present .sampling-promise').innerText(),/Recruit.*register.*update/);
   assert.match(await f.locator('.present .cycle-repeat').innerText(),/repeat/);
   assert.match(await f.locator('.present .cycle-insight').innerText(),/Recruitment builds the database/);
   assert.match(await f.locator('.present .cycle-insight').innerText(),/Progress updates the database/);
   assert.equal(await f.locator('[data-explanation]').count(),7);
   assert.equal(await explanationDialog.count(),1,'one shared popup');
   assert.equal(await f.locator('.extension-heading h3').count(),1);
   assert.equal(await f.locator('.extension-heading .extension-instruction').count(),1);
   assert.equal(await f.locator('.cycle-area .extension-heading').count(),0,'heading sits outside ring');
   assert.equal(await f.locator('.foundation-connection').count(),1);
   for(const [index,item] of explanations.entries()){
    const trigger=f.locator(`[data-explanation="${item.id}"]`);
    assert.equal(await trigger.evaluate(e=>e.tagName),'BUTTON','explanation trigger is a native button');
    await trigger.focus();await trigger.press(index%2?'Space':'Enter');
    await explanationDialog.waitFor({state:'visible'});
    assert.equal(await f.locator('#explanation-title').innerText(),item.title);
    assert.equal(await f.locator('#explanation-text').innerText(),item.text);
    assert.equal(await explanationDialog.evaluate(e=>getComputedStyle(e,'::backdrop').backgroundColor),'rgba(0, 0, 0, 0)','thought bubble leaves the slide undimmed');
    assert.equal(await explanationDialog.evaluate(e=>{const r=e.getBoundingClientRect();return r.width<=360&&r.height<innerHeight*.7&&['left','right'].includes(e.dataset.tail);}),true,'desktop thought is compact and beside its selected item');
    assert.equal(await explanationDialog.getAttribute('aria-labelledby'),'explanation-title');
    assert.equal(await explanationDialog.evaluate(e=>e.contains(document.activeElement)),true,'focus enters popup');
    for(const key of ['Tab','Shift+Tab','Tab','Shift+Tab']){await page.keyboard.press(key);assert.equal(await explanationDialog.evaluate(e=>e.contains(document.activeElement)),true,'popup traps keyboard focus');}
    for(const key of ['ArrowRight','ArrowLeft','PageDown','PageUp','Home','End']){await page.keyboard.press(key);assert.equal(await f.locator('#slide-count').innerText(),'4 / 8',`${key} cannot navigate behind popup`);}
    await swipe();assert.equal(await f.locator('#slide-count').innerText(),'4 / 8','popup blocks swipes');
    await assertPanelFits(`desktop ${item.id}`);
    if(index===0){await audit('explanation-desktop');await page.locator('#research-deck').screenshot({path:'output/playwright/research-explanation-desktop.png'});}
    if(index%3===0)await page.keyboard.press('Escape');
    else if(index%3===1)await explanationDialog.locator('[data-close]').click();
    else {
     // A click on the native backdrop must dismiss without activating the diagram.
     const frameBox=await page.locator('#research-deck').boundingBox();
     const point=await explanationDialog.evaluate(e=>{const r=e.getBoundingClientRect();return {x:r.left>4?2:innerWidth-2,y:r.top>4?2:innerHeight-2};});
     await page.mouse.click(frameBox.x+point.x,frameBox.y+point.y);
    }
    await explanationDialog.waitFor({state:'hidden'});
    assert.equal(await trigger.evaluate(e=>e===document.activeElement),true,'each close method restores the exact trigger');
   }

  }

  if(i===4){
   assert.equal(await f.locator('.present [data-recruitment-loop]').count(),1,'recruitment has a feedback loop');
   const copy=await f.locator('.slides > section.present').innerText();
   for(const text of [recruitment.subtitle,recruitment.foundation,...recruitment.rounds.map(round=>round.title),recruitment.nextRound,...recruitment.legend,...recruitment.distinction,recruitment.limit,recruitment.mathsHeading,recruitment.question,recruitment.answer])assert.ok(flat(copy).includes(text),`recruitment displays shared text: ${text}`);
   for(const text of recruitment.gaps)assert.ok(!copy.includes(text),'gap list stays in reading edition');
   assert.doesNotMatch(copy,/\b\d+(?:\.\d+)?\s*%|\b\d+\s+(?:participants|referrals|people reached)\b/i,'conceptual recruitment slide claims no numeric results');
   assert.equal(await f.locator('.present .recruitment-question').innerText(),recruitment.question);
   assert.equal(await f.locator('.present .recruitment-purpose p').innerText(),recruitment.answer);
   assert.equal(await f.locator('.present .recruitment-purpose').evaluate(e=>e.getBoundingClientRect().bottom<=e.nextElementSibling.getBoundingClientRect().top),true,'question and answer lead directly into recruitment graphic');
   assert.equal(await f.locator('.present footer').count(),0,'detached footer question removed');
   await assertRecruitmentFlow('desktop');
   assert.equal(await f.locator('.present > .composition img').count(),1,'recruitment uses one documentary photograph');
   assert.equal(await f.locator('.present > .composition img').evaluate(e=>e.naturalWidth>=950),true,'recruitment uses original resolution');
   await checkBayesian('desktop',true);
  }
  if(i===5)await assertDatabaseFlow('desktop');
  if(i===6)await assertCycle('desktop');
  if(i===7){
   const text=flat(await f.locator('.slides > section.present').innerText());
   for(const item of closingText)assert.ok(text.includes(item),`closing shows: ${item}`);
   assert.match(text,/not an endorsement of this proposal/i,'closing photo limit visible');
   assert.equal(await f.locator('.present > .composition img').count(),2,'closing photo and Impact Mosaic artwork');
   assert.equal(await f.locator(`.present > .composition a[href="${closingSlide.images[0].source}"]`).count(),1,'closing photo source linked');
  }

  for(const img of await f.locator('.present > .composition img').all())assert.equal(await img.evaluate(e=>e.complete&&e.naturalWidth>0),true);
  await page.waitForTimeout(230);
  assert.equal(await f.locator('.slides > section.present').evaluate(e=>e.scrollHeight<=e.clientHeight+2),true,`desktop fits ${i+1}`);
  await audit(`mosaic-desktop-${i+1}`);
  await page.locator('#research-deck').screenshot({path:`output/playwright/research-slide-${i+1}.png`});
 }
 assert.equal(await f.locator('#next').innerText(),'Finish');
 await select(4);
 await f.locator('#menu-trigger').focus();await f.locator('#menu-trigger').click();await f.locator('#sources').click();
 await f.locator('#sources-dialog[open] img').waitFor();
 assert.match(await f.locator('#source-content').innerText(),/2025-10-11/);
 assert.match(await f.locator('#source-content').innerText(),/Beautiful Gate.*Senator Abba Moro/s);
 await audit('mosaic-sources');
 await page.keyboard.press('Escape');assert.equal(await f.locator('#sources-dialog').isVisible(),false);
 assert.equal(await f.locator('#menu-trigger').evaluate(e=>e===document.activeElement),true);
 await f.locator('#next').focus();
 for(const [key,count] of [['Home','1 / 8'],['PageDown','2 / 8'],['ArrowRight','3 / 8'],['PageUp','2 / 8'],['ArrowLeft','1 / 8'],['End','8 / 8']]){await page.keyboard.press(key);assert.equal(await f.locator('#slide-count').innerText(),count);}
 await select(3);
 await f.locator('#menu-trigger').click();await f.getByText('Accessibility options',{exact:true}).click();await f.locator('#deck-read').click();
 assert.match(await f.locator('body').evaluate(()=>window.__spoken.at(-1)),/Building on your work/);
 const spoken=await f.locator('body').evaluate(()=>window.__spoken.at(-1));
 for(const item of explanations)assert.ok(spoken.includes(item.text),`read aloud includes exact ${item.id} explanation`);
 await f.locator('#deck-motion').click();await f.locator('[data-close]').first().click();
 await select(4);assert.equal(await f.locator('.present .composition').evaluate(e=>getComputedStyle(e).animationName),'none');
 await f.locator('#menu-trigger').click();await f.locator('#deck-read').click();
 assert.ok((await f.locator('body').evaluate(()=>window.__spoken.at(-1))).includes(bayesian.text),'recruitment read aloud includes exact Bayesian explanation');
 await f.locator('#deck-menu [data-close]').click();
 await select(5);await f.locator('#menu-trigger').click();await f.locator('#deck-read').click();
 const databaseSpoken=await f.locator('body').evaluate(()=>window.__spoken.at(-1));
 for(const item of databaseText)assert.ok(databaseSpoken.includes(item),`database read aloud retains ${item}`);
 await f.locator('#deck-menu [data-close]').click();
 await select(6);await f.locator('#menu-trigger').click();await f.locator('#deck-read').click();
 const cycleSpoken=await f.locator('body').evaluate(()=>window.__spoken.at(-1));
 for(const point of cycleSlide.points)assert.ok(cycleSpoken.includes(point),`cycle read aloud retains ${point}`);
 await f.locator('#deck-menu [data-close]').click();
 await f.locator('#menu-trigger').click();await f.locator('#deck-motion').click();await f.locator('[data-close]').first().click();
 await page.emulateMedia({reducedMotion:'reduce'});await select(2);assert.equal(await f.locator('.present .composition').evaluate(e=>getComputedStyle(e).animationName),'none');
 for(const [width,height] of [[1280,535],[1266,505]]){
  const name=`short-laptop-${width}x${height}`;
  await page.setViewportSize({width,height});await select(4);
  await assertRecruitmentFlow(name);
  assert.equal(await f.locator('.slides > section.present').evaluate(e=>e.scrollHeight<=e.clientHeight+2&&e.scrollWidth<=e.clientWidth+2),true,`${name} complete slide fits`);
  assert.equal(await f.locator('.present .slide-copy').evaluate(e=>e.scrollHeight<=e.clientHeight+2),true,`${name} copy not clipped`);
  assert.equal(await f.locator('.slides > section.present').evaluate(e=>{
   const parts=[...e.querySelectorAll('h2,.recruitment-foundation p,[data-recruitment-loop] li,.recruitment-maths,.recruitment-question')];
   const controls=[...document.querySelectorAll('#back,#next,#contents,#menu-trigger,#exit-presentation,#slide-count')].map(n=>n.getBoundingClientRect());
   return parts.every(n=>{const r=n.getBoundingClientRect();return r.top>=-1&&r.bottom<=innerHeight+1&&controls.every(c=>r.right<=c.left+1||r.left>=c.right-1||r.bottom<=c.top+1||r.top>=c.bottom-1);});
  }),true,`${name} content remains visible and clears controls`);
  await checkBayesian(name);
  await page.screenshot({path:`output/playwright/research-${name}.png`});
  await select(5);await assertDatabaseFlow(name);
  assert.equal(await f.locator('.slides > section.present').evaluate(e=>e.scrollHeight<=e.clientHeight+2&&e.scrollWidth<=e.clientWidth+2),true,`${name} database complete slide fits`);
  assert.equal(await f.locator('.slides > section.present').evaluate(e=>{
   const parts=[...e.querySelectorAll('h2,.database-quote,.database-inlet,.database-vessel,.database-outcomes,.database-status')];
   const controls=[...document.querySelectorAll('#back,#next,#contents,#menu-trigger,#exit-presentation,#slide-count')].map(n=>n.getBoundingClientRect());
   return parts.every(n=>{const r=n.getBoundingClientRect();return r.top>=-1&&r.bottom<=innerHeight+1&&controls.every(c=>r.right<=c.left+1||r.left>=c.right-1||r.bottom<=c.top+1||r.top>=c.bottom-1);});
  }),true,`${name} database content clears controls`);
  await audit(`database-${name}`);
  await page.screenshot({path:`output/playwright/research-database-${name}.png`});
  await select(6);await assertCycle(name);
  assert.equal(await f.locator('.slides > section.present').evaluate(e=>e.scrollHeight<=e.clientHeight+2&&e.scrollWidth<=e.clientWidth+2),true,`${name} cycle complete slide fits`);
  assert.equal(await f.locator('.slides > section.present').evaluate(e=>{
   const parts=[...e.querySelectorAll('h2,.cycle7-restart,.cycle7-stages>li,.cycle7-hub,.cycle7-statement,.cycle7-status')];
   const controls=[...document.querySelectorAll('#back,#next,#contents,#menu-trigger,#exit-presentation,#slide-count')].map(n=>n.getBoundingClientRect());
   return parts.every(n=>{const r=n.getBoundingClientRect();return r.top>=-1&&r.bottom<=innerHeight+1&&controls.every(c=>r.right<=c.left+1||r.left>=c.right-1||r.bottom<=c.top+1||r.top>=c.bottom-1);});
  }),true,`${name} cycle content clears controls`);
  await audit(`cycle-${name}`);
  await page.screenshot({path:`output/playwright/research-cycle-${name}.png`});
  await select(7);
  assert.equal(await f.locator('.slides > section.present').evaluate(e=>e.scrollHeight<=e.clientHeight+2&&e.scrollWidth<=e.clientWidth+2),true,`${name} closing slide fits`);
  assert.equal(await f.locator('.slides > section.present').evaluate(e=>{
   const parts=[...e.querySelectorAll('h2,.closing-photo,.closing-headline,.closing-message,.closing-together,.closing-brand')];
   const controls=[...document.querySelectorAll('#back,#next,#contents,#menu-trigger,#exit-presentation,#slide-count')].map(n=>n.getBoundingClientRect());
   return parts.every(n=>{const r=n.getBoundingClientRect();return r.top>=-1&&r.bottom<=innerHeight+1&&controls.every(c=>r.right<=c.left+1||r.left>=c.right-1||r.bottom<=c.top+1||r.top>=c.bottom-1);});
  }),true,`${name} closing content clears controls`);
  await audit(`closing-${name}`);
 }
 // Mobile image/viewer behavior is exercised by browser-mobile-research.mjs.
 for(const [width,size,name] of [[1440,'200%','desktop-200']]){
  await page.setViewportSize({width,height:900});
  await f.locator('html').evaluate((e,size)=>e.style.fontSize=size,size);
  if(name==='phone-a-plus'){await f.locator('#menu-trigger').click();await f.locator('#deck-large').click();await f.locator('#deck-menu [data-close]').click();}
  for(let i=0;i<records.length;i++){
   await select(i);
   assert.equal(await f.locator('.slides > section.present').evaluate(e=>e.scrollWidth<=e.clientWidth+2),true,`${name}-${i+1} no horizontal overflow`);
   assert.equal(await f.locator('.present .slide-copy').evaluate(e=>{const r=e.getBoundingClientRect();return r.height>=e.scrollHeight-2;}),true,`${name}-${i+1} copy not clipped`);
   if(i===3){
    assert.equal(await f.locator('.present .pathway-steps li').first().evaluate(e=>getComputedStyle(e).position),width<=1100||size?'relative':'absolute',`${name} cycle layout`);
    await f.locator('[data-explanation="database"]').click();
    assert.equal(await f.locator('#explanation-text').innerText(),explanations.at(-1).text);
    await assertPanelFits(name);await audit(`explanation-${name}`);
    await page.screenshot({path:`output/playwright/research-explanation-${name}.png`});
    await explanationDialog.locator('[data-close]').click();
   }
   if(i===4){await assertRecruitmentFlow(name);await checkBayesian(name);}
   if(i===5){await assertDatabaseFlow(name);await audit(`database-${name}`);await page.screenshot({path:`output/playwright/research-database-${name}.png`});}
   if(i===6){await assertCycle(name);await audit(`cycle-${name}`);await page.screenshot({path:`output/playwright/research-cycle-${name}.png`});}
   if(width===390&&i===2)assert.equal(await f.locator('.present .slide-visual').evaluate(e=>e.getBoundingClientRect().top<e.parentElement.querySelector('.slide-copy').getBoundingClientRect().top),true);
   if(width===390&&i===4)assert.equal(await f.locator('.present .recruitment-foundation').evaluate(e=>e.getBoundingClientRect().top<e.parentElement.querySelector('.recruitment-proposal').getBoundingClientRect().top),true,'phone presents community foundation before proposed refinement');
  }
  const controls=await f.locator('#back').evaluate(e=>{const back=e.getBoundingClientRect(),next=document.querySelector('#next').getBoundingClientRect(),exit=document.querySelector('#exit-presentation').getBoundingClientRect();const apart=(a,b)=>a.right<=b.left||b.right<=a.left||a.bottom<=b.top||b.bottom<=a.top;return apart(back,next)&&apart(exit,back)&&apart(exit,next);});assert.equal(controls,true,`${name} controls do not overlap`);
  await select(1);
  await firstGroup.evaluate(e=>{e.open=true;});
  await audit(`contents-${name}`);
  assert.equal(await f.locator('.slides > section.present').evaluate(e=>e.scrollWidth<=e.clientWidth+2),true,`contents ${name} width`);
  for(const summary of await f.locator('.contents-section summary').all()) assert.equal(await summary.evaluate(e=>e.scrollWidth<=e.clientWidth+2),true,`contents ${name} summary fits`);
  await page.screenshot({path:`output/playwright/research-contents-${name}.png`});
  await thirdGroup.locator('summary').click();
  assert.equal(await f.locator('.slides > section.present').evaluate(e=>e.scrollWidth<=e.clientWidth+2),true,`second open group ${name} width`);
  await firstGroup.evaluate(e=>{e.open=false;});await thirdGroup.evaluate(e=>{e.open=false;});
  await select(4);
  await audit(`mosaic-${name}`);await page.screenshot({path:`output/playwright/research-${name}.png`});
  if(name==='phone-a-plus'){await f.locator('#menu-trigger').click();await f.locator('#deck-large').click();await f.locator('#deck-menu [data-close]').click();}
 }
 await f.locator('html').evaluate(e=>e.style.fontSize='');await page.setViewportSize({width:1440,height:900});
 await select(0);await f.locator('#menu-trigger').click();await f.locator('#previous:disabled').waitFor();await f.locator('[data-close]').first().click();
 // Horizontal swipes advance; vertical gestures keep the current slide.
 await f.locator('body').dispatchEvent('touchstart',{touches:[{identifier:0,clientX:300,clientY:300}]});await f.locator('body').dispatchEvent('touchend',{changedTouches:[{identifier:0,clientX:100,clientY:310}]});assert.equal(await f.locator('#slide-count').innerText(),'2 / 8');
 await f.locator('body').dispatchEvent('touchstart',{touches:[{identifier:0,clientX:300,clientY:300}]});await f.locator('body').dispatchEvent('touchend',{changedTouches:[{identifier:0,clientX:290,clientY:100}]});assert.equal(await f.locator('#slide-count').innerText(),'2 / 8');
 await select(7);await f.locator('#next').click();await page.getByRole('button',{name:'Research',exact:true}).waitFor();
 assert.deepEqual(await page.evaluate(()=>({local:{...localStorage},session:{...sessionStorage}})),stored,'stored demo bytes unchanged');
 // Visible central exit returns to the site and preserves records.
 await page.getByRole('button',{name:'Research',exact:true}).click();
 await f.locator('#contents').click();if(!(await firstGroup.evaluate(e=>e.open)))await firstGroup.locator('summary').click();
 await firstGroup.locator('.section-start').click();
 await f.getByRole('button',{name:'Exit presentation',exact:true}).click();
 await page.getByRole('button',{name:'Research',exact:true}).waitFor();
 assert.equal(await page.evaluate(()=>!!document.fullscreenElement),false);
 assert.deepEqual(await page.evaluate(()=>({local:{...localStorage},session:{...sessionStorage}})),stored,'visible exit preserves stored records');
 await page.evaluate(()=>window.__refuseFullscreen=true);await page.getByRole('button',{name:'Research',exact:true}).click();await f.locator('.slides > section.present').waitFor();assert.equal(await page.evaluate(()=>!!document.fullscreenElement),false);
 await page.goto(new URL('?page=research',origin).href);await f.locator('#slide-count').filter({hasText:'1 / 8'}).waitFor();assert.equal(await page.locator('header,footer').count(),0);
 assert.equal(await page.evaluate(()=>window.__fullscreenRequests),0);
 await f.locator('#menu-trigger').focus();await f.locator('#menu-trigger').click();await f.getByRole('link',{name:'Detailed Research proposal',exact:true}).click();await page.locator('.research-page').waitFor();
 await page.getByRole('link',{name:'Return to the presentation',exact:true}).click();await f.locator('.slides > section.present').waitFor();
 await page.goto(new URL('research/reading.html',origin).href);assert.equal(await page.locator('article').count(),8);assert.equal(await page.locator('figure').count(),7);await assertExplanationsIn(page.locator('main'),'reading edition');await assertDatabaseCopy(page.locator('main'),'reading edition');for(const point of [...cycleSlide.points,...recruitmentSlide.points,...closingSlide.points])assert.ok((await page.locator('main').textContent()).includes(point),`reading edition retains ${point}`);await audit('mosaic-reading');
 await page.pdf({path:'output/playwright/research-reading.pdf',format:'A4',printBackground:true});
 await page.goto(new URL('research/index.html',origin).href);await page.locator('#slide-count').filter({hasText:'1 / 8'}).waitFor();await page.locator('#menu-trigger').focus();await page.locator('#menu-trigger').click();await page.locator('#slide-selector').selectOption('3');await page.locator('[data-explanation="step-0"]').click();await page.emulateMedia({media:'print'});
 assert.equal(await page.locator('#explanation-dialog').isVisible(),false,'print hides open popup');
 assert.equal(await page.locator('.extension-instruction').isVisible(),false,'print hides interaction instruction');
 for(const button of await page.locator('[data-explanation]').all()){
  assert.equal(await button.isVisible(),true,'print preserves stage labels');
  assert.equal(await button.evaluate(e=>{const style=getComputedStyle(e);return style.boxShadow==='none'&&parseFloat(style.borderTopWidth)===0;}),true,'printed labels have no button chrome');
 }
 for(const slide of await page.locator('.slides>section').all())assert.equal(await slide.isVisible(),true);
 assert.equal(await page.locator('.closed-cycle').count(),1,'printed diagram has a closed feedback ring');
 assert.equal(await page.locator('.foundation-connection').evaluate(e=>{const r=e.getBoundingClientRect(),s=e.closest('section').getBoundingClientRect();return r.left>=s.left&&r.right<=s.right;}),true,'printed foundation arrow stays on the slide');
 assert.equal(await page.locator('.pathway-steps li').first().evaluate(e=>getComputedStyle(e).position),'absolute','printed cycle retains radial stages');
 assert.equal(await page.locator('[data-recruitment-loop]').isVisible(),true,'print preserves recruitment feedback loop');
 assert.ok((await page.locator('[data-explanation="bayesian"]').innerText()).includes(recruitment.equation),'print preserves native Bayesian equation');
 await assertDatabaseCopy(page.locator('.layout-database:not(.slide-background)'),'slide print');
 assert.equal(await page.locator('[data-database-flow]').isVisible(),true,'print preserves database flow');
 assert.equal(await page.locator('[data-cycle-complete]').isVisible(),true,'print preserves cycle ring');
 assert.equal(await page.locator('.cycle7-restart-arc').isVisible(),true,'print preserves restart arc');
 assert.equal(await page.locator('.recruitment-round-art').count(),3,'print preserves three recruitment rounds');
 assert.equal(await page.locator('.slides>section').count(),8,'eight printed slides');
 await page.pdf({path:'output/playwright/research-slides.pdf',format:'A4',landscape:true,printBackground:true});
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:900}}),np=await nojs.newPage();await np.goto(origin);
 assert.equal(await np.locator('#static-research iframe').count(),0);assert.equal(await np.locator('#static-research .research-linear[open] article').count(),8);for(const point of cycleSlide.points)assert.ok((await np.locator('#static-research').textContent()).includes(point),`site no-JS retains ${point}`);
 await assertExplanationsIn(np.locator('#static-research'),'site no-JS');
 await assertDatabaseCopy(np.locator('#static-research'),'site no-JS');
 await np.goto(new URL('research/index.html',origin).href);await np.getByRole('link',{name:'Read all 8 slides without JavaScript'}).click();assert.equal(await np.locator('article').count(),8);assert.equal(await np.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await assertExplanationsIn(np.locator('main'),'standalone no-JS reading');await assertDatabaseCopy(np.locator('main'),'standalone no-JS reading');
 await nojs.close();
 evidence.checks=['seven exact shared explanations; native buttons, Enter/Space, focus trap/restoration, Escape/Close/backdrop, blocked keyboard/swipes','Bayesian and cycle popup desktop/phone/A+/200% fits and scrolls, axe, reading/no-JS/read-aloud parity and print labels/rings/equation','visible central exit preserves records and leaves fullscreen','four-group contents listing all seven other slides, no planned placeholders, single expansion, keyboard, focus, return/current marker and responsive layout','fullscreen entry/refusal/direct links','eight exact headlines, Nigeria framing with no Plateau wording, closing thank-you with credited 2025 recognition photograph and Impact Mosaic mark, loaded photographs, three-round adaptive snowball dot drawings with key, limit and next-round return and pathway with database/two feedback loops','database quote/date/interview URL and independent photo source; four records, four outcomes, native cylinder and arrows; no invented participant results','database desktop/phone/200%/A+/short-laptop fit, controls and reading/static/speech/print parity','Next/Finish/menu/keyboard/swipe/exit','sources/dialog partner credit/focus/read aloud','OS and manual reduced motion','desktop/phone/200% text','reading/detailed proposal/no-JS/print','cycle completion: five stages with needs met, database hub, restart arc fed by progress evidence and feedback, no invented outcomes; desktop/short-laptop/phone/200%/A+ fit, no overlapping ring boxes, read-aloud/reading/no-JS/print parity','stored demo bytes preserved'];
 assert.deepEqual(evidence.errors,[]);assert.deepEqual(evidence.csp,[]);assert.deepEqual(evidence.failed,[]);
 await writeFile('output/playwright/research-verification.json',JSON.stringify(evidence,null,2));console.log('Research presentation checks passed:',evidence);
}finally{await browser.close();}
