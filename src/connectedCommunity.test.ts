import test from 'node:test';
import assert from 'node:assert/strict';
import { commandConnected, connectedView, currentConnectedAssignment, freshConnected, validConnected, visibleConnectedEvents, visibleThreads, type ConnectedAction, type ConnectedState } from './connectedDemo';
import { boardStates, noticeUnread, publicFacilitators, visibleNotices } from './connectedCommunity';

let serial=0;
function command(s:ConnectedState,actorId:string|null,type:ConnectedAction,payload:Record<string,unknown>) { return {id:`community-${++serial}`,expectedVersion:s.events.length,actorId,type,payload}; }
function act(s:ConnectedState,actorId:string|null,type:ConnectedAction,payload:Record<string,unknown>) { const r=commandConnected(s,command(s,actorId,type,payload)); assert.equal(r.error,undefined); assert.equal(validConnected(r.state),true); return r.state; }
function denied(s:ConnectedState,actorId:string|null,type:ConnectedAction,payload:Record<string,unknown>) { const r=commandConnected(s,command(s,actorId,type,payload)); assert.ok(r.error); assert.equal(r.state,s); }
const registration={name:'New participant',username:'new-participant',role:'learner',demoCode:'DEMO-NEW',goal:'Learning',access:'Written instructions',bio:'',courseIds:[]};

test('public directory projects only approved consented data and preserves last reviewed text',()=>{
 let s=freshConnected();
 const listings=publicFacilitators(connectedView(s));
 assert.equal(listings.length,2);
 assert.deepEqual(Object.keys(listings[0]).sort(),['id','introduction','name','sample','subjects']);
 assert.equal(JSON.stringify(listings).includes('DEMO-'),false);
 const approved=listings.find(p=>p.id==='amaka')!.introduction;
 s=act(s,'amaka','submit-public-profile',{introduction:'A new introduction awaiting review.',consent:true});
 assert.equal(publicFacilitators(connectedView(s)).find(p=>p.id==='amaka')!.introduction,approved);
 denied(s,'amaka','review-public-profile',{personId:'amaka',outcome:'approved',note:'Self approval'});
 s=act(s,'admin','review-public-profile',{personId:'amaka',outcome:'approved',note:'Public text reviewed.'});
 assert.equal(publicFacilitators(connectedView(s)).find(p=>p.id==='amaka')!.introduction,'A new introduction awaiting review.');
 s=act(s,'amaka','withdraw-public-profile',{});
 assert.equal(publicFacilitators(connectedView(s)).some(p=>p.id==='amaka'),false);
 s=act(s,'amaka','submit-public-profile',{introduction:'Unreviewed replacement.',consent:true});
 assert.equal(publicFacilitators(connectedView(s)).find(p=>p.id==='amaka')!.introduction,'A new introduction awaiting review.');
 denied(s,'ada','submit-public-profile',{introduction:'Cannot publish learner as teacher',consent:true});
});

test('legacy registrations replay without home states; new values are validated',()=>{
 let s=act(freshConnected(),null,'register',registration);
 const v=connectedView(s),person=v.people.find(p=>p.username===registration.username)!;
 assert.equal(person.homeState,undefined); assert.equal(person.publicProfile,undefined);
 denied(s,person.id,'set-home-state',{state:'Unknown'});
 s=act(s,person.id,'set-home-state',{state:'FCT'});
 assert.equal(connectedView(s).people.find(p=>p.id===person.id)!.homeState,'FCT');
 assert.equal(boardStates.length,37);assert.ok(boardStates.includes('Plateau'));
 denied(s,null,'register',{...registration,username:'invalid-state',homeState:'Unknown'});
});

