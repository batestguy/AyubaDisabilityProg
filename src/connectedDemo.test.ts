import test from 'node:test';
import assert from 'node:assert/strict';
import { authenticateConnected, chatRecipients, commandConnected, connectedComplete, connectedView, currentConnectedAssignment, freshConnected, loadConnected, resetConnected, saveConnected, threadUnread, validConnected, visibleConnectedEvents, visiblePeople, visibleThreads, CONNECTED_KEY, type ConnectedAction, type ConnectedState } from './connectedDemo';
import { freshSharedDemo, updateSharedDemo, validShared } from './sharedDemo';
import { syncLearner, submitWork } from './userDemo';
import { enrol } from './store';

let serial = 0;
function cmd(s: ConnectedState, actorId: string | null, type: ConnectedAction, payload: Record<string, unknown>) {
 return { id: `test-${++serial}`, expectedVersion: s.events.length, actorId, type, payload };
}
function act(s: ConnectedState, actorId: string | null, type: ConnectedAction, payload: Record<string, unknown>) {
 const result = commandConnected(s, cmd(s, actorId, type, payload)); assert.equal(result.error, undefined); assert.equal(validConnected(result.state), true); return result.state;
}
const registration = (role: 'learner' | 'facilitator', username: string) => ({ role, username, name: `Sample ${username}`, demoCode: `DEMO-${username}`, goal: 'Learn and teach with clear text.', access: 'Written steps', bio: role === 'facilitator' ? 'Sample teaching experience and accessible practice.' : '', courseIds: role === 'facilitator' ? ['digital-essentials'] : [] });
function storage(run: (data: Map<string,string>) => void) {
 const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
 const data = new Map<string,string>([['other-app', 'keep this']]);
 Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: (k:string) => data.get(k) ?? null, setItem: (k:string,v:string) => data.set(k,v), removeItem: (k:string) => data.delete(k) } });
 try { run(data); } finally { if (descriptor) Object.defineProperty(globalThis,'localStorage',descriptor); else Reflect.deleteProperty(globalThis,'localStorage'); }
}

test('connected samples are permanent, distinct, sign-in scoped and never publicly registered as admin', () => {
 const s = freshConnected(), v = connectedView(s);
 assert.equal(validConnected(s), true); assert.equal(v.people.filter(p=>p.role==='facilitator'&&p.sample).length,2);
 assert.equal(v.people.filter(p=>p.role==='learner'&&p.sample).length,2); assert.equal(v.courses.length,8);
 assert.equal(authenticateConnected(v,' ADA ','DEMO-ADA')?.id,'ada'); assert.equal(authenticateConnected(v,'ada','wrong'),undefined);
 assert.deepEqual(visiblePeople(v,'amaka').filter(p=>p.role==='learner').map(p=>p.id),['ada']);
 assert.equal(visiblePeople(v,'admin').length,5); assert.equal(chatRecipients(v,'sani').some(p=>p.id==='amaka'),false);
 assert.ok(commandConnected(s,cmd(s,null,'register',{...registration('learner','bad-admin'),role:'admin'})).error);
 assert.ok(commandConnected(s,cmd(s,null,'register',registration('learner','ada'))).error);
 assert.ok(commandConnected(s,cmd(s,'ada','assign',{learnerId:'ada',courseId:'digital-essentials',facilitatorId:'tunde',note:'Unauthorised reassignment'})).error);
 assert.ok(commandConnected(s,cmd(s,'admin','assign',{learnerId:'ada',courseId:'digital-essentials',facilitatorId:'tunde',note:'Wrong teaching scope'})).error);
});

