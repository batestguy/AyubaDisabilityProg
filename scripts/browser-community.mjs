import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { connectedView } from '../output/tests/src/connectedDemo.js';

await mkdir('output/playwright',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1050}});
const page=await context.newPage(),errors=[],posts=[],audits=[];
const target=process.env.CONNECTED_URL||'http://127.0.0.1:5173/';
if(process.env.CONNECTED_CSP){
 const headers=await readFile('public/_headers','utf8');const csp=headers.split('\n').find(l=>l.includes('Content-Security-Policy:')).split('Content-Security-Policy:')[1].trim();
 await page.route(`${new URL(target).origin}/`,async route=>{const response=await route.fetch();await route.fulfill({response,headers:{...response.headers(),'content-security-policy':csp}});});
}
page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.method()==='POST')posts.push(r.url());});
const button=name=>page.getByRole('button',{name,exact:true});
const nav=async name=>page.getByRole('navigation',{name:'Connected workspace',exact:true}).getByRole('button',{name,exact:name!=='Messages'}).click();
async function open(){await button('Learning Sandbox').click();}
async function signIn(username,code){if(await button('Sign out').count())await signOut();const person=connectedView(await stored()).people.find(p=>p.username===username);const role=person.role==='admin'?'Administration':person.role==='facilitator'?'Facilitator':'Learner';await button(`Use ${role} interface`).click();await page.getByLabel('Username',{exact:true}).fill(username);await page.getByLabel('Demo access code',{exact:true}).fill(code);await button('Sign in').click();await button('Sign out').waitFor();}
async function signOut(){await button('Sign out').click();await page.getByRole('heading',{name:'How would you like to sign in?',exact:true}).waitFor();}
async function audit(name){const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();audits.push({name,violations:result.violations});assert.deepEqual(result.violations,[],name);}
const stored=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('mosaic-connected-v1')));
const requestCard=()=>page.locator('.cd-card').filter({has:page.getByRole('heading',{name:'Funding demo learner · Digital Essentials',exact:true})});
const noticeCard=()=>page.locator('.cd-card').filter({has:page.getByRole('heading',{name:'Sample learning discussion',exact:true})});
async function moderate(card,action,reason){const summary=card.getByText('Moderate notice',{exact:true});if(!await summary.evaluate(el=>el.parentElement.open))await summary.click();const controls=summary.locator('..');await controls.getByLabel('Moderation action').selectOption(action);await controls.getByLabel('Moderation reason').fill(reason);await controls.getByRole('button',{name:'Save moderation',exact:true}).click();}
try{
 await page.goto(target);await open();
 assert.equal(await page.getByRole('heading',{name:'Find a facilitator',exact:true}).count(),0);
 assert.equal(await page.getByLabel('Username',{exact:true}).count(),0);
 await button('Use Learner interface').click();await button('Register as a learner').click();
 await page.getByLabel('Display name',{exact:true}).fill('Funding demo learner');await page.getByLabel('Choose a username').fill('funding-learner');
 await page.getByLabel('Home state',{exact:true}).selectOption('Plateau');await button('Create sample profile').click();
 await page.getByRole('status').filter({hasText:'Your sample profile is ready.'}).waitFor();
 let state=await stored();const registered=state.events.find(e=>e.type==='register'&&e.payload.username==='funding-learner');
 assert.equal(state.events.some(e=>e.type==='request-facilitator'),false);
 await signIn('funding-learner',registered.payload.demoCode);await nav('Find a facilitator');
 await page.getByRole('heading',{name:'Find a facilitator',exact:true,level:2}).waitFor();
 assert.equal(await page.getByRole('combobox',{name:'State noticeboard',exact:true}).count(),0);
 await page.getByLabel('Search facilitator name').fill('Nobody');await page.getByText('No matching approved facilitator',{exact:false}).waitFor();await page.getByLabel('Search facilitator name').fill('');
 await audit('community-learner-directory');await page.setViewportSize({width:390,height:844});await page.evaluate(()=>document.documentElement.style.fontSize='200%');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await audit('community-directory-enlarged-text');await page.evaluate(()=>document.documentElement.style.fontSize='');await page.setViewportSize({width:1440,height:1050});
 await button('Request Amaka Obi for Digital Essentials').click();
 await page.getByRole('region',{name:'Selected facilitator'}).waitFor();assert.equal(await page.evaluate(()=>document.activeElement.id),'cd-choice');
 await button('Confirm facilitator request').click();await nav('Find a facilitator');
 await requestCard().getByText('Awaiting Administration',{exact:true}).waitFor();await audit('community-learner-request');
 await page.screenshot({path:'output/playwright/community-learner-request.png',fullPage:true});
 await signOut();await signIn('admin','DEMO-ADMIN');
 await page.getByRole('heading',{name:'Administration action queue'}).waitFor();await audit('community-admin-home');
 await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:'output/playwright/community-admin-home.png',fullPage:true});
 await nav('Facilitator requests');await requestCard().getByLabel('Decision explanation').fill('Sample preferred facilitator confirmed for digital learning.');await requestCard().getByRole('button',{name:'Save request decision'}).click();await requestCard().getByText('Assignment confirmed',{exact:true}).waitFor();await audit('community-admin-matching');
 await signOut();await signIn('funding-learner',registered.payload.demoCode);await nav('My learning');
 const digital=page.locator('.cd-card').filter({has:page.getByRole('heading',{name:'Digital Essentials',exact:true,level:3})});
 await digital.locator('summary').filter({hasText:'Study Digital Essentials'}).click();await digital.getByLabel('Digital Essentials practical submission').fill('Sample practical work to demonstrate the facilitator handoff.');await digital.getByRole('button',{name:'Submit practical work',exact:true}).click();
 await nav('Support');await page.getByLabel('Support note shared with Administration').fill('Sample request for an accessible learning format.');await button('Share support note').click();
 await signOut();await signIn('admin','DEMO-ADMIN');await nav('Learners');
 const learnerWork=page.locator('.cd-card').filter({has:page.getByRole('heading',{name:'Funding demo learner',exact:true,level:3})});
 await learnerWork.getByLabel('Assign facilitator for Funding demo learner',{exact:false}).selectOption('amaka');await learnerWork.getByLabel('Assignment note').fill('Sample current revision assigned for feedback.');await learnerWork.getByRole('button',{name:'Assign current revision'}).click();
 await nav('Support');await page.getByLabel('Administration response for Funding demo learner').fill('Sample response: discuss the preferred format with your facilitator; delivery is not recorded.');await button('Send support response').click();
 await signOut();await signIn('amaka','DEMO-AMAKA');await nav('Learners');
 await learnerWork.getByLabel('Review Funding demo learner',{exact:false}).selectOption('needs-changes');await learnerWork.getByLabel('Review note',{exact:true}).fill('Sample feedback: explain your filename and backup choice.');await learnerWork.getByRole('button',{name:'Save review',exact:true}).click();
 await nav('Messages');await page.getByLabel('Conversation recipient').selectOption(`person-${registered.id}`);await page.getByLabel('Conversation course').selectOption('digital-essentials');await button('Open selected conversation').click();await page.getByLabel('Message to Funding demo learner').fill('Sample message: your feedback is ready.');await button('Send message').click();
 await nav('State noticeboards');assert.equal(await page.getByLabel('State noticeboard',{exact:true}).locator('option').count(),38);await page.getByLabel('State noticeboard',{exact:true}).selectOption('Plateau');
 await page.getByText('Publish a notice in Plateau',{exact:true}).click();await page.getByLabel('Notice title').fill('Sample learning discussion');await page.getByLabel('Notice text').fill('Fictional community discussion for demonstration only.');await button('Publish notice').click();await noticeCard().waitFor();await audit('community-facilitator-board');
 await signOut();await signIn('funding-learner',registered.payload.demoCode);
 await page.getByText('Amaka Obi requested changes',{exact:false}).waitFor();await nav('Support');await page.getByText('Sample response: discuss',{exact:false}).waitFor();
 await nav('Messages');await page.locator('.cd-chat-list button').filter({hasText:'Amaka Obi'}).first().click();await page.getByText('Sample message: your feedback is ready.',{exact:true}).waitFor();
 await nav('State noticeboards');assert.equal(await page.getByLabel('State noticeboard',{exact:true}).inputValue(),'Plateau');await noticeCard().getByText('Unread activity',{exact:true}).waitFor();
 await noticeCard().getByRole('button',{name:'Mark notice as read'}).click();assert.equal(await noticeCard().getByText('Unread activity',{exact:true}).count(),0);
 await noticeCard().getByLabel('Reply to Sample learning discussion').fill('Sample learner reply about accessible formats.');await noticeCard().getByRole('button',{name:'Publish reply'}).click();await audit('community-learner-board');
 await page.setViewportSize({width:390,height:844});await audit('community-mobile-board');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:'output/playwright/community-mobile-board.png',fullPage:true});
 await page.evaluate(()=>document.documentElement.style.fontSize='200%');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await audit('community-enlarged-text');await page.evaluate(()=>document.documentElement.style.fontSize='');await page.setViewportSize({width:1440,height:1050});
 await signOut();await signIn('admin','DEMO-ADMIN');await nav('State noticeboards');await page.getByLabel('State noticeboard',{exact:true}).selectOption('Plateau');
 await moderate(noticeCard(),'close','Sample discussion paused.');await noticeCard().getByText('Discussion closed',{exact:true}).waitFor();assert.equal(await noticeCard().getByRole('button',{name:'Publish reply'}).count(),0);
 await moderate(noticeCard(),'hide','Sample hidden for moderator review.');assert.equal(await page.locator('.cd-main').getByText('Fictional community discussion for demonstration only.',{exact:true}).isVisible().catch(()=>false),false);
 await page.getByText('Administration moderation records',{exact:true}).click();await page.getByText('Fictional community discussion for demonstration only.',{exact:true}).waitFor();await page.getByText('Sample learner reply about accessible formats.',{exact:true}).waitFor();await audit('community-admin-moderation');
 await signOut();await signIn('funding-learner',registered.payload.demoCode);await nav('State noticeboards');assert.equal(await page.getByText('Sample learning discussion',{exact:true}).count(),0);assert.equal(await page.getByText('Sample hidden for moderator review.',{exact:true}).count(),0);assert.equal(await page.getByText('Sample learner reply about accessible formats.',{exact:true}).count(),0);
 await signOut();await signIn('amaka','DEMO-AMAKA');await nav('Teaching profile');await page.getByLabel('Public introduction',{exact:true}).fill('Updated fictional public introduction for review.');await page.getByRole('checkbox',{name:'I agree to publish',exact:false}).check();await button('Submit public introduction').click();
 await signOut();await signIn('funding-learner',registered.payload.demoCode);await nav('Find a facilitator');assert.equal(await page.getByText('Updated fictional public introduction for review.',{exact:true}).count(),0);await signOut();
 await signIn('admin','DEMO-ADMIN');await nav('Facilitators');await page.getByLabel('Public profile review note').fill('Sample public wording reviewed.');await button('Save public profile decision').click();
 await signOut();await signIn('funding-learner',registered.payload.demoCode);await nav('Find a facilitator');await page.getByText('Updated fictional public introduction for review.',{exact:true}).waitFor();await signOut();await signIn('amaka','DEMO-AMAKA');await nav('Teaching profile');await button('Withdraw publication consent').click();await signOut();await signIn('funding-learner',registered.payload.demoCode);await nav('Find a facilitator');assert.equal(await page.getByRole('button',{name:'Request Amaka Obi for Digital Essentials',exact:true}).count(),0);await signOut();
 await button('Use Facilitator interface').click();await button('Register as a facilitator').click();await page.getByLabel('Display name',{exact:true}).fill('Fictional directory teacher');await page.getByLabel('Choose a username').fill('directory-teacher');await page.getByLabel('Home state',{exact:true}).selectOption('FCT');await page.getByLabel('Teaching biography').fill('Fictional digital teaching experience for this demonstration.');await page.getByRole('checkbox',{name:'Digital Essentials',exact:true}).check();await page.getByLabel('Public introduction (optional)').fill('Fictional public introduction supplied at registration.');await page.getByRole('checkbox',{name:'I agree to publication',exact:false}).check();await button('Create sample profile').click();await page.getByRole('status').filter({hasText:'Your sample profile is ready.'}).waitFor();assert.equal(await button('Request Fictional directory teacher for Digital Essentials').count(),0);
 await signIn('admin','DEMO-ADMIN');await nav('Facilitators');await page.getByLabel('Public profile review note').fill('Sample introduction approved.');await button('Save public profile decision').click();const teacher=page.locator('.cd-card').filter({has:page.getByRole('heading',{name:'Fictional directory teacher',level:3,exact:true})});await teacher.getByLabel('Review note',{exact:true}).fill('Sample teaching evidence approved.');await teacher.getByRole('button',{name:'Save review',exact:true}).click();await signOut();await signIn('funding-learner',registered.payload.demoCode);await nav('Find a facilitator');await button('Request Fictional directory teacher for Digital Essentials').waitFor();await audit('community-registration-publication');
 const before=await stored();await page.reload();await open();const after=await stored();assert.deepEqual(after,before);await signIn('funding-learner',registered.payload.demoCode);await nav('Find a facilitator');await button('Request Fictional directory teacher for Digital Essentials').waitFor();assert.equal(await page.getByRole('button',{name:'Request Amaka Obi for Digital Essentials',exact:true}).count(),0);
 assert.deepEqual(errors,[]);assert.deepEqual(posts,[]);
 await writeFile('output/playwright/community-results.json',JSON.stringify({audits,errors,posts,events:after.events.length,productionCsp:!!process.env.CONNECTED_CSP},null,2));
 console.log(`Community journey passed: ${audits.length} accessibility audits, zero page errors/POST; matching, teaching feedback, support, boards, moderation, public consent, mobile and reload.`);
}catch(error){await page.screenshot({path:'output/playwright/community-failure.png',fullPage:true});console.error((await page.locator('body').innerText()).slice(-9000));throw error;}finally{await browser.close();}