test('facilitator request atomically enrols, does not expose teaching chat, and rejects duplicates',()=>{
 let s=act(freshConnected(),null,'register',{...registration,homeState:'Plateau'});
 const learner=connectedView(s).people.find(p=>p.username===registration.username)!;
 denied(s,learner.id,'request-facilitator',{courseId:'digital-essentials',facilitatorId:'tunde'});
 assert.equal(connectedView(s).enrolments.some(e=>e.learnerId===learner.id),false);
 s=act(s,learner.id,'request-facilitator',{courseId:'digital-essentials',facilitatorId:'amaka'});
 let v=connectedView(s);assert.equal(v.enrolments.filter(e=>e.learnerId===learner.id).length,1);assert.equal(v.requests.length,1);assert.equal(visibleThreads(v,learner.id).length,0);
 denied(s,learner.id,'request-facilitator',{courseId:'digital-essentials',facilitatorId:'amaka'});
 denied(s,'amaka','resolve-request',{requestId:v.requests[0].id,outcome:'assigned',facilitatorId:'amaka',note:'Cannot self assign'});
 s=act(s,'admin','resolve-request',{requestId:v.requests[0].id,outcome:'assigned',facilitatorId:'amaka',note:'Preferred facilitator confirmed.'});
 v=connectedView(s);assert.equal(currentConnectedAssignment(v,learner.id,'digital-essentials')?.facilitatorId,'amaka');
 s=act(s,learner.id,'send-message',{recipientId:'amaka',courseId:'digital-essentials',text:'Please explain the practice.'});
 assert.equal(visibleThreads(connectedView(s),'amaka').some(t=>t.participants.includes(learner.id)),true);
});

test('request decisions use latest submission revision and manual assignment resolves pending request',()=>{
 let s=act(freshConnected(),'ada','request-facilitator',{courseId:'digital-essentials',facilitatorId:'amaka'});
 const id=connectedView(s).requests[0].id;
 s=act(s,'ada','submit-work',{enrolmentId:'sample-ada-enrolment',text:'Latest revised practical evidence.'});
 s=act(s,'admin','resolve-request',{requestId:id,outcome:'assigned',facilitatorId:'amaka',note:'Review current evidence.'});
 assert.equal(currentConnectedAssignment(connectedView(s),'ada','digital-essentials')!.workRevision,2);
 s=act(s,'ada','request-facilitator',{courseId:'digital-essentials',facilitatorId:'amaka'});
 s=act(s,'admin','assign',{learnerId:'ada',courseId:'digital-essentials',facilitatorId:'amaka',note:'Manual assignment also resolves preference.'});
 assert.equal(connectedView(s).requests.filter(r=>r.status==='pending').length,0);
 denied(s,'admin','resolve-request',{requestId:id,outcome:'declined',note:'Already resolved'});
});

test('changed preferences retain superseded history, withdrawal and decline preserve current assignment',()=>{
 let s=act(freshConnected(),'tunde','request-teaching',{courseIds:['retail-customer-service','digital-essentials'],bio:'Additional digital teaching evidence.'});
 s=act(s,'admin','review-facilitator',{personId:'tunde',outcome:'approved',note:'Teaching scope reviewed.'});
 s=act(s,'ada','request-facilitator',{courseId:'digital-essentials',facilitatorId:'amaka'});
 s=act(s,'ada','request-facilitator',{courseId:'digital-essentials',facilitatorId:'tunde'});
 let v=connectedView(s);assert.deepEqual(v.requests.map(r=>r.status),['superseded','pending']);
 denied(s,'sani','withdraw-request',{requestId:v.requests[1].id});
 s=act(s,'admin','resolve-request',{requestId:v.requests[1].id,outcome:'declined',note:'Keep existing teaching arrangement.'});
 assert.equal(currentConnectedAssignment(connectedView(s),'ada','digital-essentials')!.facilitatorId,'amaka');
 s=act(s,'ada','request-facilitator',{courseId:'digital-essentials',facilitatorId:'tunde'});
 v=connectedView(s);s=act(s,'ada','withdraw-request',{requestId:v.requests.at(-1)!.id});
 assert.equal(connectedView(s).requests.at(-1)!.status,'withdrawn');
});

test('directory withdrawal blocks new requests but does not revoke existing teaching approval',()=>{
 let s=act(freshConnected(),'ada','request-facilitator',{courseId:'digital-essentials',facilitatorId:'amaka'});
 const id=connectedView(s).requests[0].id;
 s=act(s,'amaka','withdraw-public-profile',{});
 denied(s,'sani','request-facilitator',{courseId:'digital-essentials',facilitatorId:'amaka'});
 s=act(s,'admin','resolve-request',{requestId:id,outcome:'assigned',facilitatorId:'amaka',note:'Teaching eligibility remains reviewed.'});
 assert.equal(connectedView(s).requests[0].status,'assigned');
});