test('registration and teaching claims wait for reviewed scope, while learners study immediately', () => {
 let s=act(freshConnected(),null,'register',registration('facilitator','new-teacher'));
 const fac=connectedView(s).people.find(p=>p.username==='new-teacher')!; assert.equal(fac.status,'pending'); assert.deepEqual(fac.teachingCourseIds,[]);
 assert.ok(commandConnected(s,cmd(s,fac.id,'review-work',{enrolmentId:'sample-ada-enrolment',revision:1,outcome:'approved',note:'Cannot self-approve scope'})).error);
 s=act(s,'admin','review-facilitator',{personId:fac.id,outcome:'approved',note:'Digital foundation teaching evidence reviewed.'});
 s=act(s,'admin','assign',{learnerId:'ada',courseId:'digital-essentials',facilitatorId:fac.id,note:'Assign the current work for review.'});
 s=act(s,fac.id,'request-teaching',{courseIds:['digital-essentials','sewing-textiles'],bio:'Digital experience; proposing textile foundation planning.'});
 assert.equal(connectedView(s).people.find(p=>p.id===fac.id)!.teachingCourseIds.includes('sewing-textiles'),false);
 assert.equal(connectedView(s).people.find(p=>p.id===fac.id)!.status,'active','existing reviewed scope remains active');
 s=act(s,null,'register',registration('learner','new-learner')); const l=connectedView(s).people.find(p=>p.username==='new-learner')!;
 s=act(s,l.id,'enrol',{courseId:'digital-essentials'}); const e=connectedView(s).enrolments.find(e=>e.learnerId===l.id)!;
 s=act(s,l.id,'complete-lesson',{enrolmentId:e.id,lesson:0}); assert.equal(currentConnectedAssignment(connectedView(s),l.id,e.course.id),undefined);
 s=act(s,l.id,'submit-quiz',{enrolmentId:e.id,answers:e.course.quiz.map(q=>q.answer)});
 assert.equal(Math.max(...connectedView(s).enrolments.find(x=>x.id===e.id)!.scores),100);
 assert.equal(connectedComplete(connectedView(s).enrolments.find(x=>x.id===e.id)!),false);
 assert.ok(commandConnected(s,cmd(s,'sani','complete-lesson',{enrolmentId:e.id,lesson:1})).error);
});

test('practical decisions follow assignment revision and resubmission invalidates approval', () => {
 let s=act(freshConnected(),'amaka','review-work',{enrolmentId:'sample-ada-enrolment',revision:1,outcome:'needs-changes',note:'Explain a clear filename and offline backup.'});
 const first=structuredClone(s.events[0]);
 s=act(s,'ada','submit-work',{enrolmentId:'sample-ada-enrolment',text:'A revised plan includes a clear filename and an offline backup.'});
 assert.ok(commandConnected(s,cmd(s,'amaka','review-work',{enrolmentId:'sample-ada-enrolment',revision:2,outcome:'approved',note:'Stale assignment is blocked'})).error);
 s=act(s,'admin','assign',{learnerId:'ada',courseId:'digital-essentials',facilitatorId:'amaka',note:'Review the latest revision.'});
 s=act(s,'amaka','review-work',{enrolmentId:'sample-ada-enrolment',revision:2,outcome:'approved',note:'The revised evidence meets the foundation task.'});
 assert.equal(connectedComplete(connectedView(s).enrolments[0]),true); assert.deepEqual(s.events[0],first);
 s=act(s,'ada','submit-work',{enrolmentId:'sample-ada-enrolment',text:'Another explicit resubmission.'}); assert.equal(connectedComplete(connectedView(s).enrolments[0]),false);
 s=act(s,'tunde','review-work',{enrolmentId:'sample-sani-enrolment',revision:1,outcome:'approved',note:'Practical evidence reviewed; lessons and quiz remain pending.'});
 assert.equal(connectedComplete(connectedView(s).enrolments[1]),false);
});

