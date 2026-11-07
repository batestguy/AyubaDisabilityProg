import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const show=process.argv.includes('--show');
await mkdir('output/playwright',{recursive:true});
const context=show
 ?await chromium.launchPersistentContext(path.resolve('output/fresh-demo-preview'),{channel:'chrome',headless:false,viewport:{width:1440,height:1050}})
 :await (await chromium.launch({channel:'chrome',headless:true})).newContext({viewport:{width:1440,height:1050}});
const browser=context.browser();
const page=context.pages()[0]||await context.newPage();
const target=process.env.FRESH_DEMO_URL||'http://127.0.0.1:4173/?demo=connected';
const errors=[],posts=[],audits=[];
const headers=await readFile('public/_headers','utf8');
const csp=headers.split('\n').find(line=>line.includes('Content-Security-Policy:')).split('Content-Security-Policy:')[1].trim();
await page.route('**/*',async route=>{
 if(route.request().resourceType()!=='document')return route.continue();
 const response=await route.fetch();await route.fulfill({response,headers:{...response.headers(),'content-security-policy':csp}});
});
if(!show)await context.addInitScript(()=>{
 if(sessionStorage.getItem('fresh-demo-test-started'))return;
 sessionStorage.setItem('fresh-demo-test-started','yes');
 for(const key of ['mosaic-user-demo-v1','mosaic-user-demo-v1-backup','mosaic-guided-teaching-v1','mosaic-v1'])sessionStorage.setItem(key,'old demo marker');
 localStorage.setItem('mosaic-connected-v1','old connected marker');
 localStorage.setItem('unrelated-storage','preserve local');sessionStorage.setItem('unrelated-storage','preserve session');
});
page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.method()==='POST')posts.push(r.url());});
const button=name=>page.getByRole('button',{name,exact:true});
const nav=async name=>page.getByRole('navigation',{name:'Connected workspace',exact:true}).getByRole('button',{name,exact:true}).click();
async function audit(name){const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();audits.push({name,violations:result.violations});assert.deepEqual(result.violations,[],name);}
async function fresh(){
 const controls=page.locator('.fresh-demo-controls');
 if(!await controls.evaluate(el=>el.open))await controls.locator('summary').click();
 await button('Start a fresh demo').click();await button('Clear demo activity and start fresh').click();
 await page.getByText('Fresh demo ready.',{exact:false}).waitFor();
}
async function signOut(){await button('Sign out').click();await page.getByRole('region',{name:'Choose a demo interface'}).waitFor();}
try{
 await page.goto(target);await fresh();
 const clean=await page.evaluate(()=>JSON.parse(localStorage.getItem('mosaic-connected-v1')));
 assert.equal(clean.cleanStart,true);assert.deepEqual(clean.events,[]);assert.equal(clean.legacy,undefined);
 if(show){
  await page.getByRole('region',{name:'Choose a demo interface'}).scrollIntoViewIfNeeded();await page.screenshot({path:'output/playwright/fresh-demo-ready.png',fullPage:false});await page.bringToFront();console.log('Visible fresh demo is open at '+page.url()+' with all three role choices and zero saved activity. Close the Chrome window when finished.');await new Promise(resolve=>context.on('close',resolve));process.exit(0);
 }
 if(!show){
  const stores=await page.evaluate(()=>({old:sessionStorage.getItem('mosaic-user-demo-v1'),backup:sessionStorage.getItem('mosaic-user-demo-v1-backup'),guided:sessionStorage.getItem('mosaic-guided-teaching-v1'),sandbox:sessionStorage.getItem('mosaic-v1'),local:localStorage.getItem('unrelated-storage'),session:sessionStorage.getItem('unrelated-storage')}));
  assert.equal(stores.old,null);assert.equal(stores.backup,null);assert.equal(stores.guided,null);assert.notEqual(stores.sandbox,'old demo marker');assert.equal(stores.local,'preserve local');assert.equal(stores.session,'preserve session');
 }
 await audit('fresh-role-entry');
 for(const [role,heading,file] of [['Learner','Your next steps','learner'],['Facilitator','Your teaching desk','facilitator'],['Administration','Administration action queue','administration']]){
  await button(`Use ${role} interface`).click();await button('Sign in').click();await page.getByRole('heading',{name:heading,exact:true}).waitFor();
  if(role==='Learner')await page.getByText('Choose your first course',{exact:true}).waitFor();
  if(role==='Facilitator')await page.getByText('No learners assigned yet',{exact:true}).waitFor();
  await audit(`fresh-${file}`);await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`output/playwright/fresh-${file}.png`,fullPage:true});await signOut();
 }
 await button('View earlier demos').click();await page.getByRole('heading',{name:'You are viewing earlier demo screens',exact:true}).waitFor();
 await button('Open guided teaching demo').click();await button('Back to earlier demo').click();await button('Open guided teaching demo').waitFor();await button('Back to connected demo').click();
 await page.getByRole('region',{name:'Choose a demo interface'}).waitFor();
 const controls=page.locator('.fresh-demo-controls');if(!await controls.evaluate(el=>el.open))await controls.locator('summary').click();await button('Start a fresh demo').click();await button('Keep current demo').click();assert.equal(await page.getByRole('region',{name:'Fresh demo confirmation'}).count(),0);
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>document.documentElement.style.fontSize='200%');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await audit('fresh-mobile-enlarged');await page.evaluate(()=>document.documentElement.style.fontSize='');await page.setViewportSize({width:1440,height:1050});
 await fresh();await page.reload();await page.getByText('Fresh demo ready.',{exact:false}).waitFor();
 const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('mosaic-connected-v1')));assert.deepEqual(after.events,[]);assert.equal(after.cleanStart,true);
 assert.deepEqual(errors,[]);assert.deepEqual(posts,[]);
 await page.getByRole('region',{name:'Choose a demo interface'}).scrollIntoViewIfNeeded();
 await page.screenshot({path:'output/playwright/fresh-demo-ready.png',fullPage:false});
 await writeFile('output/playwright/fresh-demo-results.json',JSON.stringify({audits,errors,posts,cleanStart:true,events:0,visible:show},null,2));
 console.log(`Fresh demo passed: ${audits.length} clean accessibility audits; all three interfaces, scoped clear/cancel, archive navigation, mobile 200% text and clean reload; zero errors/POST.`);
 if(show){await page.bringToFront();console.log('Visible fresh demo is open. Close the Chrome window when finished.');await new Promise(resolve=>context.on('close',resolve));}
}catch(error){await page.screenshot({path:'output/playwright/fresh-demo-failure.png',fullPage:true}).catch(()=>{});console.error(error);process.exitCode=1;}
finally{await context.close().catch(()=>{});await browser?.close().catch(()=>{});}
