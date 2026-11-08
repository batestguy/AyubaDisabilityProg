import { useState, type ReactNode } from 'react';
import type { ConnectedAction, ConnectedView, Person } from './connectedDemo';
import { connectedComplete, currentConnectedAssignment, threadUnread, visibleThreads } from './connectedDemo';
import { boardStates, noticeUnread, visibleNotices, type FacilitatorListing, type FacilitatorRequest, type BoardNotice } from './connectedCommunity';

export type CommunityRun = (type: ConnectedAction, payload: Record<string, unknown>, success?: string) => boolean;
export type FacilitatorChoice = { facilitatorId: string; courseId: string };
function Panel({ children }: { children: ReactNode }) { return <article className="cd-card">{children}</article>; }
const date = (at: number) => new Date(at).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' });
const displayStatus = (s: string) => s === 'pending' ? 'Awaiting Administration' : s === 'assigned' ? 'Assignment confirmed' : s.charAt(0).toUpperCase() + s.slice(1);

export function FundingGuide({ navigate }: { navigate?: (tab: string) => void }) {
 return <details className="cd-funding-guide"><summary>How this demonstration connects everyone</summary>
  <p>Follow a fictional learner through the service. These working connections share records in this browser; funding would establish the people, partnerships and online service needed for delivery.</p>
  <ol className="cd-journey"><li><strong>Learner chooses</strong><span>Choose a course and request an approved facilitator.</span>{navigate&&<button onClick={()=>navigate('Find a facilitator')}>Find a facilitator</button>}</li><li><strong>Administration connects</strong><span>Review the preference and confirm an eligible teaching assignment.</span></li><li><strong>Facilitator guides</strong><span>Read assigned work, give feedback and discuss the course.</span></li><li><strong>Learner continues</strong><span>Read feedback, revise work and share a separate support note when needed.</span></li></ol>
  <p>Use Show sample sign-ins, then sign out and sign in to the next role. Ada and Amaka demonstrate digital learning; Sani and Tunde demonstrate customer service. No activity is created by opening this guide.</p>
  <p><strong>Funding would establish:</strong> real accounts, cross-device communication, trained delivery partners and verified programme opportunities. Sample progress is demonstration activity.</p>
 </details>;
}

// Public rendering deliberately receives a projection, never raw participant records.
export function FacilitatorDirectory({ listings, publishedCourseIds, onChoose }: { listings: FacilitatorListing[]; publishedCourseIds: string[]; onChoose: (choice: FacilitatorChoice) => void }) {
 const [search,setSearch]=useState(''),[subject,setSubject]=useState(''),[state,setState]=useState('');
 const subjects=[...new Map(listings.flatMap(p=>p.subjects).map(s=>[s.id,s])).values()];
 const filtered=listings.filter(p=>p.name.toLowerCase().includes(search.trim().toLowerCase())&&(!subject||p.subjects.some(s=>s.id===subject))&&(!state||p.homeState===state));
 return <section aria-label="Approved facilitator directory"><h3>Find a facilitator</h3><p>Explore approved subjects and reviewed public introductions. Request a preferred facilitator; Administration confirms the assignment.</p>
  <div className="cd-directory-filters cd-form"><label>Search facilitator name<input value={search} onChange={e=>setSearch(e.target.value)}/></label><label>Filter by subject<select value={subject} onChange={e=>setSubject(e.target.value)}><option value="">All subjects</option>{subjects.map(s=><option key={s.id} value={s.id}>{s.title}</option>)}</select></label><label>Filter by home state<select value={state} onChange={e=>setState(e.target.value)}><option value="">All locations</option>{boardStates.map(s=><option key={s}>{s}</option>)}</select></label></div>
  <p role="status">{filtered.length} approved public {filtered.length===1?'listing':'listings'}</p>
  {!filtered.length&&<p>No matching approved facilitator is publicly listed. Try another filter; other teaching may still be available through Administration.</p>}
  <div className="cd-directory-grid">{filtered.map(p=><Panel key={p.id}><span className="cd-badge">{p.sample?'Fictional sample facilitator':'Approved facilitator'}</span><h4>{p.name}</h4><p>{p.introduction}</p><p>Home state: {p.homeState||'Not provided'} · Location does not limit teaching.</p><ul className="cd-subjects">{p.subjects.map(s=><li key={s.id}><strong>{s.title}</strong>{publishedCourseIds.includes(s.id)&&<button onClick={()=>onChoose({facilitatorId:p.id,courseId:s.id})}>Request {p.name} for {s.title}</button>}</li>)}</ul></Panel>)}</div>
 </section>;
}

