import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { freshConnected } from '../output/tests/src/connectedDemo.js';
import { freshSharedDemo } from '../output/tests/src/sharedDemo.js';

await mkdir('output/playwright',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1050}});
const earlier=freshSharedDemo();
earlier.user.profile.name='Earlier map record must stay separate';
earlier.user.profile.state='Plateau';
await context.addInitScript(({connected,legacy})=>{
 if(!sessionStorage.getItem('map-fixture-ready')){
  localStorage.setItem('mosaic-connected-v1',connected);
  sessionStorage.setItem('mosaic-user-demo-v1',legacy);
  sessionStorage.setItem('map-fixture-ready','1');
 }
},{connected:JSON.stringify(freshConnected()),legacy:JSON.stringify(earlier)});
const page=await context.newPage(),errors=[],posts=[],audits=[];
page.on('pageerror',error=>errors.push(error.message));
page.on('request',request=>{if(request.method()==='POST')posts.push(request.url());});
const target=process.env.CONNECTED_URL||'http://127.0.0.1:5173/';
const button=name=>page.getByRole('button',{name,exact:true});
const nav=name=>page.getByRole('navigation',{name:'Connected workspace',exact:true}).getByRole('button',{name,exact:true}).click();
const raw=()=>page.evaluate(()=>localStorage.getItem('mosaic-connected-v1'));
async function signIn(role,username,code){
 await button(`Use ${role} interface`).click();
 await page.getByLabel('Username',{exact:true}).fill(username);
 await page.getByLabel('Demo access code',{exact:true}).fill(code);
 await button('Sign in').click();await button('Sign out').waitFor();
}
async function signOut(){await button('Sign out').click();await button('Use Learner interface').waitFor();}
async function audit(name){const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();audits.push({name,violations:result.violations});assert.deepEqual(result.violations,[],name);}
async function country(){await page.getByRole('group',{name:'Nigeria learner state map',exact:true}).waitFor();assert.equal(await page.locator('.cd-nigeria-map path').count(),37);}
try{
 await page.goto(new URL('?demo=connected',target).href);
 await button('Use Learner interface').click();await button('Register as a learner').click();
 await page.getByLabel('Display name',{exact:true}).fill('Map Registration Learner');
 await page.getByLabel('Choose a username').fill('map-registration-learner');
 await page.getByLabel('Home state',{exact:true}).selectOption('Plateau');
 await button('Create sample profile').click();
 await page.getByRole('status').filter({hasText:'Your sample profile is ready.'}).waitFor();
 const created=JSON.parse(await raw()).events.find(event=>event.type==='register'&&event.payload.username==='map-registration-learner');
 await signIn('Learner','map-registration-learner',created.payload.demoCode);
 assert.equal(await page.getByRole('navigation',{name:'Connected workspace',exact:true}).getByRole('button',{name:'Learner map',exact:true}).count(),0);
 await signOut();await signIn('Administration','admin','DEMO-ADMIN');
 const recordsBefore=await raw(),legacyBefore=await page.evaluate(()=>sessionStorage.getItem('mosaic-user-demo-v1'));
 let releaseMap;const gate=new Promise(resolve=>{releaseMap=resolve;});
 await page.route('**/nigeria-admin-map.json',async route=>{await gate;await route.continue();});
 await nav('Learner map');await page.getByText('Loading Nigeria learner map…',{exact:true}).waitFor();
 assert.equal(await button('Open learner: Map Registration Learner').count(),1);
 await audit('connected-map-loading');releaseMap();await country();await page.unroute('**/nigeria-admin-map.json');
 await page.getByRole('button',{name:'Plateau: 1 learner',exact:true}).waitFor();
 assert.equal(await page.getByLabel('Choose state or FCT',{exact:true}).locator('option').count(),38);
 assert.equal(await page.getByText('Earlier map record must stay separate',{exact:true}).count(),0);
 await page.getByLabel('Map profile scope').selectOption('registered');
 assert.equal(await page.locator('.cd-map-person').count(),1);
 await page.getByLabel('Map profile scope').selectOption('samples');
 await page.getByRole('button',{name:'Plateau: 0 learners',exact:true}).waitFor();
 assert.equal(await button('Open learner: Map Registration Learner').count(),0);
 await page.getByLabel('Map profile scope').selectOption('all');
 await audit('connected-map-country');
 await page.screenshot({path:'output/playwright/connected-map-country.png',fullPage:true});
 await page.getByRole('button',{name:'Plateau: 1 learner',exact:true}).focus();await page.keyboard.press('Enter');
 await page.getByRole('group',{name:'Plateau LGA boundaries',exact:true}).waitFor();
 assert.equal(await page.locator('.cd-nigeria-map path').count(),17);
 await page.getByRole('button',{name:'Jos North: LGA boundary',exact:true}).focus();await page.keyboard.press('Space');
 await page.getByRole('heading',{name:'Plateau · Jos North',exact:true}).waitFor();
 await page.getByText('Learner profiles record a home state, not an LGA.',{exact:false}).waitFor();
 assert.equal(await button('Open learner: Map Registration Learner').count(),1,'LGA reference view retains state-level learner list');
 assert.doesNotMatch(await page.getByLabel('Choose LGA boundary').innerText(),/learner/);
 await audit('connected-map-lga-boundaries');
 await button('Open learner: Map Registration Learner').click();
 await page.waitForFunction(id=>document.activeElement?.id===id,`learner-person-${created.id}`);
 await nav('Learner map');await country();await button('Missing or unmatched state (2)').click();
 assert.equal(await page.locator('.cd-map-person').count(),2);
 await page.getByLabel('Search map learner list').fill('No such learner');
 await page.getByText('No matching learners.',{exact:false}).waitFor();
 await page.getByLabel('Search map learner list').fill('');
 await button('Open learner: Ada Okafor').click();
 await page.waitForFunction(()=>document.activeElement?.id==='work-sample-ada-enrolment');
 assert.equal(await raw(),recordsBefore,'Map navigation does not alter connected records');
 assert.equal(await page.evaluate(()=>sessionStorage.getItem('mosaic-user-demo-v1')),legacyBefore);
 await signOut();await signIn('Learner','map-registration-learner',created.payload.demoCode);
 await page.getByText('Home state: Plateau',{exact:true}).click();
 await page.getByLabel('Home state',{exact:true}).selectOption('FCT');await button('Save home state').click();
 await signOut();await signIn('Facilitator','amaka','DEMO-AMAKA');
 assert.equal(await page.getByRole('navigation',{name:'Connected workspace',exact:true}).getByRole('button',{name:'Learner map',exact:true}).count(),0);
 await signOut();await signIn('Administration','admin','DEMO-ADMIN');await nav('Learner map');await country();
 await page.getByRole('button',{name:'Plateau: 0 learners',exact:true}).waitFor();await page.getByRole('button',{name:'FCT: 1 learner',exact:true}).waitFor();
 const afterStateChange=await raw();
 await page.reload();await signIn('Administration','admin','DEMO-ADMIN');await nav('Learner map');await country();
 await page.getByLabel('Choose state or FCT',{exact:true}).selectOption('NG-FC');
 await page.getByRole('group',{name:'FCT LGA boundaries',exact:true}).waitFor();
 assert.equal(await page.locator('.cd-nigeria-map path').count(),6);
 await page.setViewportSize({width:390,height:844});await audit('connected-map-mobile');
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.screenshot({path:'output/playwright/connected-map-mobile.png',fullPage:true});
 await page.evaluate(()=>document.documentElement.style.fontSize='200%');await audit('connected-map-enlarged');
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.evaluate(()=>document.documentElement.style.fontSize='');await page.setViewportSize({width:1440,height:1050});
 await nav('Overview');const malformed=JSON.parse(await readFile('public/nigeria-admin-map.json','utf8'));malformed.states[0].path='Z';
 await page.route('**/nigeria-admin-map.json',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(malformed)}));
 await nav('Learner map');await page.getByRole('alert').filter({hasText:'Map data failed validation'}).waitFor();
 assert.equal(await button('Open learner: Map Registration Learner').count(),1);assert.equal(await page.locator('.cd-nigeria-map').count(),0);
 await audit('connected-map-malformed');await page.unroute('**/nigeria-admin-map.json');await button('Retry loading map').click();await country();
 await nav('Overview');await page.route('**/nigeria-admin-map.json',route=>route.abort());await nav('Learner map');
 await page.getByRole('alert').filter({hasText:'Learner records remain available below'}).waitFor();await audit('connected-map-offline');
 assert.equal(await button('Open learner: Map Registration Learner').count(),1);
 await page.unroute('**/nigeria-admin-map.json');await button('Retry loading map').click();await country();
 assert.equal(await raw(),afterStateChange);assert.equal(await page.evaluate(()=>sessionStorage.getItem('mosaic-user-demo-v1')),legacyBefore);
 assert.deepEqual(errors,[]);assert.deepEqual(posts,[]);
 await writeFile('output/playwright/connected-map-results.json',JSON.stringify({audits,errors,posts,currentRegistrationsMapped:true,stateUpdatesPersist:true,lgasAreReferenceOnly:true,roleGuard:true,recordsPreserved:true},null,2));
 console.log(`Connected learner map passed: ${audits.length} clean accessibility audits; current registration/state updates, sample scopes, record links, keyboard/LGA boundaries, mobile/200%, reload, malformed/offline retry and preserved records; zero errors/POST.`);
}catch(error){await page.screenshot({path:'output/playwright/connected-map-failure.png',fullPage:true}).catch(()=>{});console.error((await page.locator('body').innerText()).slice(-9000));throw error;}finally{await browser.close();}