test('chat bodies and read state are participant-only, including after reassignment', () => {
 let s=act(freshConnected(),'ada','send-message',{recipientId:'amaka',courseId:'digital-essentials',text:'Private sample conversation marker.'});
 let v=connectedView(s); const thread=visibleThreads(v,'ada')[0];
 assert.equal(visibleThreads(v,'admin').length,0); assert.equal(visibleThreads(v,'tunde').some(t=>t.id===thread.id),false);
 assert.equal(JSON.stringify(visibleConnectedEvents(v,'admin')).includes('Private sample conversation marker'),false);
 assert.equal(threadUnread(thread,'amaka'),2);
 assert.ok(commandConnected(s,cmd(s,'admin','read-thread',{threadId:thread.id,count:thread.messages.length})).error);
 assert.ok(commandConnected(s,cmd(s,'sani','send-message',{recipientId:'amaka',text:'Cannot message an unassigned facilitator.'})).error);
 s=act(s,'amaka','read-thread',{threadId:thread.id,count:thread.messages.length}); assert.equal(threadUnread(visibleThreads(connectedView(s),'amaka')[0],'amaka'),0);
 s=act(s,'tunde','request-teaching',{courseIds:['retail-customer-service','digital-essentials'],bio:'Sample additional digital foundation teaching experience.'});
 s=act(s,'admin','review-facilitator',{personId:'tunde',outcome:'approved',note:'Reviewed the additional teaching scope.'});
 s=act(s,'admin','assign',{learnerId:'ada',courseId:'digital-essentials',facilitatorId:'tunde',note:'Reassign for the next learning session.'});
 assert.equal(visibleThreads(connectedView(s),'tunde').some(t=>t.id===thread.id),false);
 assert.equal(visibleThreads(connectedView(s),'amaka').some(t=>t.id===thread.id),true,'original participant retains history');
 assert.ok(commandConnected(s,cmd(s,'amaka','send-message',{recipientId:'ada',courseId:'digital-essentials',text:'Cannot continue an unassigned teaching thread.'})).error);
 s=act(s,'tunde','send-message',{recipientId:'ada',courseId:'digital-essentials',text:'A new participant-specific teaching conversation.'});
 assert.equal(visibleThreads(connectedView(s),'tunde').find(t=>t.participants.includes('ada'))!.messages.length,1);
 s=act(s,'amaka','send-message',{recipientId:'admin',text:'Please help coordinate the next teaching assignment.'});
 assert.equal(visibleThreads(connectedView(s),'admin').length,1);
});

test('support sharing is explicit and additional topics never become empty published courses', () => {
 let s=act(freshConnected(),'amaka','refer-support',{learnerId:'ada',courseId:'digital-essentials',note:'Please coordinate an offline text pack. No chat messages are attached.'});
 const id=connectedView(s).referrals[0].id;
 assert.ok(commandConnected(s,cmd(s,'amaka','respond-support',{referralId:id,text:'Cannot speak as Administration.'})).error);
 s=act(s,'admin','respond-support',{referralId:id,text:'Plan reviewed; arrange a sample check-in. Delivery is not recorded.'});
 assert.equal(connectedView(s).referrals[0].response?.includes('Delivery is not recorded'),true);
 s=act(s,'amaka','propose-topic',{title:'Accessible record keeping',description:'Planning a text-first introduction with a practical rubric.'}); const topic=connectedView(s).topics[0];
 s=act(s,'admin','review-topic',{topicId:topic.id,outcome:'approved',note:'Approved for curriculum planning, not publication.'});
 assert.equal(connectedView(s).topics[0].status,'approved'); assert.equal(connectedView(s).courses.length,8);
 assert.ok(commandConnected(s,cmd(s,'ada','enrol',{courseId:topic.id})).error);
});

test('existing profile, retained learning and full administrative history are preserved on import', () => {
 let legacy=freshSharedDemo(); let d=syncLearner({...legacy.user,profile:{...legacy.user.profile,name:'Existing sample learner',goals:['Employment'],access:['Larger text']}});
 d.learning=enrol(d.learning,'user-demo','digital-essentials'); d=submitWork(d,d.learning.enrolments[0].id,'Earlier practical evidence.');
 legacy=updateSharedDemo(legacy,d,{kind:'work-submitted',recordId:d.learning.enrolments[0].id}); const source=JSON.stringify(legacy);
 const s=freshConnected(legacy),v=connectedView(s); assert.equal(validConnected(s),true);
 assert.equal(v.people.find(p=>p.id==='existing-learner')!.username,'my-profile');
 assert.equal(v.enrolments.find(e=>e.learnerId==='existing-learner')!.work,'Earlier practical evidence.');
 assert.deepEqual(s.legacy,legacy); assert.equal(JSON.stringify(legacy),source);
 assert.equal(v.people.filter(p=>p.sample&&p.role==='facilitator').length,2);
});

