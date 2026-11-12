// Recording-only stage. The production files and owner's browser profiles are never modified.
import { chromium } from 'playwright';
import { mkdir, writeFile, appendFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const rehearse = process.argv.includes('--rehearse');
const profiles = process.argv.includes('--profiles');
const closing = profiles || process.argv.includes('--closing');
const out = 'output/playwright/laptop-walkthrough'+(profiles?'/profiles':'');
await mkdir(out, {recursive:true});
const browser = await chromium.launch({channel:'chrome',headless:true});
const context = await browser.newContext({viewport:{width:1600,height:900},deviceScaleFactor:1,...(!rehearse?{recordVideo:{dir:`${out}/raw`,size:{width:1600,height:900}}}:{})});
const page = await context.newPage();
const errors=[]; page.on('pageerror',e=>errors.push(e.message));
const base='http://127.0.0.1:4188';
// The normal anti-embedding headers remain intact on the server. Only the private
// recording context permits the extra same-origin caption-stage frame.
await context.route(`${base}/**`,async route=>{const response=await route.fetch();const headers={...response.headers()};delete headers['x-frame-options'];if(headers['content-security-policy'])headers['content-security-policy']=headers['content-security-policy'].replace(/frame-ancestors [^;]+/g,"frame-ancestors 'self'");await route.fulfill({response,headers});});
await page.route(`${base}/__walkthrough`, route=>route.fulfill({contentType:'text/html',body:`<!doctype html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box}body{margin:0;background:#102b29;color:#fff;font-family:Arial,sans-serif}iframe{width:1600px;height:790px;border:0;background:white;display:block}#band{height:110px;display:flex;align-items:center;justify-content:center;padding:12px 140px;border-top:3px solid #d9b876}#caption{font-size:29px;line-height:1.3;text-align:center;max-width:1260px;text-wrap:balance}#chapter{position:absolute;bottom:9px;left:16px;font-size:11px;letter-spacing:1px;color:#c7d5cd}#intro{position:absolute;inset:0 0 110px;background:#102b29;display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:50px;padding:90px}#intro img{width:100%;height:560px;object-fit:contain}#intro h1{font-size:76px;line-height:1.02;letter-spacing:-3px;color:#f3dbab;margin:0 0 24px}#intro p{font-size:28px;line-height:1.5}#intro small{font-size:18px;color:#c7d5cd}#pointer{position:absolute;top:360px;left:1100px;width:23px;height:29px;pointer-events:none;z-index:99999;filter:drop-shadow(1px 2px 2px #0008);transition:left .18s,top .18s}#ring{position:absolute;width:44px;height:44px;border:3px solid #e6a63c;border-radius:50%;transform:translate(-14px,-12px);opacity:0;pointer-events:none;z-index:99998}#ring.hit{animation:hit .65s ease-out}@keyframes hit{0%{opacity:1;scale:.6}100%{opacity:0;scale:1.5}}</style></head><body><iframe name="site" allow="fullscreen 'none'" src="/"></iframe><div id="intro"><div><small>IMPACT MOSAIC · LAPTOP WALKTHROUGH</small><h1>Impact<br>Mosaic.</h1><p>A vision for inclusive opportunity</p><p>A guided tour of the research proposal and Learning Sandbox.</p><small>An independent proposal · Fictional sample records</small></div><img src="/impact-mosaic-unity-haircuts.png" alt="Existing Impact Mosaic artwork"></div><div id="band"><div id="caption"></div></div><span id="chapter"></span><div id="ring"></div><svg id="pointer" viewBox="0 0 24 30"><path d="M2 2L2 25L8 19L13 29L18 26L13 17L22 17Z" fill="white" stroke="#152c29" stroke-width="2"/></svg></body></html>`}));
// Keep public-document links inside the recording stage; this affects only this isolated context.
await context.addInitScript(()=>{document.addEventListener('click',e=>{const a=e.target.closest?.('a');if(a&&['_top','_blank'].includes(a.target)&&new URL(a.href,location.href).origin===location.origin){e.preventDefault();window.top.document.querySelector('iframe[name="site"]').src=a.href;}},true);});
await page.goto(`${base}/__walkthrough`);
let site=await (await page.locator('iframe[name="site"]').elementHandle()).contentFrame();
await site.getByRole('button',{name:'Research',exact:true}).waitFor();
await page.locator('#intro img').evaluate(async e=>{await e.decode();});
const btn=(name,root=site)=>root.getByRole('button',{name,exact:true});
const label=(name,root=site)=>root.getByLabel(name,{exact:true});
const wait=ms=>new Promise(r=>setTimeout(r,rehearse?Math.min(ms,180):ms));
async function point(loc){await loc.scrollIntoViewIfNeeded();await wait(250);const b=await loc.boundingBox();assert(b,'Target has visible bounds');const x=Math.max(8,Math.min(1590,b.x+b.width*.5)),y=Math.max(8,Math.min(780,b.y+b.height*.5));await page.mouse.move(x,y,{steps:rehearse?1:12});await page.evaluate(({x,y})=>{for(const id of ['pointer','ring']){const e=document.getElementById(id);e.style.left=x+'px';e.style.top=y+'px';}},{x,y});await wait(330);}
async function click(loc){await point(loc);await page.evaluate(()=>{const e=document.getElementById('ring');e.classList.remove('hit');void e.offsetWidth;e.classList.add('hit');});await loc.click();await wait(300);}
async function fill(loc,text){await point(loc);await loc.fill(text);await wait(350);}
async function select(loc,value){await point(loc);await loc.selectOption(value);await wait(350);}
async function show(loc){await loc.evaluate(e=>e.scrollIntoView({behavior:'smooth',block:'center'}));await wait(800);}
async function creators(){await site.locator('.about-creators').evaluate(e=>e.scrollIntoView({behavior:'smooth',block:'start'}));await wait(800);}
async function scroll(amount=420){await page.mouse.move(1400,650);await page.mouse.wheel(0,amount);await wait(800);}
async function top(){await site.evaluate(()=>scrollTo({top:0,behavior:'smooth'}));await wait(700);}
async function main(name){await click(btn(name));await top();}
const nav=async name=>{await click(site.getByRole('navigation',{name:'Connected workspace',exact:true}).getByRole('button',{name:name==='Messages'?/^Messages/:name,exact:name!=='Messages'}));await show(site.locator('.cd-main'));};
const card=(name)=>site.locator('.cd-card').filter({has:site.getByRole('heading',{name,exact:true})}).first();
async function signIn(role){await click(btn(`Use ${role} interface`));await click(btn('Sign in'));await btn('Sign out').waitFor();await top();}
async function signOut(){await click(btn('Sign out'));}
const deck=()=>site.frameLocator('#research-deck');
async function slide(n){await click(deck().locator('#menu-trigger'));await select(deck().locator('#slide-selector'),String(n-1));if(await deck().locator('#deck-menu').isVisible())await click(deck().getByRole('button',{name:'Close menu',exact:true}));await wait(400);assert.equal(await deck().locator('.slides>section.present').getAttribute('id'),`research-slide-${n}`);}
async function chat(person){await click(site.getByRole('button',{name:new RegExp(`^Open conversation with ${person}.*Digital Essentials`)}));}
const chapters=[]; let chapter;
function ch(name,start,end){chapter={name,start,end,steps:[]};chapters.push(chapter);}
function step(seconds,text,action=async()=>{}){chapter.steps.push({seconds,text,action});}
ch('Introduction',0,30);
step(15,'Welcome to Impact Mosaic: connecting people, evidence and accessible learning through a proposed pathway for inclusion.');
step(15,'This independent proposal includes a Learning Sandbox. People and activity in the sandbox are fictional examples.');
ch('Home',30,120);
step(10,'The home page honours Chief Ayuba Gufwan and introduces documented work on disability inclusion across Nigeria.',async()=>{await page.locator('#intro').evaluate(e=>e.remove());await top();});
step(10,'Published accounts connect leadership with practical work, while photographs retain their captions and source links.',async()=>show(site.locator('#leadership')));
step(10,'Contribution chapters describe people, partners and places. Open a photograph to see its full frame and source.',async()=>{await show(site.locator('#mobility'));await click(site.locator('.scene-layer.is-active .gallery-open'));});
step(10,'Photographs support the story, with credit to the organisation that published each image.',async()=>{await click(btn('Close photograph'));await click(site.locator('#mobility summary'));});
step(10,'Evidence disclosures distinguish reported activities from plans and explain the limits of each account.',async()=>show(site.locator('#mobility details')));
step(10,'Livelihoods and education chapters connect inclusion with opportunities to work, learn and develop skills.',async()=>show(site.locator('#livelihoods')));
step(10,'Other chapters cover civic participation, communities, access, health and institutional partnerships.',async()=>show(site.locator('#education')));
step(10,'The timeline keeps dates, reported milestones and evidence caveats together for easier comparison.',async()=>show(site.locator('#milestones')));
step(10,'Selecting another milestone changes the account and its source, helping readers follow the sequence of work.',async()=>{await click(btn('Next event'));await show(site.locator('#selected-event'));});
ch('Research presentation',120,375);
step(15,'The research presentation proposes a pathway from community connections to reliable records, suitable teaching and responsive support.',async()=>main('Research'));
step(12,'The contents group eight slides into four sections, so readers can move directly to a part of the proposal.',async()=>{await slide(2);await click(deck().locator('.contents-section summary').nth(0));});
step(12,'Opening another contents section reveals its slide links and shows how recruitment connects with participant records.',async()=>click(deck().locator('.contents-section summary').nth(2)));
step(20,'The opportunity is to build on existing inclusion work and connect people with learning suited to their needs.',async()=>slide(3));
step(20,'Skills, interests and learning preferences would guide suitable teaching. Participation and accessibility would be agreed with partners.');
step(20,'The adaptive cycle links recruitment, a participant database, teaching, progress monitoring and feedback into one continuing process.',async()=>slide(4));
step(15,'Each stage has an explanation. Trusted relationships help invite participants, while consent and coverage checks shape responsible recruitment.',async()=>click(deck().locator('.present [data-explanation="step-0"]')));
step(12,'The database connects these stages, so evidence can guide the next decision instead of remaining separate from teaching.',async()=>click(deck().locator('#explanation-dialog [data-close]')));
step(15,'Recruitment begins with trusted contacts, expands through invitations and checks which groups remain missing.',async()=>slide(5));
step(15,'Recruitment evidence guides outreach. Repeated referrals may miss less connected people, so additional contacts and offline routes may be needed.');
step(15,'The Bayesian explanation describes updating expectations as evidence arrives. It is a proposed approach, without measured participant results.',async()=>click(deck().locator('.present [data-explanation="bayesian"]')));
step(12,'The explanation also defines its symbols. Any future model would need agreed assumptions, suitable data and careful validation.',async()=>click(deck().locator('#explanation-symbols summary')));
step(10,'Close the explanation to return to the recruitment diagram and its distinction between outreach and learning evidence.',async()=>click(deck().locator('#explanation-dialog [data-close]')));
step(15,'The participant database would bring learner needs and facilitator skills together to support suitable learning arrangements.',async()=>slide(6));
step(15,'Records would guide teaching, identify support needs and help people plan together. This diagram describes a proposed system.');
step(15,'A completed cycle supplies progress evidence and participant feedback, informing the next round of recruitment, learning and support.',async()=>slide(7));
step(15,'Learning progress guides teaching and support. Feedback helps revise the next cycle; no real programme outcomes are claimed here.');
step(12,'The closing slide presents the shared vision: learners, facilitators, partners and evidence contributing to success together.',async()=>slide(8));
ch('Research details',375,435);
step(12,'The detailed proposal provides a reading version, practical study planning and a printable brief for discussion with partners.',async()=>{await click(deck().locator('#menu-trigger'));await click(deck().getByRole('link',{name:'Detailed Research proposal',exact:true}));await site.getByRole('heading',{name:'Research & Data Collection.',exact:true}).waitFor();await top();});
step(12,'Registration is voluntary and separate from research participation. A learning register does not automatically become a representative national sample.',async()=>show(site.locator('.sampling-outline')));
step(12,'The sampling table explains coverage, recruitment, study size, selection and estimation, with provisional time frames and readiness conditions.',async()=>show(site.getByRole('region',{name:'Sampling methods and pilot time frames'})));
step(12,'The printable discussion brief brings the proposal into a format partners can read, print and use to agree the pilot.',async()=>{await click(site.getByRole('link',{name:/Discussion Brief/}).first());await site.getByRole('heading',{name:'Pilot Discussion Brief',exact:true}).waitFor();await top();});
step(12,'Locations, participant numbers and courses would be agreed during scoping. The brief sets discussion points rather than fixed commitments.',async()=>scroll(570));
ch('Learning Sandbox roles',435,555);
step(10,'The Learning Sandbox describes how three roles connect: Administration, facilitators and learners, each with responsibilities to the others.',async()=>{await site.goto(`${base}/?page=explore`);await top();});
step(10,'Administration monitors the whole pathway. The diagram links its coordination work with teaching, practical learning and shared support.',async()=>show(site.locator('.roles-network')));
step(10,'Administration approves teaching and public profiles, matches learners with suitable facilitators, and assigns practical work for review.',async()=>show(site.locator('[data-role-node="admin"]')));
step(10,'It follows progress and location records, answers support needs and coordinates noticeboards. Private teaching conversations remain with their participants.');
step(10,'Facilitators register their skills and background, teach approved subjects, and give practical feedback to learners assigned to them.',async()=>show(site.locator('[data-role-node="facilitators"]')));
step(10,'They can propose topics and share support needs with Administration. Public directory introductions require consent and review.');
step(10,'Learners describe their goals, skills and access needs, then choose a direction and study at their own pace.',async()=>show(site.locator('[data-role-node="learners"]')));
step(10,'Lessons, quizzes and practical tasks support learning. Learners can request a facilitator, ask questions privately and share support notes.');
step(10,'The links explain the handoffs: learners and facilitators work together, while Administration confirms arrangements and coordinates shared support.',async()=>show(site.locator('.roles-link-facilitators-learners')));
step(10,'Six monitoring steps connect registration, approval and matching with learning, practice, support and outcomes.',async()=>show(site.locator('.roles-monitoring')));
step(10,'The page describes the broader intended pathway. Some listed tools belong to earlier demonstrations rather than the current role screens.');
step(10,'Sample roles can be explored from this page. The sandbox uses fictional records in this browser, rather than measured programme outcomes.',async()=>show(site.getByRole('heading',{name:'How would you like to sign in?',exact:true})));
ch('About',555,600);
step(10,'Impact Mosaic was co-created by Jerry Bannister Zachary and Yusuf Strong Mashat, combining statistical work, research and teaching experience.',async()=>{await main('About');await creators();});
step(11,'Their profiles describe contributions to data science, sampling design, data quality and evaluation for the proposed pathway.',async()=>show(site.locator('.about-overview')));
step(12,'The contact section provides direct ways to discuss the proposal, agree responsibilities and explore a suitable pilot with the co-creators.',async()=>{await show(site.locator('.about-contact'));await wait(6000);await creators();await page.evaluate(()=>{document.getElementById('pointer').style.opacity='0';});});
step(12,'Thank you for exploring Impact Mosaic: connecting people, evidence and accessible learning, with an invitation to build the next steps together.');
if(profiles){
 const about=chapters.find(c=>c.name==='About');about.steps=[];chapter=about;about.end=675;
 const bios=()=>site.locator('.about-creator > div').first();
 async function biographyTop(){await bios().evaluate(e=>scrollTo({top:e.getBoundingClientRect().top+scrollY-24,behavior:'smooth'}));await wait(1000);}
 async function biographyLower(){await bios().evaluate(e=>scrollTo({top:e.getBoundingClientRect().top+scrollY+300,behavior:'smooth'}));await wait(1000);}
 step(12,'Jerry Bannister Zachary and Yusuf Strong Mashat created Impact Mosaic together and have co-authored a research paper.',async()=>{await main('About');await creators();});
 step(18,'Jerry’s profile describes his work at ATBU, academic achievements, scholarship, professional membership, published research and statistical consultancy.',async()=>biographyTop());
 step(18,'Alongside Jerry’s profile, Strong describes his teaching appointments, Statistics degrees, doctoral study and PTDF scholarship.');
 step(18,'Jerry’s remaining profile explains his disability rights research and links to his publications, projects and interest in chess.',async()=>biographyLower());
 step(18,'Strong’s remaining profile covers professional memberships, teaching subjects, census fieldwork, research publications and family life.');
 step(12,'Their proposed contributions connect recruitment design, data quality, coverage monitoring and evaluation with accessible teaching and practical support.',async()=>show(site.locator('.about-overview')));
 step(12,'Both co-creators provide email addresses and phone numbers, so readers can discuss the proposal and possible collaboration directly.',async()=>show(site.locator('.about-contact')));
 step(12,'Thank you for exploring Impact Mosaic. Jerry and Strong invite discussion about connecting reliable evidence with accessible teaching and practical support.',async()=>{await creators();await page.evaluate(()=>{document.getElementById('pointer').style.opacity='0';});});
}
// Ten-minute revision: role descriptions replace the detailed account tours.
// Durations are normalized within each chapter, preserving exact requested chapter boundaries.
const kind=closing?'closing':rehearse?'rehearsal':'recording';
if(closing)await page.locator('#intro').evaluate(e=>e.remove());
const cues=[];let origin=Date.now();
await writeFile(`${out}/${kind}-progress.log`,'');
if(profiles)await writeFile(`${out}/paragraph-coverage.jsonl`,'');
try {
 for(const c of chapters){
  if(closing&&c.name!=='About')continue;
  const weight=c.steps.reduce((s,x)=>s+x.seconds,0);let local=0;
  for(let i=0;i<c.steps.length;i++){
   const s=c.steps[i],start=c.start+local-(closing?555:0), duration=(c.end-c.start)*s.seconds/weight;local+=duration;
   await page.evaluate(({text,name})=>{document.getElementById('caption').textContent=text;document.getElementById('chapter').textContent=name.toUpperCase();},{text:s.text,name:c.name});
   console.log(`${rehearse?'REHEARSE':'RECORD'} ${start.toFixed(2)} ${c.name} ${i+1}/${c.steps.length}`);
   await s.action();await wait(400);
   await page.mouse.move(1555,750,{steps:rehearse?1:10});
   await page.evaluate(()=>{const e=document.getElementById('pointer');e.style.left='1555px';e.style.top='750px';});
   if(rehearse || profiles || i===0 || i===c.steps.length-1)await page.screenshot({path:`${out}/${rehearse?'rehearsal':'frame'}-${c.name.replaceAll(' ','-')}-${i+1}.jpg`,quality:87});
   if(profiles){const visible=await site.locator('.about-creator').evaluateAll(nodes=>nodes.flatMap(n=>[...n.querySelectorAll('div > p:not(.about-creator-role)')].flatMap((p,index)=>{const r=p.getBoundingClientRect();return r.top>=0&&r.bottom<=790?[{id:n.getAttribute('aria-labelledby'),index,text:p.innerText}]:[]})));await appendFile(`${out}/paragraph-coverage.jsonl`,JSON.stringify({step:i+1,visible})+'\n');}
   cues.push({start,end:start+duration,text:s.text,chapter:c.name});
   await appendFile(`${out}/${kind}-progress.log`,JSON.stringify(cues.at(-1))+'\n');
   if(!rehearse){const remaining=origin+(start+duration)*1000-Date.now();assert(remaining>0,`Action exceeds scheduled duration: ${c.name} ${i+1}`);await new Promise(r=>setTimeout(r,remaining));}
  }
 }
 assert.deepEqual(errors,[]);
 const state=await site.evaluate(()=>JSON.parse(localStorage.getItem('mosaic-connected-v1')));
 await writeFile(`${out}/${kind}-state.json`,JSON.stringify(state,null,2));
 const ts=t=>{const ms=Math.round(t*1000);return `${String(Math.floor(ms/3600000)).padStart(2,'0')}:${String(Math.floor(ms/60000)%60).padStart(2,'0')}:${String(Math.floor(ms/1000)%60).padStart(2,'0')},${String(ms%1000).padStart(3,'0')}`;};
 if(!rehearse){await writeFile(`${out}/${closing?'closing':'Impact-Mosaic-Laptop-Walkthrough.en'}.srt`,cues.map((s,i)=>`${i+1}\n${ts(s.start)} --> ${ts(s.end)}\n${s.text}\n`).join('\n'));await writeFile(`${out}/${closing?'closing-':''}timeline.json`,JSON.stringify({chapters:chapters.map(({steps,...c})=>c),cues},null,2));}
 await writeFile(`${out}/${kind}-result.json`,JSON.stringify({ok:true,errors,elapsed:(Date.now()-origin)/1000,steps:cues.length,chapters:closing?1:chapters.length},null,2));
}catch(e){await page.screenshot({path:`${out}/failure.png`});await writeFile(`${out}/failure.txt`,String(e.stack)+'\n'+await site.locator('body').innerText());throw e;}
finally{const video=page.video();await context.close();if(video)await writeFile(`${out}/${closing?'closing-':''}raw-video-path.txt`,await video.path());await browser.close();}
