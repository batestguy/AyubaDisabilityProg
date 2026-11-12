import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir,writeFile } from 'node:fs/promises';
const origin=process.env.STORY_URL || 'http://127.0.0.1:4175/';
await mkdir('output/playwright',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const results=[];
try {
 const context=await browser.newContext({hasTouch:true,reducedMotion:'reduce'});
 const page=await context.newPage();
 await page.routeWebSocket('**', socket=>socket.close());
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(new URL('?page=research',origin).href);
 const frame=page.frameLocator('#research-deck');
 await frame.locator('#slide-count').filter({hasText:'1 / 8'}).waitFor();
 const apart=(a,b)=>a.right<=b.left+1||b.right<=a.left+1||a.bottom<=b.top+1||b.bottom<=a.top+1;
 for(const [width,height] of [[320,740],[390,844],[430,932],[568,320],[700,390],[701,390],[844,390],[932,430]]) {
  await page.setViewportSize({width,height});
  for(const large of [false,true]) {
   await frame.locator('html').evaluate((e,large)=>e.classList.toggle('large',large),large);
   for(let index=0;index<8;index++) {
    await frame.locator('#menu-trigger').focus();await frame.locator('#menu-trigger').click();
    await frame.locator('#slide-selector').selectOption(String(index));
    const section=frame.locator('.slides>section.present');
    assert.equal(await section.evaluate(e=>e.scrollWidth<=e.clientWidth+2),true,`${width}/${height}/${large}/${index} width`);
    const controls=await frame.locator('body').evaluate(()=>[...document.querySelectorAll('body>button:not([hidden]),#slide-count')].filter(n=>n.getClientRects().length).map(n=>{const r=n.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom};}));
    for(let a=0;a<controls.length;a++)for(let b=a+1;b<controls.length;b++)assert.ok(apart(controls[a],controls[b]),`controls separate ${width}/${height}/${large}/${index}`);
    if(width<=700&&index>=2) {
     assert.equal(await section.locator('>.composition').isVisible(),false);
     const image=section.locator('.slide-image-button img');
     await image.evaluate(i=>i.decode());
     assert.equal(await image.evaluate(i=>i.naturalWidth),3200);
     const box=await image.boundingBox();
     assert.ok(Math.abs(box.width/box.height-1.6)<.01,'whole image proportions');
     assert.ok(box.y>=0 && box.y+box.height<=height,'image initially in viewport');
     for(const control of controls)assert.ok(apart({left:box.x,right:box.x+box.width,top:box.y,bottom:box.y+box.height},control),'image clears navigation');
     await section.getByText('Read slide text',{exact:true}).click();
     assert.ok((await section.locator('.slide-transcript').innerText()).length>200);
     if(index!==6)assert.ok(await section.locator('.slide-transcript a[href^="https://"]').count()>0,'working source links in transcript');
     await section.getByText('Read slide text',{exact:true}).click();
     const trigger=section.locator('.slide-image-button');
     await trigger.focus();await trigger.press('Enter');
     const viewer=frame.locator('#slide-viewer');await viewer.waitFor({state:'visible'});
     assert.equal(await viewer.locator('#zoom-level').innerText(),'300%','tap opens enlarged');
     await viewer.getByRole('button',{name:'Zoom in',exact:true}).click();
     await viewer.getByRole('button',{name:'Zoom in',exact:true}).click();
     const viewport=viewer.locator('.viewer-scroll');
     assert.equal(await viewport.evaluate(e=>e.scrollWidth>e.clientWidth),true);
     await viewport.focus();await viewport.press('+');
     await viewport.evaluate(e=>e.scrollTo(10000,10000));
     assert.ok(await viewport.evaluate(e=>e.scrollLeft>0));
     await viewport.dispatchEvent('touchstart',{touches:[{identifier:0,clientX:20,clientY:40},{identifier:1,clientX:80,clientY:40}]});
     await viewport.dispatchEvent('touchmove',{touches:[{identifier:0,clientX:20,clientY:40},{identifier:1,clientX:140,clientY:40}]});
     await viewport.dispatchEvent('touchend',{touches:[]});
     assert.notEqual(await viewer.locator('#zoom-level').innerText(),'225%','pinch changes zoom');
     await viewer.getByRole('button',{name:'Fit slide',exact:true}).click();
     assert.equal(await viewer.locator('#zoom-level').innerText(),'100%');
     await viewport.focus();await viewport.press('Tab');
     assert.equal(await viewer.evaluate(e=>e.contains(document.activeElement)),true,'Tab wraps inside viewer');
     await viewer.getByRole('button',{name:'Close enlarged slide',exact:true}).click();
     assert.equal(await trigger.evaluate(e=>e===document.activeElement),true,'focus restored');
     await trigger.press('Space');await viewer.waitFor({state:'visible'});
     await viewer.press('Escape');assert.equal(await trigger.evaluate(e=>e===document.activeElement),true);
    } else if(index>=2) assert.equal(await section.locator('>.composition').isVisible(),true,'live desktop');
    if(width<=700&&index===1){
     for(const summary of await section.locator('summary').all()) {
      await summary.click();
      assert.equal(await section.evaluate(e=>e.scrollWidth<=e.clientWidth+2),true,'open contents fits');
     }
    }
   }
   results.push({width,height,large,slides:8});
   console.log(`Checked ${width} × ${height}, ${large ? '200%' : 'normal'} text`);
  }
 }
 // Audit each mobile slide, its transcript, the enlarged dialog and desktop deck.
 for(const width of [390,1440]) {
  await page.setViewportSize({width,height:900});
  await frame.locator('html').evaluate(e=>e.classList.remove('large'));
  for(let index=0;index<8;index++) {
   await frame.locator('#menu-trigger').focus();await frame.locator('#menu-trigger').click();
   await frame.locator('#slide-selector').selectOption(String(index));
   if(width===390&&index>=2)await frame.locator('.present .slide-transcript summary').click();
   const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
   assert.deepEqual(audit.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],`axe ${width} slide ${index+1}`);
   if(width===390&&index>=2)await frame.locator('.present .slide-transcript summary').click();
  }
 }
 await page.setViewportSize({width:390,height:844});
 await frame.locator('.present .slide-image-button').click();
 const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
 assert.deepEqual(audit.violations.map(v=>v.id),[],'viewer axe');
 await page.screenshot({path:'output/playwright/mobile-slide-viewer.png'});
 await frame.locator('#slide-viewer [data-close]').click();
 await page.screenshot({path:'output/playwright/mobile-slide.png'});
 // Rotation switches the underlying slide back to live content. Close must
 // return focus to a visible element rather than the now-hidden image button.
 await frame.locator('.present .slide-image-button').click();
 await page.setViewportSize({width:844,height:390});
 await frame.locator('#slide-viewer [data-close]').click();
 assert.equal(await frame.locator('.slides>section.present').evaluate(e=>e===document.activeElement),true);
 await page.setViewportSize({width:390,height:844});
 await frame.locator('#back').click();
 assert.equal(await frame.locator('#slide-count').innerText(),'7 / 8');
 await frame.locator('#next').click();
 assert.equal(await frame.locator('#slide-count').innerText(),'8 / 8');
 await frame.locator('#contents').click();
 assert.equal(await frame.locator('#slide-count').innerText(),'2 / 8');
 const stored=await page.evaluate(()=>({local:{...localStorage},session:{...sessionStorage}}));
 await frame.locator('#exit-presentation').click();
 await page.getByRole('button',{name:'Research',exact:true}).waitFor();
 assert.deepEqual(await page.evaluate(()=>({local:{...localStorage},session:{...sessionStorage}})),stored,'exit preserves sample records');
 assert.deepEqual(errors,[]);
 await writeFile('output/playwright/mobile-research.json',JSON.stringify({origin,results,errors},null,2));
 console.log(`Passed ${results.length*8} slide/layout/text checks, zoom/pinch/scroll/focus, and 17 axe audits.`);
} finally {await browser.close();}