test('board permissions, cross-state participation and safe text are validated in the model',()=>{
 let s=freshConnected();
 denied(s,null,'publish-notice',{state:'Plateau',title:'Notice',text:'Text'});
 denied(s,'ada','publish-notice',{state:'Plateau',title:'Notice',text:'Text'});
 denied(s,'amaka','publish-notice',{state:'Invalid',title:'Notice',text:'Text'});
 s=act(s,'amaka','publish-notice',{state:'Plateau',title:'Sample community discussion',text:'<script>plain text, never HTML</script>'});
 const id=connectedView(s).notices[0].id;
 s=act(s,'sani','set-home-state',{state:'Lagos'});
 s=act(s,'sani','reply-notice',{noticeId:id,text:'Participating across states.'});
 assert.equal(visibleNotices(connectedView(s),'sani','Plateau')[0].replies.length,1);
 assert.deepEqual(visibleNotices(connectedView(s),'visitor','Plateau'),[]);
 denied(s,'ada','moderate-board',{noticeId:id,action:'hide',reason:'Not an administrator'});
 denied(s,'admin','moderate-board',{noticeId:id,action:'hide',reason:''});
 s=act(s,'admin','moderate-board',{noticeId:id,action:'close',reason:'Sample discussion complete.'});
 denied(s,'admin','reply-notice',{noticeId:id,text:'Even admin cannot reply while closed'});
 s=act(s,'admin','moderate-board',{noticeId:id,action:'reopen',reason:'Continue discussion.'});
 s=act(s,'ada','reply-notice',{noticeId:id,text:'Discussion reopened.'});
 assert.equal(connectedView(s).notices[0].replies.length,2);
});

test('hidden board content is excluded from normal projections, activity and unread calculations',()=>{
 let s=act(freshConnected(),'amaka','publish-notice',{state:'FCT',title:'Hidden sample title',text:'Hidden sample body'});
 const id=connectedView(s).notices[0].id;
 s=act(s,'sani','reply-notice',{noticeId:id,text:'Hidden sample reply'});
 const replyId=connectedView(s).notices[0].replies[0].id;
 s=act(s,'admin','moderate-board',{noticeId:id,replyId,action:'hide',reason:'Sample moderation reason'});
 assert.equal(visibleNotices(connectedView(s),'ada','FCT')[0].replies.length,0);
 s=act(s,'admin','moderate-board',{noticeId:id,action:'hide',reason:'Hide entire discussion'});
 let v=connectedView(s);assert.equal(visibleNotices(v,'ada','FCT').length,0);assert.equal(noticeUnread(v,'ada',v.notices[0]),false);
 assert.equal(JSON.stringify(visibleConnectedEvents(v,'admin')).includes('Hidden sample'),false);
 assert.equal(v.moderation.length,2);assert.equal(v.notices[0].text,'Hidden sample body');
 s=act(s,'admin','moderate-board',{noticeId:id,action:'restore',reason:'Restore discussion'});
 v=connectedView(s);assert.equal(noticeUnread(v,'ada',v.notices[0]),true);
});

test('read positions survive replay and restoration uses original order; own posts are not unread',()=>{
 let s=act(freshConnected(),'amaka','publish-notice',{state:'Plateau',title:'Read tracking',text:'Sample discussion'});
 const id=connectedView(s).notices[0].id;
 assert.equal(noticeUnread(connectedView(s),'amaka',connectedView(s).notices[0]),false);
 assert.equal(noticeUnread(connectedView(s),'ada',connectedView(s).notices[0]),true);
 denied(s,'ada','read-notice',{noticeId:id,through:2000});
 s=act(s,'ada','read-board',{state:'Plateau',through:s.events.length});
 let v=connectedView(JSON.parse(JSON.stringify(s)));assert.equal(noticeUnread(v,'ada',v.notices[0]),false);
 s=act(s,'sani','reply-notice',{noticeId:id,text:'A new reply'});
 assert.equal(noticeUnread(connectedView(s),'ada',connectedView(s).notices[0]),true);
 s=act(s,'ada','read-notice',{noticeId:id,through:s.events.length});
 const replyId=connectedView(s).notices[0].replies[0].id;
 s=act(s,'admin','moderate-board',{noticeId:id,replyId,action:'hide',reason:'Temporary hiding'});
 s=act(s,'admin','moderate-board',{noticeId:id,replyId,action:'restore',reason:'Restored original reply'});
 v=connectedView(s);assert.equal(noticeUnread(v,'ada',v.notices[0]),false);
});