export function ChoiceConfirmation({ choice, listings, actor, run, onCancel, onSignIn }: { choice: FacilitatorChoice; listings: FacilitatorListing[]; actor: Person|null; run: CommunityRun; onCancel:()=>void; onSignIn?:()=>void }) {
 const listing=listings.find(p=>p.id===choice.facilitatorId), subject=listing?.subjects.find(s=>s.id===choice.courseId);
 return <section id="cd-choice" tabIndex={-1} className="cd-choice" aria-label="Selected facilitator"><h3>Your facilitator choice</h3>{listing&&subject?<><p><strong>{listing.name}</strong> · {subject.title}</p><p>Administration will review your preference. Your current assignment stays in place until Administration changes it.</p>{!actor?<><p>Sign in or register as a learner, then confirm this request.</p>{onSignIn&&<button onClick={onSignIn}>Continue to sign-in</button>}</>:actor.role==='learner'?<button onClick={()=>{if(run('request-facilitator',choice,'Facilitator request sent to Administration.'))onCancel();}}>Confirm facilitator request</button>:<p>Only a learner can confirm this choice. Sign out and use a learner identity to continue.</p>}</>:<p>This public listing is no longer available. Cancel and choose another facilitator.</p>}<button className="cd-secondary" onClick={onCancel}>Cancel selection</button></section>;
}