test('connected retries, stale writes and invalid replay preserve current state', () => {
 const initial=freshConnected(), input=cmd(initial,'ada','send-message',{recipientId:'amaka',text:'An exact retry is not a second message.'});
 const s=commandConnected(initial,input).state; assert.equal(commandConnected(s,input).state,s);
 assert.ok(commandConnected(s,{...input,payload:{...input.payload,text:'A conflicting duplicate.'}}).error);
 assert.ok(commandConnected(s,cmd(initial,'ada','send-message',{recipientId:'amaka',text:'A stale screen must reload.'})).error);
 assert.ok(commandConnected(initial,{...cmd(initial,'ada','enrol',{courseId:'sewing-textiles'}),id:'sample-ada-enrolment'}).error);
 for(const patch of [{at:Number.MAX_SAFE_INTEGER},{actorId:'tunde'},{expectedVersion:2},{payload:{recipientId:'amaka',text:'',unsupported:true}}]) assert.equal(validConnected({...s,events:[{...s.events[0],...patch}]}),false);
 assert.equal(validConnected({...s,schemaVersion:2}),false);
});

test('incomplete earlier drafts preserve history without blocking connected registrations or enrolled study', () => {
 let earlier=freshSharedDemo();
 const d=syncLearner({...earlier.user,profile:{...earlier.user.profile,name:'Existing draft author'}});
 d.learning=enrol(d.learning,'user-demo','digital-essentials');
 const draft={...structuredClone(d.learning.courses[0]),id:'incomplete-draft',title:'Incomplete retained draft',status:'draft' as const,lessons:[],quiz:[]};
 d.learning.courses.push(draft);
 d.learning.courses=d.learning.courses.map(c=>c.id==='digital-essentials'?{...c,status:'review' as const}:c);
 earlier=updateSharedDemo(earlier,d);
 assert.equal(validShared(earlier),true);
 const connected=freshConnected(earlier); assert.equal(validConnected(connected),true);
 assert.equal(connected.legacy!.user.learning.courses.find(c=>c.id===draft.id)!.lessons.length,0);
 assert.equal(connectedView(connected).enrolments.find(e=>e.learnerId==='existing-learner')!.course.status,'published','retained enrolled version is preserved');
 assert.equal(act(connected,null,'register',registration('learner','after-import')).events.length,1);
 const enrolled=connectedView(connected).enrolments.find(e=>e.learnerId==='existing-learner')!;
 assert.equal(act(connected,'existing-learner','complete-lesson',{enrolmentId:enrolled.id,lesson:0}).events.length,1);
 assert.ok(commandConnected(connected,cmd(connected,'ada','enrol',{courseId:draft.id})).error);
});

test('connected persistence refuses corrupt or divergent histories and resets only its own key', () => storage(data=>{
 const s=act(freshConnected(),'ada','send-message',{recipientId:'amaka',text:'Persistent sample message.'});
 assert.equal(saveConnected(s),true); assert.deepEqual(loadConnected().state,s);
 assert.equal(saveConnected(freshConnected()),false);
 const divergent=act(freshConnected(),'sani','send-message',{recipientId:'tunde',text:'Another history cannot overwrite saved messages.'}); assert.equal(saveConnected(divergent),false);
 for(const raw of ['{broken',JSON.stringify({...s,events:[{...s.events[0],at:Number.MAX_SAFE_INTEGER}]})]) {data.set(CONNECTED_KEY,raw);assert.ok(loadConnected().recovery);assert.equal(saveConnected(s),false);assert.equal(data.get(CONNECTED_KEY),raw);}
 assert.equal(resetConnected(),true); assert.equal(connectedView(loadConnected().state).people.length,5); assert.equal(data.get('other-app'),'keep this');
}));

test('connected denied storage reports an in-memory mode and never claims a saved result',()=>{
 const descriptor=Object.getOwnPropertyDescriptor(globalThis,'localStorage'); Object.defineProperty(globalThis,'localStorage',{configurable:true,get:()=>{throw new Error('denied');}});
 try {assert.ok(loadConnected().warning);assert.equal(saveConnected(freshConnected()),false);assert.equal(resetConnected(),false);}
 finally{if(descriptor)Object.defineProperty(globalThis,'localStorage',descriptor);else Reflect.deleteProperty(globalThis,'localStorage');}
});