test('community commands retain stale-version, payload, retry and replay guards',()=>{
 let s=freshConnected();const c=command(s,'amaka','publish-notice',{state:'Plateau',title:'Idempotency',text:'Sample notice'});
 const r=commandConnected(s,c);assert.equal(r.error,undefined);s=r.state;
 assert.equal(commandConnected(s,c).state,s);
 const stale={...command(s,'ada','reply-notice',{noticeId:c.id,text:'Stale reply'}),expectedVersion:0};
 assert.ok(commandConnected(s,stale).error);
 denied(s,'ada','reply-notice',{noticeId:c.id,text:'Valid text',authorId:'admin'});
 const corrupt=structuredClone(s);corrupt.events[0].payload.state='Unknown';assert.equal(validConnected(corrupt),false);
 assert.equal(validConnected(JSON.parse(JSON.stringify(s))),true);
});

test('registration public consent needs separate text review and teaching approval',()=>{
 let s=freshConnected();
 const teacher={...registration,role:'facilitator',username:'directory-teacher',bio:'Private teaching evidence',courseIds:['digital-essentials'],homeState:'FCT',publicIntroduction:'Public teaching introduction',publicationConsent:true};
 denied(s,null,'register',{...teacher,publicIntroduction:''});
 denied(s,null,'register',{...teacher,publicationConsent:'yes'});
 denied(s,null,'register',{...registration,publicIntroduction:'Learner cannot publish as facilitator'});
 s=act(s,null,'register',teacher);
 const person=connectedView(s).people.find(p=>p.username===teacher.username)!;
 assert.equal(publicFacilitators(connectedView(s)).some(p=>p.id===person.id),false);
 s=act(s,'admin','review-public-profile',{personId:person.id,outcome:'approved',note:'Public introduction reviewed.'});
 assert.equal(publicFacilitators(connectedView(s)).some(p=>p.id===person.id),false);
 s=act(s,'admin','review-facilitator',{personId:person.id,outcome:'approved',note:'Teaching evidence separately reviewed.'});
 const listing=publicFacilitators(connectedView(s)).find(p=>p.id===person.id)!;
 assert.equal(listing.introduction,teacher.publicIntroduction);assert.equal(listing.homeState,'FCT');assert.equal(JSON.stringify(listing).includes(teacher.bio),false);
});

test('pinning orders notices without creating unread activity; pending facilitators reply but cannot publish',()=>{
 let s=act(freshConnected(),null,'register',{...registration,role:'facilitator',username:'pending-teacher',bio:'Teaching evidence awaiting review',courseIds:['digital-essentials']});
 const person=connectedView(s).people.find(p=>p.username==='pending-teacher')!;
 denied(s,person.id,'publish-notice',{state:'Plateau',title:'Cannot publish',text:'Pending scope'});
 s=act(s,'admin','publish-notice',{state:'Plateau',title:'First',text:'First sample notice'});const first=connectedView(s).notices[0].id;
 s=act(s,'admin','publish-notice',{state:'Plateau',title:'Second',text:'Second sample notice'});
 s=act(s,person.id,'reply-notice',{noticeId:first,text:'Pending facilitator may join a community discussion.'});
 s=act(s,'ada','read-board',{state:'Plateau',through:s.events.length});
 s=act(s,'admin','moderate-board',{noticeId:first,action:'pin',reason:'Sample priority notice'});
 const v=connectedView(s);assert.equal(visibleNotices(v,'ada','Plateau')[0].id,first);assert.equal(v.notices.some(n=>noticeUnread(v,'ada',n)),false);
 denied(s,'admin','moderate-board',{noticeId:first,action:'pin',reason:'Already pinned'});
});
