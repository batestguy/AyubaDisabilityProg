import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { freshSharedDemo, updateSharedDemo } from '../output/tests/src/sharedDemo.js';
import { fresh as freshSandbox } from '../output/tests/src/store.js';
import { courses } from '../output/tests/src/catalogue.js';
import { commandConnected } from '../output/tests/src/connectedDemo.js';

await mkdir('output/playwright', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1050 } });
const original = freshSharedDemo();
const legacy = updateSharedDemo(original, { ...original.user, profile: { ...original.user.profile, name: 'Preserved earlier learner' } });
await context.addInitScript(({ shared, sandbox }) => { if (!sessionStorage.getItem('connected-test-started')) { sessionStorage.setItem('mosaic-user-demo-v1', shared); sessionStorage.setItem('mosaic-v1', sandbox); sessionStorage.setItem('connected-test-started', '1'); } }, { shared: JSON.stringify(legacy), sandbox: JSON.stringify(freshSandbox()) });
const page = await context.newPage(), errors = [], posts = [], audits = [];
const target = process.env.CONNECTED_URL || 'http://127.0.0.1:5173/';
if (process.env.CONNECTED_CSP) {
 const headers = await readFile('public/_headers','utf8'); const csp = headers.split('\n').find(l=>l.includes('Content-Security-Policy:')).split('Content-Security-Policy:')[1].trim();
 await page.route(`${new URL(target).origin}/`,async route=>{const response=await route.fetch();await route.fulfill({response,headers:{...response.headers(),'content-security-policy':csp}});});
}
page.on('pageerror',e=>errors.push(e.message)); page.on('request',r=>{if(r.method()==='POST')posts.push(r.url());});
const button = name => page.getByRole('button',{name,exact:true});
async function open() { await button('Projects & Possibilities').click(); await page.getByRole('button',{name:'Open the app demo',exact:false}).click(); }
async function signIn(username, code) { await page.getByLabel('Username',{exact:true}).fill(username); await page.getByLabel('Demo access code',{exact:true}).fill(code); await button('Sign in').click(); await button('Sign out').waitFor(); }
async function signOut() { await button('Sign out').click(); await button('Sign in').waitFor(); }
async function nav(name) { await page.getByRole('navigation',{name:'Connected workspace',exact:true}).getByRole('button',{name,exact:name!=='Messages'}).click(); }
async function startChat(recipient,course) { await page.getByLabel('Conversation recipient').selectOption(recipient); if(course) await page.getByLabel('Conversation course').selectOption(course); await button('Open selected conversation').click(); }
async function audit(name) { const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();audits.push({name,violations:result.violations});assert.deepEqual(result.violations,[],name); }
const stored=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('mosaic-connected-v1')));
const cardHeading=(name,level=3)=>page.locator('.cd-card').filter({has:page.getByRole('heading',{name,exact:true,level})});
async function register(name,username,role='learner') {
 await button('Register a learner or facilitator').click(); await page.getByLabel('Sample role').selectOption(role); await page.getByLabel('Display name',{exact:true}).fill(name); await page.getByLabel('Choose a username').fill(username);
 await page.getByLabel('Learning or teaching goal').fill('Build accessible practical skills.'); await page.getByLabel('Access and learning preferences').fill('Written steps and flexible pacing.');
 if(role==='facilitator'){await page.getByLabel('Teaching biography').fill('Sample digital teaching experience with accessible text practice.');await page.getByRole('checkbox',{name:'Digital Essentials',exact:true}).check();}
 await button('Create sample profile').click(); await page.getByRole('status').filter({hasText:'Your sample profile is ready.'}).waitFor();
 const state=await stored(); return state.events.find(e=>e.type==='register'&&e.payload.username===username).payload.demoCode;
}
try {
 await page.goto(target);await open();await page.getByRole('heading',{name:'Sign in to your sample workspace'}).waitFor();
 const originalBytes=await page.evaluate(()=>sessionStorage.getItem('mosaic-user-demo-v1'));const sandboxBytes=await page.evaluate(()=>sessionStorage.getItem('mosaic-v1'));
 await page.locator('summary').filter({hasText:'Show sample sign-ins'}).click();await page.getByRole('button',{name:'Use Amaka Obi sign-in',exact:true}).waitFor();await page.getByRole('button',{name:'Use Tunde Bello sign-in',exact:true}).waitFor();await audit('connected-sign-in');
 await signIn('ada','DEMO-ADA');await nav('Messages');await page.locator('.cd-chat-list button').filter({hasText:'Amaka Obi'}).first().click();
 await page.getByLabel('Message to Amaka Obi').fill('Private teaching marker: please explain a clear filename.');await button('Send message').click();await page.getByText('Private teaching marker:',{exact:false}).waitFor();await audit('connected-learner-chat');
 await signOut();await signIn('admin','DEMO-ADMIN');await nav('Messages');assert.equal(await page.getByText('Private teaching marker:',{exact:false}).count(),0);await nav('Activity');assert.equal(await page.getByText('Private teaching marker:',{exact:false}).count(),0);await nav('Reports');await page.getByRole('heading',{name:'Operational directory'}).waitFor();assert.equal(await page.getByText('Tunde Bello',{exact:true}).count()>0,true);await audit('connected-admin-directory');
 await signOut();await signIn('amaka','DEMO-AMAKA');await nav('Messages');await page.locator('.cd-chat-list button').filter({hasText:'Ada Okafor'}).first().click();await page.getByText('Private teaching marker:',{exact:false}).waitFor();await page.getByLabel('Message to Ada Okafor').fill('Use customer-order-October.txt and keep a permitted offline copy.');await button('Send message').click();const chatLog=page.getByRole('log');await chatLog.focus();await page.keyboard.press('End');if(await chatLog.evaluate(el=>el.scrollHeight>el.clientHeight))assert.equal(await chatLog.evaluate(el=>el.scrollTop>0),true);await audit('connected-facilitator-chat');
 await nav('Learners');let ada=cardHeading('Ada Okafor');await ada.getByLabel('Review Ada Okafor',{exact:false}).selectOption('needs-changes');await ada.getByLabel('Review note',{exact:true}).fill('Explain your filename and offline backup.');await ada.getByRole('button',{name:'Save review',exact:true}).click();
 await signOut();await signIn('ada','DEMO-ADA');await nav('My learning');let digital=cardHeading('Digital Essentials');await digital.locator('summary').filter({hasText:'Study Digital Essentials'}).click();await digital.getByLabel('Digital Essentials practical submission').fill('Use customer-order-October.txt, keep an offline copy and send a safe clear mentoring message.');await digital.getByRole('button',{name:'Resubmit practical work',exact:true}).click();
 await signOut();await signIn('amaka','DEMO-AMAKA');await nav('Learners');await page.getByText('This submission needs a fresh assignment',{exact:false}).waitFor();
 await signOut();await signIn('admin','DEMO-ADMIN');await nav('Learners');ada=cardHeading('Ada Okafor');await ada.getByLabel('Assign facilitator for Ada Okafor',{exact:false}).selectOption('amaka');await ada.getByLabel('Assignment note',{exact:true}).fill('Reassign the revised evidence to Amaka.');await ada.getByRole('button',{name:'Assign current revision',exact:true}).click();
 await signOut();await signIn('amaka','DEMO-AMAKA');await nav('Learners');ada=cardHeading('Ada Okafor');await ada.getByLabel('Review note',{exact:true}).fill('Revised work meets the foundation task.');await ada.getByRole('button',{name:'Save review',exact:true}).click();await ada.getByText('6/6 lessons',{exact:false}).waitFor();
 await nav('Support');await page.getByLabel('Learner needing support').selectOption('ada');await page.getByLabel('Support note shared with Administration',{exact:true}).fill('Please coordinate an offline text pack for Ada. The private chat is not attached.');await button('Share support note').click();
 await nav('Messages');await startChat('admin');await page.getByLabel('Message to Sample administrator').fill('Please review the shared support note for my assigned learner.');await button('Send message').click();
 await signOut();await signIn('admin','DEMO-ADMIN');await nav('Support');await page.getByLabel('Administration response for Ada Okafor').fill('Plan reviewed; agree an offline learning arrangement. Delivery is not recorded.');await button('Send support response').click();await nav('Messages');await page.locator('.cd-chat-list button').filter({hasText:'Amaka Obi'}).first().click();await page.getByText('Please review the shared support note',{exact:false}).waitFor();assert.equal(await page.getByText('Private teaching marker:',{exact:false}).count(),0);
 await signOut();const judeCode=await register('Jude Example','jude-example');await signIn('admin','DEMO-ADMIN');await nav('Learners');await cardHeading('Jude Example').getByText('Awaiting course choice',{exact:true}).waitFor();await signOut();await signIn('jude-example',judeCode);await nav('My learning');digital=cardHeading('Digital Essentials');await digital.getByRole('button',{name:'Enrol in Digital Essentials',exact:true}).click();await digital.locator('summary').filter({hasText:'Study Digital Essentials'}).click();
 const course=courses.find(c=>c.id==='digital-essentials');
 for(let i=0;i<course.lessons.length;i++){const lesson=digital.locator('.cd-lesson').nth(i);await lesson.locator('summary').first().click();await lesson.getByRole('button',{name:`Mark lesson ${i+1} complete in Digital Essentials`,exact:true}).click();}
 for(let i=0;i<course.quiz.length;i++)await digital.locator('fieldset').nth(i).getByRole('radio',{name:course.quiz[i].options[course.quiz[i].answer],exact:true}).check();
 await digital.getByRole('button',{name:'Submit Digital Essentials quiz',exact:true}).click();await digital.getByText('Best quiz: 100%',{exact:false}).waitFor();await digital.getByLabel('Digital Essentials practical submission').fill('A sample plan with safe filenames, an offline copy, accessible text and a clear mentoring message.');await digital.getByRole('button',{name:'Submit practical work',exact:true}).click();await audit('connected-new-learner');
 await signOut();const folaCode=await register('Fola Example','fola-example','facilitator');await signIn('fola-example',folaCode);await page.getByRole('heading',{name:'Teaching status: pending'}).waitFor();await nav('Teaching profile');await page.getByLabel('Proposed topic title').fill('Accessible Market Records');await page.getByLabel('Topic description and learning outcome').fill('Plan a text-first record keeping foundation with accessible examples and a review rubric.');await button('Send topic for review').click();await audit('connected-pending-teacher');
 await signOut();await signIn('admin','DEMO-ADMIN');await nav('Facilitators');const fola=page.locator('.cd-card').filter({has:page.getByRole('heading',{name:'Fola Example',exact:true})});await fola.getByLabel('Review note',{exact:true}).fill('Digital teaching examples and accessible approach reviewed.');await fola.getByRole('button',{name:'Save review',exact:true}).click();
 await nav('Courses & topics');const topic=cardHeading('Accessible Market Records',4);await topic.getByLabel('Review note',{exact:true}).fill('Approved for planning; course content must be prepared before publication.');await topic.getByRole('button',{name:'Save review',exact:true}).click();
 await nav('Learners');const jude=cardHeading('Jude Example');await jude.getByLabel('Assign facilitator for Jude Example',{exact:false}).selectOption({label:'Fola Example'});await jude.getByLabel('Assignment note',{exact:true}).fill('Assign the current digital practical submission.');await jude.getByRole('button',{name:'Assign current revision',exact:true}).click();
 await signOut();await signIn('fola-example',folaCode);await nav('Learners');assert.equal(await page.getByRole('heading',{name:'Ada Okafor',exact:true}).count(),0);const judeWork=cardHeading('Jude Example');await judeWork.getByLabel('Review note',{exact:true}).fill('The evidence meets the task; lessons and quiz are also complete.');await judeWork.getByRole('button',{name:'Save review',exact:true}).click();await nav('Messages');await startChat({label:'Jude Example · Learner'},'digital-essentials');await page.getByLabel('Message to Jude Example').fill('Your practical work is approved. Keep your clear text plan as a sample.');await button('Send message').click();
 await page.setViewportSize({width:390,height:844});await audit('connected-mobile-chat');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:'output/playwright/connected-mobile-chat.png',fullPage:true});
 await page.evaluate(()=>{document.documentElement.style.fontSize='200%';});await audit('connected-enlarged');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.evaluate(()=>{document.documentElement.style.fontSize='';});await page.setViewportSize({width:1440,height:1050});
 await page.reload();await open();await signIn('jude-example',judeCode);await nav('Messages');await page.locator('.cd-chat-list button').filter({hasText:'Fola Example'}).first().click();await page.getByText('Your practical work is approved.',{exact:false}).waitFor();await nav('My learning');await cardHeading('Digital Essentials').getByText('Course complete',{exact:true}).waitFor();
 assert.equal(await page.evaluate(()=>sessionStorage.getItem('mosaic-user-demo-v1')),originalBytes);assert.equal(await page.evaluate(()=>sessionStorage.getItem('mosaic-v1')),sandboxBytes);
 await signOut();await signIn('admin','DEMO-ADMIN');await nav('Reports');await page.screenshot({path:'output/playwright/connected-admin-desktop.png',fullPage:true});
 // Set up a second current course and a reassigned old course using valid model commands.
 let pairState=await stored(); let fixtureSerial=0;
 const modelAct=(actorId,type,payload)=>{const result=commandConnected(pairState,{id:`browser-pair-${++fixtureSerial}`,expectedVersion:pairState.events.length,actorId,type,payload});assert.equal(result.error,undefined);pairState=result.state;};
 modelAct('ada','enrol',{courseId:'spreadsheet-data'});
 modelAct('admin','assign',{learnerId:'ada',courseId:'spreadsheet-data',facilitatorId:'amaka',note:'Sample second-course teaching assignment.'});
 modelAct('tunde','request-teaching',{courseIds:['retail-customer-service','digital-essentials'],bio:'Sample additional digital foundation teaching experience.'});
 modelAct('admin','review-facilitator',{personId:'tunde',outcome:'approved',note:'Additional digital scope reviewed.'});
 modelAct('admin','assign',{learnerId:'ada',courseId:'digital-essentials',facilitatorId:'tunde',note:'Move the digital teaching assignment to Tunde.'});
 await page.evaluate(value=>localStorage.setItem('mosaic-connected-v1',value),JSON.stringify(pairState));await page.reload();await open();await signIn('ada','DEMO-ADA');await nav('Messages');
 await page.getByRole('button',{name:'Open conversation with Amaka Obi — Digital Essentials',exact:true}).click();assert.equal(await button('Send message').isDisabled(),true);
 await startChat('amaka','spreadsheet-data');await page.getByLabel('Message to Amaka Obi').fill('Second-course conversation marker for spreadsheet learning.');await button('Send message').click();
 await page.getByText('Second-course conversation marker',{exact:false}).waitFor();assert.equal(await page.getByText('Private teaching marker:',{exact:false}).count(),0);
 await audit('connected-second-course-chat');await signOut();await signIn('admin','DEMO-ADMIN');
 await button('Reset connected sample workspace').click();await button('Keep workspace records').click();assert.equal((await stored()).events.some(e=>e.type==='register'),true);
 await button('Reset connected sample workspace').click();await button('Confirm reset connected workspace').click();await page.getByRole('heading',{name:'Sign in to your sample workspace'}).waitFor();assert.equal((await stored()).events.length,0);
 await page.evaluate(()=>localStorage.setItem('mosaic-connected-v1','{malformed'));await page.reload();await open();await page.getByRole('heading',{name:'Saved workspace needs attention'}).waitFor();assert.equal(await page.evaluate(()=>localStorage.getItem('mosaic-connected-v1')),'{malformed');await audit('connected-recovery');
 assert.equal(await page.evaluate(()=>sessionStorage.getItem('mosaic-user-demo-v1')),originalBytes);assert.deepEqual(errors,[]);assert.deepEqual(posts,[]);await writeFile('output/playwright/connected-axe.json',JSON.stringify(audits,null,2));
 console.log(`Connected workspace passed: ${audits.length} clean axe audits; individual sign-in, registration, teaching/topic review, study gates, private chat/read states, support, durable reload/reset/recovery, mobile/enlarged text and preserved source records; zero POST.`);
}catch(error){console.error((await page.locator('body').innerText()).slice(-10000));await page.screenshot({path:'output/playwright/connected-failure.png',fullPage:true});throw error;}finally{await browser.close();}