export function RequestHistory({view,actor,run}:{view:ConnectedView;actor:Person;run:CommunityRun}) {
 const requests=view.requests.filter(r=>actor.role==='admin'||r.learnerId===actor.id);
 return <section><h3>{actor.role==='admin'?'Facilitator requests':'Your facilitator requests'}</h3>{!requests.length&&<p>No facilitator requests yet.</p>}{requests.slice().reverse().map(r=><Panel key={r.id}><h4>{view.people.find(p=>p.id===r.learnerId)?.name} · {view.courses.find(c=>c.id===r.courseId)?.title}</h4><span className="cd-badge">{displayStatus(r.status)}</span><p>Preferred facilitator: {view.people.find(p=>p.id===r.facilitatorId)?.name||'Unavailable'}</p><small>Requested {date(r.at)}</small>{r.assignedFacilitatorId&&<p>Confirmed facilitator: {view.people.find(p=>p.id===r.assignedFacilitatorId)?.name}</p>}{r.note&&<p className="cd-note">{r.note}</p>}{r.status==='pending'&&(actor.role==='admin'?<ResolveRequest request={r} view={view} run={run}/>:<><p>Next: Administration reviews this preference. You can continue studying.</p><button onClick={()=>run('withdraw-request',{requestId:r.id},'Request withdrawn.')}>Withdraw request</button></>)}</Panel>)}</section>;
}
function ResolveRequest({request:r,view,run}:{request:FacilitatorRequest;view:ConnectedView;run:CommunityRun}) {
 const eligible=view.people.filter(p=>p.role==='facilitator'&&p.status==='active'&&p.teachingCourseIds.includes(r.courseId));
 const [facilitatorId,setFacilitator]=useState(eligible.some(p=>p.id===r.facilitatorId)?r.facilitatorId:''),[outcome,setOutcome]=useState('assigned'),[note,setNote]=useState('');
 const current=currentConnectedAssignment(view,r.learnerId,r.courseId);
 return <form className="cd-form" onSubmit={e=>{e.preventDefault();run('resolve-request',{requestId:r.id,outcome,note,...(outcome==='assigned'?{facilitatorId}:{})},'Facilitator request resolved.');}}><p>Current assignment: {view.people.find(p=>p.id===current?.facilitatorId)?.name||'None'}. Preferred facilitator currently {eligible.some(p=>p.id===r.facilitatorId)?'eligible':'unavailable'}.</p><label>Request decision<select value={outcome} onChange={e=>setOutcome(e.target.value)}><option value="assigned">Confirm an assignment</option><option value="declined">Decline request</option></select></label>{outcome==='assigned'&&<label>Confirm facilitator<select required value={facilitatorId} onChange={e=>setFacilitator(e.target.value)}><option value="">Choose eligible facilitator</option>{eligible.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label>}<label>Decision explanation<textarea required maxLength={3000} value={note} onChange={e=>setNote(e.target.value)} rows={3}/></label><button type="submit">Save request decision</button></form>;
}

export function PublicProfileEditor({actor,run}:{actor:Person;run:CommunityRun}) {
 const [introduction,setIntroduction]=useState(actor.publicProfile?.draft||''),[consent,setConsent]=useState(false);
 return <Panel><h3>Your public directory introduction</h3><p>This introduction is separate from your private teaching biography. Listing is optional; Administration reviews the text before publication.</p><p>Status: {!actor.publicProfile?.consent?'Not listed — consent not given':actor.publicProfile.pending?'Introduction awaiting review':actor.publicProfile.approved?'Approved public introduction':'Changes requested'}</p>{actor.publicProfile?.approved&&<p className="cd-note"><strong>Last approved introduction:</strong> {actor.publicProfile.approved}</p>}{actor.publicProfile?.note&&<p>Review note: {actor.publicProfile.note}</p>}<form className="cd-form" onSubmit={e=>{e.preventDefault();if(run('submit-public-profile',{introduction,consent},'Public introduction submitted for Administration review.'))setConsent(false);}}><label>Public introduction<textarea aria-label="Public introduction" required maxLength={3000} rows={4} value={introduction} onChange={e=>setIntroduction(e.target.value)}/></label><label className="cd-consent"><input type="checkbox" required checked={consent} onChange={e=>setConsent(e.target.checked)}/>I agree to publish my name, approved subjects, reviewed introduction and home state if provided.</label><button type="submit">Submit public introduction</button></form>{actor.publicProfile?.consent&&<button onClick={()=>run('withdraw-public-profile',{},'Publication consent withdrawn. Your public listing is hidden.')}>Withdraw publication consent</button>}</Panel>;
}
export function PublicProfileReviews({view,run}:{view:ConnectedView;run:CommunityRun}) {
 const pending=view.people.filter(p=>p.publicProfile?.pending&&p.publicProfile.consent);
 return <section><h3>Public introduction reviews</h3>{!pending.length&&<p>No public introductions awaiting review.</p>}{pending.map(p=><ProfileReview key={`${p.id}:${p.publicProfile!.draft}`} person={p} run={run}/>)}</section>;
}
function ProfileReview({person,run}:{person:Person;run:CommunityRun}) {
 const [outcome,setOutcome]=useState('approved'),[note,setNote]=useState('');
 return <Panel><h4>{person.name}</h4><p className="cd-work">{person.publicProfile!.draft}</p><p>Publication consent given. Listing also requires active teaching approval and approved subjects.</p><form className="cd-form" onSubmit={e=>{e.preventDefault();run('review-public-profile',{personId:person.id,outcome,note});}}><label>Public profile decision<select value={outcome} onChange={e=>setOutcome(e.target.value)}><option value="approved">Approve introduction</option><option value="needs-changes">Request changes</option></select></label><label>Public profile review note<textarea required maxLength={3000} value={note} onChange={e=>setNote(e.target.value)}/></label><button type="submit">Save public profile decision</button></form></Panel>;
}

export function HomeStateSetting({actor,run}:{actor:Person;run:CommunityRun}) {
 const [state,setState]=useState(actor.homeState||'');
 return <details className="cd-state-setting"><summary>Home state: {actor.homeState||'Choose your state or FCT'}</summary><p>This sets your default noticeboard. You can participate in every state board. Learner home states also update the Administration map. For consenting listed facilitators, it also appears in your public profile.</p><form className="cd-form" onSubmit={e=>{e.preventDefault();run('set-home-state',{state},'Home state updated.');}}><label>Home state<select aria-label="Home state" required value={state} onChange={e=>setState(e.target.value)}><option value="">Choose state or FCT</option>{boardStates.map(s=><option key={s}>{s}</option>)}</select></label><button type="submit">Save home state</button></form></details>;
}

export function RoleHome({view,actor,navigate}:{view:ConnectedView;actor:Person;navigate:(tab:string,target?:string)=>void}) {
 const own=view.enrolments.filter(e=>e.learnerId===actor.id);
 const assignments=view.assignments.filter(a=>a.facilitatorId===actor.id&&actor.status==='active'&&actor.teachingCourseIds.includes(a.courseId));
 const assigned=view.enrolments.filter(e=>assignments.some(a=>a.learnerId===e.learnerId&&a.courseId===e.course.id));
 const rows:{title:string;detail:string;tab:string;target?:string}[]=[];
 if(actor.role==='learner') {
  if(!own.length)rows.push({title:'Choose your first course',detail:'Explore learning and request a facilitator when ready.',tab:'My learning'});
  for(const e of own) {
   const a=currentConnectedAssignment(view,actor.id,e.course.id),facilitator=view.people.find(p=>p.id===a?.facilitatorId);
   const pending=view.requests.some(r=>r.learnerId===actor.id&&r.courseId===e.course.id&&r.status==='pending');
   rows.push({title:e.course.title,detail:connectedComplete(e)?'Course complete':e.review==='needs-changes'?`${facilitator?.name||'Facilitator'} requested changes — open your feedback`:pending?'Facilitator request awaiting Administration — continue studying':!a?'Awaiting facilitator — request a preference or continue studying':e.work&&a.workRevision!==e.workRevision?'Revised work awaiting Administration assignment':e.work&&!e.review?`Feedback requested — ${facilitator?.name}`:`Assigned to ${facilitator?.name} — continue learning`,tab:'My learning',target:`course-${e.id}`});
  }
  rows.push({title:'Find a facilitator',detail:'Browse approved teaching subjects and request your preference.',tab:'Find a facilitator'});
 } else if(actor.role==='facilitator') {
  if(actor.status!=='active'||actor.teachingReviewPending)rows.push({title:'Teaching approval',detail:actor.reviewNote||'Administration is reviewing your teaching subjects.',tab:'Teaching profile'});
  for(const e of assigned) {const a=assignments.find(a=>a.learnerId===e.learnerId&&a.courseId===e.course.id)!; rows.push({title:`${view.people.find(p=>p.id===e.learnerId)?.name} · ${e.course.title}`,detail:e.work&&a.workRevision!==e.workRevision?'Revised work awaiting Administration assignment':e.work&&!e.review?'Practical submission ready for your review':e.review==='needs-changes'?'Feedback sent — awaiting learner revision':'Open learner progress and practical work',tab:'Learners',target:`work-${e.id}`});}
  if(!assigned.length)rows.push({title:'No learners assigned yet',detail:'Administration assigns learners within your approved teaching scope.',tab:'Teaching profile'});
 } else {
  const pendingTeachers=view.people.filter(p=>p.role==='facilitator'&&(p.status==='pending'||p.teachingReviewPending));
  rows.push({title:`${pendingTeachers.length} teaching applications awaiting review`,detail:'Review teaching experience and requested subjects.',tab:'Facilitators'});
  rows.push({title:`${view.people.filter(p=>p.publicProfile?.pending&&p.publicProfile.consent).length} public introductions awaiting review`,detail:'Review the separate text intended for the public directory.',tab:'Facilitators'});
  rows.push({title:`${view.requests.filter(r=>r.status==='pending').length} facilitator requests awaiting decision`,detail:'Confirm a preferred facilitator or explain another assignment.',tab:'Facilitator requests'});
  const waiting=view.enrolments.filter(e=>{const a=currentConnectedAssignment(view,e.learnerId,e.course.id);return !a||(!!e.work&&a.workRevision!==e.workRevision);});
  rows.push({title:`${waiting.length} enrolments awaiting assignment`,detail:'Connect unassigned learners and assign revised submissions for review.',tab:'Learners'});
  rows.push({title:`${view.topics.filter(t=>t.status==='pending').length} topic requests awaiting review`,detail:'Review proposals for future curriculum planning.',tab:'Courses & topics'});
 }
 const threads=visibleThreads(view,actor.id),unread=threads.reduce((n,t)=>n+threadUnread(t,actor.id),0);
 if(unread)rows.push({title:`${unread} unread messages`,detail:'Open your participant conversations and reply.',tab:'Messages'});
 const referrals=view.referrals.filter(r=>actor.role==='admin'||r.learnerId===actor.id||r.facilitatorId===actor.id);
 for(const r of referrals)rows.push({title:`Support · ${view.people.find(p=>p.id===r.learnerId)?.name}`,detail:r.response?'Administration responded — open the response':actor.role==='admin'?'Awaiting your response — no resource delivery recorded':'Awaiting Administration response',tab:'Support',target:`support-${r.id}`});
 if(actor.role==='admin')rows.sort((a,b)=>(Number.parseInt(b.title)||0)-(Number.parseInt(a.title)||0));
 const title=actor.role==='learner'?'Your next steps':actor.role==='facilitator'?'Your teaching desk':'Administration action queue';
 return <><div className="cd-welcome"><p className="cd-eyebrow">Learning, guidance and support</p><h3>{title}</h3><p>{actor.role==='learner'?actor.goal||'Choose your learning goal and connect with teaching support.':actor.role==='facilitator'?'See who needs your guidance and what happens next.':'Connect participants and keep every request moving.'}</p></div><ol className="cd-action-queue">{rows.map((r,i)=><li key={i}><div><strong>{r.title}</strong><p>{r.detail}</p></div><button onClick={()=>navigate(r.tab,r.target)}>Open {r.tab.toLowerCase()}</button></li>)}</ol><FundingGuide navigate={actor.role==='learner'?navigate:undefined}/></>;
}

export function StateBoards({view,actor,run}:{view:ConnectedView;actor:Person;run:CommunityRun}) {
 const [state,setState]=useState(actor.homeState||''),[moderation,setModeration]=useState(false);
 const [title,setTitle]=useState(''),[text,setText]=useState('');
 const canPublish=actor.role==='admin'||(actor.role==='facilitator'&&actor.status==='active'&&actor.teachingCourseIds.length>0);
 const notices=visibleNotices(view,actor.id,state);
 return <><p>Community notices are shared with signed-in participants. Teaching conversations and support notes stay in their separate spaces.</p><div className="cd-form"><label>State noticeboard<select aria-label="State noticeboard" value={state} onChange={e=>setState(e.target.value)}><option value="">Choose a state or FCT</option>{boardStates.map(s=>{const unread=visibleNotices(view,actor.id,s).filter(n=>noticeUnread(view,actor.id,n)).length;return <option key={s} value={s}>{s}{unread?` (${unread} unread notices)`:''}</option>;})}</select></label></div>{!state?<p>Choose a board to read notices. Home state sets your default; every state is open to you.</p>:<><header className="cd-board-heading"><h3>{state} noticeboard</h3><button onClick={()=>run('read-board',{state,through:view.events.length},'Visible board notices marked as read.')}>Mark board as read</button></header>{canPublish&&<details className="cd-notice-composer"><summary>Publish a notice in {state}</summary><form className="cd-form" onSubmit={e=>{e.preventDefault();if(run('publish-notice',{state,title,text},'Notice published.')){setTitle('');setText('');}}}><label>Notice title<input required maxLength={150} value={title} onChange={e=>setTitle(e.target.value)}/></label><label>Notice text<textarea required maxLength={3000} rows={4} value={text} onChange={e=>setText(e.target.value)}/></label><button type="submit">Publish notice</button></form></details>}{!notices.length&&<Panel><h4>No notices published here yet</h4><p>Administration and approved facilitators can publish notices. All signed-in participants can reply to open discussions.</p></Panel>}{notices.map(n=><Notice key={n.id} notice={n} view={view} actor={actor} run={run}/>)}</>}{actor.role==='admin'&&<details open={moderation} onToggle={e=>setModeration(e.currentTarget.open)} className="cd-moderation"><summary>Administration moderation records</summary><p>Original hidden content and moderation reasons are available here to Administration.</p>{view.notices.filter(n=>n.hidden||n.replies.some(r=>r.hidden)).map(n=><Panel key={n.id}><h4>{n.state} · {n.title}</h4>{n.hidden&&<><p className="cd-work">{n.text}</p><Moderation notice={n} hidden actor={actor} run={run}/></>}{n.replies.filter(r=>n.hidden||r.hidden).map(r=><div key={r.id}><strong>{r.authorName}</strong><p className="cd-work">{r.text}</p><Moderation notice={n} replyId={r.id} hidden={r.hidden} actor={actor} run={run}/></div>)}</Panel>)}<ol>{view.moderation.map(m=><li key={m.id}>{m.action} · {m.reason} · {date(m.at)} · {view.people.find(p=>p.id===m.actorId)?.name}</li>)}</ol></details>}</>;
}
function Notice({notice:n,view,actor,run}:{notice:BoardNotice;view:ConnectedView;actor:Person;run:CommunityRun}) {
 const [text,setText]=useState('');
 return <Panel><div className="cd-notice-status">{n.pinned&&<span className="cd-badge">Pinned</span>}{n.closed&&<span className="cd-badge">Discussion closed</span>}{noticeUnread(view,actor.id,n)&&<span className="cd-badge">Unread activity</span>}</div><h4>{n.title}</h4><p className="cd-work">{n.text}</p><small>{n.authorName} · {n.role} · {date(n.at)}</small><button className="cd-read-action" onClick={()=>run('read-notice',{noticeId:n.id,through:view.events.length},'Notice marked as read.')}>Mark notice as read</button><Moderation notice={n} actor={actor} run={run}/><section aria-label={`Replies to ${n.title}`} className="cd-replies">{n.replies.map(r=><div key={r.id}><strong>{r.authorName}</strong><small> · {r.role} · {date(r.at)}</small><p className="cd-work">{r.text}</p><Moderation notice={n} replyId={r.id} actor={actor} run={run}/></div>)}</section>{n.closed?<p>This discussion is closed. Existing replies remain readable.</p>:<form className="cd-form" onSubmit={e=>{e.preventDefault();if(run('reply-notice',{noticeId:n.id,text},'Reply published.'))setText('');}}><label>Reply to {n.title}<textarea required maxLength={3000} value={text} onChange={e=>setText(e.target.value)} rows={3}/></label><button type="submit">Publish reply</button></form>}</Panel>;
}
function Moderation({notice:n,replyId,hidden=false,actor,run}:{notice:BoardNotice;replyId?:string;hidden?:boolean;actor:Person;run:CommunityRun}) {
 const [reason,setReason]=useState(''),[action,setAction]=useState('');
 if(actor.role!=='admin')return null;
 const actions=replyId?[hidden?'restore':'hide']:[hidden?'restore':'hide',n.pinned?'unpin':'pin',n.closed?'reopen':'close'];
 return <details><summary>{replyId?'Moderate reply':'Moderate notice'}</summary><form className="cd-form" onSubmit={e=>{e.preventDefault();if(run('moderate-board',{noticeId:n.id,...(replyId?{replyId}:{}),action,reason},'Moderation recorded.')){setReason('');setAction('');}}}><label>Moderation action<select required value={action} onChange={e=>setAction(e.target.value)}><option value="">Choose action</option>{actions.map(a=><option key={a} value={a}>{a.charAt(0).toUpperCase()+a.slice(1)}</option>)}</select></label><label>Moderation reason<textarea required maxLength={3000} value={reason} onChange={e=>setReason(e.target.value)}/></label><button type="submit">Save moderation</button></form></details>;
}
