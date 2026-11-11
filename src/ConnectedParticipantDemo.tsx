import { lazy, Suspense, useEffect, useState, type FormEvent, type ReactNode } from 'react';
import type { Course } from './catalogue';
import { currentConnectedAssignment, connectedComplete, visibleThreads, chatRecipients, threadUnread, visibleConnectedEvents, visiblePeople, type ConnectedView, type Person, type ConnectedAction, type ConnectedEnrolment } from './connectedDemo';
import './connectedDemo.css';
import { publicFacilitators } from './connectedCommunity';
import { RoleHome, FacilitatorDirectory, ChoiceConfirmation, RequestHistory, PublicProfileEditor, PublicProfileReviews, HomeStateSetting, StateBoards, type FacilitatorChoice } from './ConnectedCommunityPanels';
import { boardStates } from './connectedCommunity';
import { AdministratorScreenBoundary } from './AdministratorScreenBoundary';
import { FreshDemoControl } from './FreshDemoControl';

const ConnectedLearnerMap = lazy(() => import('./ConnectedLearnerMap').then(module => ({ default: module.ConnectedLearnerMap })));

type Registration = {name:string;username:string;role:'learner'|'facilitator';goal:string;access:string;bio:string;courseIds:string[];homeState:string;publicIntroduction?:string;publicationConsent?:boolean};
type Props = {view:ConnectedView;actor:Person|null;onSignIn:(username:string,code:string)=>string|undefined;onSignOut:()=>void;onCommand:(type:ConnectedAction,payload:Record<string,unknown>)=>string|undefined;onRegister:(payload:Registration)=>{error?:string;person?:Person};choice:FacilitatorChoice|null;onChoose:(choice:FacilitatorChoice|null)=>void};
type Run = (type:ConnectedAction,payload:Record<string,unknown>,success?:string)=>boolean;
const roleName = (role:Person['role']) => role === 'admin' ? 'Administration' : role === 'facilitator' ? 'Facilitator' : 'Learner';
const date = (at:number) => new Date(at).toLocaleString('en-NG', {dateStyle:'medium', timeStyle:'short'});
function Card({children,className='',id}:{children:ReactNode;className?:string;id?:string}) {return <article id={id} tabIndex={id?-1:undefined} className={`cd-card ${className}`}>{children}</article>;}
function Badge({children}:{children:ReactNode}) {return <span className="cd-badge">{children}</span>;}
function CourseChoices({courses,chosen,setChosen}:{courses:Course[];chosen:string[];setChosen:(ids:string[])=>void}) {return <fieldset className="cd-choices"><legend>Teaching subjects</legend>{courses.filter(c=>c.status==='published').map(c=><label key={c.id}><input type="checkbox" checked={chosen.includes(c.id)} onChange={e=>setChosen(e.target.checked?[...chosen,c.id]:chosen.filter(id=>id!==c.id))}/>{c.title}</label>)}</fieldset>;}
function NoteAction({label,button,onSubmit,initial=''}:{label:string;button:string;onSubmit:(text:string)=>boolean;initial?:string}) {const [text,setText]=useState(initial);return <form className="cd-form" onSubmit={e=>{e.preventDefault();if(onSubmit(text))setText('');}}><label>{label}<textarea required value={text} onChange={e=>setText(e.target.value)} rows={3}/></label><button type="submit">{button}</button></form>;}

export default function ConnectedDemo(props:Props) {
 const {view,actor,onSignIn,onSignOut,onRegister}=props;
 const [tab,setTab]=useState('Overview');const [focusTarget,setFocusTarget]=useState('');
 const navigate=(next:string,target='cd-page-title')=>{setTab(next);setFocusTarget(target);setError('');setNotice('');};
 useEffect(()=>{if(focusTarget){document.getElementById(focusTarget)?.focus();setFocusTarget('');}},[tab,focusTarget]);
 useEffect(()=>{if(props.choice)document.getElementById('cd-choice')?.focus();},[props.choice]); const [notice,setNotice]=useState('');const [error,setError]=useState('');
 const run:Run=(type,payload,success='Saved in this sample workspace.')=>{const result=props.onCommand(type,payload);setError(result||'');setNotice(result?'':success);return !result;};
 const listings=publicFacilitators(view);
 const publishedCourseIds=view.courses.filter(c=>c.status==='published').map(c=>c.id);
 const selection=props.choice&&<ChoiceConfirmation choice={props.choice} listings={listings} actor={actor} run={run} onCancel={()=>props.onChoose(null)} onSignIn={()=>document.getElementById('cd-role-choice')?.focus()}/>;
 const feedback=<div className="cd-feedback" aria-live="polite">{error?<p role="alert" className="cd-error">{error}</p>:notice?<p role="status">{notice}</p>:null}</div>;
 if(!actor)return <div className="cd-demo"><Landing view={view} onSignIn={onSignIn} onRegister={onRegister}/></div>;
 const people=visiblePeople(view,actor.id); const name=(id:string)=>people.find(p=>p.id===id)?.name||'Participant';
 const enrolments=view.enrolments.filter(e=>actor.role==='admin'||e.learnerId===actor.id||(actor.role==='facilitator'&&actor.status==='active'&&actor.teachingCourseIds.includes(e.course.id)&&currentConnectedAssignment(view,e.learnerId,e.course.id)?.facilitatorId===actor.id));
 const threads=visibleThreads(view,actor.id);const unread=threads.reduce((n,t)=>n+threadUnread(t,actor.id),0);
 const tabs=['Overview',...(actor.role==='learner'?['My learning','Find a facilitator']:['Learners']),...(actor.role==='admin'?['Learner map','Facilitator requests','Facilitators','Courses & topics','Reports']:actor.role==='facilitator'?['Teaching profile']:[]),'Messages','Support','State noticeboards','Activity'];
 return <div className="cd-demo"><div className="cd-banner"><Badge>Sample · saved in this browser</Badge><p>Learning Sandbox. Public demonstration codes; use sample information only.</p></div><div className="cd-shell"><aside className="cd-sidebar"><div className="cd-identity"><span className="cd-avatar" aria-hidden="true">{actor.name.slice(0,1)}</span><div><strong>{actor.name}</strong><small>{roleName(actor.role)} {actor.sample?'· Sample':''}</small></div></div><nav aria-label="Connected workspace">{tabs.map(t=><button key={t} aria-current={t===tab?'page':undefined} onClick={()=>navigate(t)}>{t}{t==='Messages'&&unread>0?<span className="cd-unread" aria-label={`${unread} unread messages`}>{unread}</span>:null}</button>)}</nav><button onClick={onSignOut}>Sign out</button></aside><section className="cd-main"><header className="cd-page-heading"><p className="cd-eyebrow">{roleName(actor.role)} workspace</p><h2 id="cd-page-title" tabIndex={-1}>{tab}</h2></header>{feedback}{selection}<HomeStateSetting actor={actor} run={run}/>
 {tab==='Overview'&&<RoleHome view={view} actor={actor} navigate={navigate}/>}
 {tab==='Find a facilitator'&&actor.role==='learner'&&<><FacilitatorDirectory listings={listings} publishedCourseIds={publishedCourseIds} onChoose={props.onChoose}/><RequestHistory view={view} actor={actor} run={run}/></>}
 {tab==='Facilitator requests'&&actor.role==='admin'&&<RequestHistory view={view} actor={actor} run={run}/>}
 {tab==='Learner map'&&actor.role==='admin'&&<AdministratorScreenBoundary><Suspense fallback={<p role="status">Opening learner map…</p>}><ConnectedLearnerMap people={view.people} onOpenLearner={id=>{const enrolment=view.enrolments.find(entry=>entry.learnerId===id);navigate('Learners',enrolment?`work-${enrolment.id}`:`learner-${id}`);}}/></Suspense></AdministratorScreenBoundary>}
 {tab==='State noticeboards'&&<StateBoards view={view} actor={actor} run={run}/>}
 {tab==='My learning'&&<><p>Study any published course. Complete every lesson, score at least 70% in the quiz and receive approval for your practical work.</p>{[...view.courses.filter(c=>c.status==='published'),...enrolments.filter(e=>!view.courses.some(c=>c.id===e.course.id&&c.status==='published')).map(e=>e.course)].map(course=>{const enrolment=enrolments.find(e=>e.course.id===course.id);const retained=!view.courses.some(c=>c.id===course.id&&c.status==='published');return <Card key={course.id} id={enrolment?`course-${enrolment.id}`:undefined}><Badge>{retained?'Retained course · unavailable for new enrolment':course.tag}</Badge><h3>{course.title}</h3><p>{course.description}</p>{enrolment?<Study key={enrolment.id} enrolment={enrolment} view={view} run={run}/>:<button onClick={()=>run('enrol',{courseId:course.id},`Enrolled in ${course.title}.`)}>Enrol in {course.title}</button>}</Card>;})}</>}
 {tab==='Learners'&&<><p>{actor.role==='facilitator'?'Only your currently assigned learners and work appear here.':'Assign submitted practical work to an approved facilitator who teaches the course.'}</p>{actor.role==='admin'&&view.people.filter(p=>p.role==='learner'&&!view.enrolments.some(e=>e.learnerId===p.id)).map(p=><Card key={p.id} id={`learner-${p.id}`}><h3>{p.name}</h3>{p.sample&&<Badge>Sample learner</Badge>}<p>{p.goal||'Learning goals not provided yet.'}</p><p>Access preference: {p.access||'Not provided'}</p><Badge>Awaiting course choice</Badge><p>No enrolments yet. This learner can choose a course in their own interface; their enrolment will then be available for facilitator assignment.</p></Card>)}{enrolments.length===0&&<Card><h3>No assigned learning yet</h3><p>{actor.role==='facilitator'?'Once your teaching scope is approved, Administration can assign learner work to you.':'New learner enrolments will appear here.'}</p></Card>}{enrolments.map(enrolment=><LearnerWork key={`${enrolment.id}:${enrolment.workRevision}`} enrolment={enrolment} actor={actor} view={view} run={run} name={name}/>)}</>}
 {tab==='Facilitators'&&actor.role==='admin'&&<><PublicProfileReviews view={view} run={run}/>{view.people.filter(p=>p.role==='facilitator').map(p=><Card key={`${p.id}:${p.requestedCourseIds.join(',')}:${p.teachingReviewPending}`}><h3>{p.name} {p.sample&&<Badge>Sample</Badge>}</h3><Badge>{p.status}</Badge>{p.teachingReviewPending&&<Badge>Scope review pending</Badge>}<p>{p.bio||'No teaching biography provided.'}</p><p><strong>Approved subjects:</strong> {p.teachingCourseIds.map(id=>view.courses.find(c=>c.id===id)?.title).join(', ')||'None'}</p><p><strong>Requested subjects:</strong> {p.requestedCourseIds.map(id=>view.courses.find(c=>c.id===id)?.title).join(', ')||'None'}</p>{p.reviewNote&&<p className="cd-note">{p.reviewNote}</p>}{(p.status==='pending'||p.teachingReviewPending)&&<ReviewForm label={`Review teaching scope for ${p.name}`} onReview={(outcome,note)=>run('review-facilitator',{personId:p.id,outcome,note})}/>}</Card>)}</>}
 {tab==='Teaching profile'&&actor.role==='facilitator'&&<><PublicProfileEditor actor={actor} run={run}/><TeachingProfile actor={actor} view={view} run={run}/></>}
 {tab==='Courses & topics'&&actor.role==='admin'&&<><h3>Published learning catalogue</h3><div className="cd-course-list">{view.courses.filter(c=>c.status==='published').map(c=><Card key={c.id}><h4>{c.title}</h4><p>{c.lessons.length} lessons · {c.quiz.length} quiz questions</p></Card>)}</div><h3>Additional topic requests</h3><p>Approved topics are planning requests. They do not become published courses automatically.</p>{view.topics.length===0&&<p>No additional topic requests yet.</p>}{view.topics.map(t=><Card key={t.id}><h4>{t.title}</h4><Badge>{t.status}</Badge><p>Proposed by {name(t.facilitatorId)}</p><p>{t.description}</p>{t.reviewNote&&<p className="cd-note">{t.reviewNote}</p>}{t.status==='pending'&&<ReviewForm label={`Review topic ${t.title}`} onReview={(outcome,note)=>run('review-topic',{topicId:t.id,outcome,note})}/>}</Card>)}</>}
 {tab==='Reports'&&actor.role==='admin'&&<><p>Operational counts for this browser's sample workspace.</p><div className="cd-metrics">{[['Learners',view.people.filter(p=>p.role==='learner').length],['Active facilitators',view.people.filter(p=>p.role==='facilitator'&&p.status==='active').length],['Teaching reviews',view.people.filter(p=>p.role==='facilitator'&&(p.status!=='active'||p.teachingReviewPending)).length],['Enrolments',view.enrolments.length],['Completed courses',view.enrolments.filter(connectedComplete).length],['Support awaiting response',view.referrals.filter(r=>!r.response).length]].map(([label,count])=><div key={label}><strong>{count}</strong><span>{label}</span></div>)}</div><Card><h3>Operational directory</h3>{view.people.map(p=><div className="cd-directory" key={p.id}><strong>{p.name}</strong><span>{roleName(p.role)} · {p.status}{p.sample?' · Sample':''}</span><p>{p.goal||p.bio||'No additional profile details.'}</p><p>Access preference: {p.access||'Not provided'}</p></div>)}</Card></>}
 {tab==='Messages'&&<Messages actor={actor} view={view} run={run}/>}
 {tab==='Support'&&<Support actor={actor} view={view} run={run} name={name}/>}
 {tab==='Activity'&&<><p>Activity available to your role. Message contents stay in participant conversations.</p><ol className="cd-activity">{visibleConnectedEvents(view,actor.id).slice().reverse().map(event=><li key={event.id}><strong>{event.summary}</strong><small>{event.actorName} · {date(event.at)}</small></li>)}</ol>{visibleConnectedEvents(view,actor.id).length===0&&<p>No activity to show yet.</p>}</>}
 </section></div>{actor.role==='admin'&&<div className="cd-bottom"><FreshDemoControl/></div>}</div>;
}

function SignInRoleIcon({kind}:{kind:string}) {
 return <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
  {kind==='ada'?<><path d="M16 9C12 6 7 6 3 7v19c4-1 9-1 13 2 4-3 9-3 13-2V7c-4-1-9-1-13 2Z"/><path d="M16 9v19M7 12h5M7 17h5M20 12h5M20 17h5"/></>:kind==='amaka'?<><rect x="8" y="3" width="21" height="17" rx="2"/><path d="M13 8h11M17 12h7M20 20v7M16 28h9"/><circle cx="6" cy="20" r="3"/><path d="M1 29v-2a5 5 0 0 1 10 0v2M10 23l5-6"/></>:<><circle cx="16" cy="7" r="4"/><circle cx="6" cy="26" r="3"/><circle cx="26" cy="26" r="3"/><path d="M16 11v7M6 23v-5h20v5"/></>}
 </svg>;
}

function Landing({view,onSignIn,onRegister}:{view:ConnectedView;onSignIn:Props['onSignIn'];onRegister:Props['onRegister']}) {
 const [selectedRole,setSelectedRole]=useState<Person['role']|null>(null);
 const [username,setUsername]=useState(''),[code,setCode]=useState('');
 const [registration,setRegistration]=useState(false),[chosen,setChosen]=useState<string[]>([]);
 const [result,setResult]=useState(''),[regError,setRegError]=useState(''),[signInError,setSignInError]=useState('');
 const [focusSignIn,setFocusSignIn]=useState(false);
 const role:'learner'|'facilitator'=selectedRole==='facilitator'?'facilitator':'learner';
 useEffect(()=>{
  if(!focusSignIn||!selectedRole)return;
  const heading=document.getElementById('cd-signin');
  heading?.focus({preventScroll:true});heading?.scrollIntoView({behavior:'instant',block:'start'});
  setFocusSignIn(false);
 },[focusSignIn,selectedRole]);
 function chooseRole(person:Person){
  setSelectedRole(person.role);setUsername(person.username);setCode(person.demoCode);
  setRegistration(false);setChosen([]);setResult('');setRegError('');setSignInError('');setFocusSignIn(true);
 }
 function changeRole(){
  setSelectedRole(null);setUsername('');setCode('');setRegistration(false);setChosen([]);
  setResult('');setRegError('');setSignInError('');setFocusSignIn(false);
  const heading=document.getElementById('cd-role-choice');
  heading?.focus({preventScroll:true});heading?.scrollIntoView({behavior:'instant',block:'start'});
 }
 function signIn(e:FormEvent<HTMLFormElement>){
  e.preventDefault();
  const person=view.people.find(p=>p.username===username.trim().toLowerCase());
  if(person&&person.role!==selectedRole){setSignInError(`This profile belongs to ${roleName(person.role)}. Choose that role to continue.`);return;}
  setSignInError(onSignIn(username,code)||'');
 }
 function register(e:FormEvent<HTMLFormElement>){
  e.preventDefault();
  const data=new FormData(e.currentTarget);
  const response=onRegister({name:String(data.get('name')||''),username:String(data.get('username')||''),role,goal:String(data.get('goal')||''),access:String(data.get('access')||''),bio:String(data.get('bio')||''),courseIds:chosen,homeState:String(data.get('homeState')||''),...(role==='facilitator'?{publicIntroduction:String(data.get('publicIntroduction')||''),publicationConsent:data.get('publicationConsent')==='on'}:{})});
  setRegError(response.error||'');
  if(response.person){
   setUsername(response.person.username);setCode(response.person.demoCode);
   setResult(`Your sample profile is ready. Username: ${response.person.username}. Demo access code: ${response.person.demoCode}. Keep this code for your next visit.`);
   setRegistration(false);setSignInError('');setFocusSignIn(true);
  }
 }
 const imported=view.people.filter(p=>p.id.startsWith('existing-')&&!p.sample&&p.role===selectedRole);
 return <>
  <section className="cd-role-entry" aria-label="Choose a demo interface">
   <h2 id="cd-role-choice" tabIndex={-1}>How would you like to sign in?</h2>
   {[{id:'ada',role:'Learner',description:'Learn new skills and receive feedback.'},{id:'amaka',role:'Facilitator',description:'Teach, guide learners and review work.'},{id:'admin',role:'Administration',description:'Connect participants and manage support.'}].map(entry=>{
    const person=view.people.find(p=>p.id===entry.id)!;
    return <button className="cd-role-option" data-role={entry.id} key={entry.id} aria-label={`Use ${entry.role} interface`} aria-pressed={selectedRole===person.role} onClick={()=>chooseRole(person)}>
     <span className="cd-role-icon"><SignInRoleIcon kind={entry.id}/></span>
     <span className="cd-role-content"><strong>{entry.role}</strong><span className="cd-role-description">{entry.description}</span><span className="cd-role-continue" aria-hidden="true">Continue <span>→</span></span></span>
    </button>;
   })}
  </section>
  {selectedRole&&<section id="cd-role-options" aria-label={`${roleName(selectedRole)} sign-in options`}>
   <div className={`cd-landing-grid${selectedRole==='admin'?' cd-signin-only':''}`}>
    <Card>
     <Badge>{roleName(selectedRole)}</Badge>
     <h3 id="cd-signin" tabIndex={-1}>Sign in to your sample workspace</h3>
     <button className="cd-role-back" type="button" onClick={changeRole}>Choose a different role</button>
     {result&&<p className="cd-success" role="status">{result}</p>}
     <form className="cd-form" onSubmit={signIn}>
      <label>Username<input autoComplete="off" required value={username} onChange={e=>{setUsername(e.target.value);setSignInError('');}}/></label>
      <label>Demo access code<input type="password" autoComplete="off" required value={code} onChange={e=>{setCode(e.target.value);setSignInError('');}} aria-describedby="cd-code-hint"/></label>
      <small id="cd-code-hint">Use a public demo code, never a real password.</small>
      {signInError&&<p role="alert" className="cd-error">{signInError}</p>}
      <button type="submit">Sign in</button>
     </form>
     <details className="cd-sample-signins"><summary>Show sample sign-ins</summary><p>Available {roleName(selectedRole).toLowerCase()} profiles.</p>
      {view.people.filter(p=>p.sample&&p.role===selectedRole).map(p=><div key={p.id}><strong>{p.name}</strong><small>{p.username} / {p.demoCode}</small><button onClick={()=>{setUsername(p.username);setCode(p.demoCode);setSignInError('');}}>Use {p.name} sign-in</button></div>)}
     </details>
     {imported.map(p=><div className="cd-note" key={p.id}><strong>Your earlier {roleName(p.role).toLowerCase()} profile is available</strong><p>Username: {p.username}<br/>First-use demo code: {p.demoCode}</p><button onClick={()=>{setUsername(p.username);setCode(p.demoCode);setSignInError('');}}>Use earlier {roleName(p.role).toLowerCase()} sign-in</button></div>)}
    </Card>
    {selectedRole!=='admin'&&<Card className="cd-registration">
     <h3>Create a sample profile</h3>
     <p>{role==='learner'?'Create a learner profile to begin studying and request teaching support.':'Create a facilitator profile and request approval for your teaching subjects.'}</p>
     <button aria-expanded={registration} onClick={()=>setRegistration(!registration)}>{registration?'Close registration':`Register as a ${role}`}</button>
     {registration&&<form className="cd-form" onSubmit={register}>
      <label>Display name<input name="name" required maxLength={100}/></label>
      <label>Choose a username<input name="username" required maxLength={50} autoComplete="off"/></label>
      <label>Home state<select name="homeState" aria-label="Home state" required defaultValue=""><option value="">Choose state or FCT</option>{boardStates.map(s=><option key={s}>{s}</option>)}</select></label>
      <label>Learning or teaching goal<textarea name="goal" rows={2}/></label>
      <label>Access and learning preferences<textarea name="access" rows={2}/></label>
      {role==='facilitator'&&<>
       <label>Teaching biography<textarea name="bio" required rows={3}/></label>
       <CourseChoices courses={view.courses} chosen={chosen} setChosen={setChosen}/>
       <label>Public introduction (optional)<textarea name="publicIntroduction" maxLength={3000} rows={3}/></label>
       <label className="cd-consent"><input type="checkbox" name="publicationConsent"/>I agree to publication of my name, approved subjects, reviewed introduction and home state. Administration reviews the introduction before listing.</label>
      </>}
      {regError&&<p role="alert" className="cd-error">{regError}</p>}
      <button type="submit">Create sample profile</button>
      <small>A demo access code is generated for you.</small>
     </form>}
    </Card>}
   </div>
  </section>}
 </>;
}

function Study({enrolment:e,view,run}:{enrolment:ConnectedEnrolment;view:ConnectedView;run:Run}) {
 const [answers,setAnswers]=useState<number[]>(Array(e.course.quiz.length).fill(-1));const [work,setWork]=useState(e.work||'');const assignment=currentConnectedAssignment(view,e.learnerId,e.course.id);const facilitator=view.people.find(p=>p.id===assignment?.facilitatorId);
 return <div className="cd-study"><div className="cd-progress"><progress aria-label={`${e.course.title} lesson progress`} value={e.lessons.length} max={e.course.lessons.length}/><span>{e.lessons.length}/{e.course.lessons.length} lessons · Best quiz: {e.scores.length?Math.max(...e.scores):0}%</span><Badge>{connectedComplete(e)?'Course complete':e.review==='approved'?'Practical approved':'In progress'}</Badge></div><details><summary>Study {e.course.title}</summary>{e.course.lessons.map((lesson,i)=><details key={lesson.title} className="cd-lesson"><summary>{i+1}. {lesson.title}{e.lessons.includes(i)?' · Complete':''}</summary><p>{lesson.body}</p>{lesson.resource&&<p className="cd-note">{lesson.resource}</p>}{lesson.transcript&&<details><summary>Read lesson transcript</summary><p>{lesson.transcript}</p></details>}<button disabled={e.lessons.includes(i)} onClick={()=>run('complete-lesson',{enrolmentId:e.id,lesson:i},`Lesson ${i+1} marked complete.`)} aria-label={`Mark lesson ${i+1} complete in ${e.course.title}`}>{e.lessons.includes(i)?'Lesson complete':'Mark lesson complete'}</button></details>)}<form className="cd-form" onSubmit={event=>{event.preventDefault();run('submit-quiz',{enrolmentId:e.id,answers},'Quiz marked. Your best score is shown above.');}}><h4>{e.course.title} quiz</h4>{e.course.quiz.map((q,i)=><fieldset className="cd-choices" key={i}><legend>{i+1}. {q.question}</legend>{q.options.map((option,j)=><label key={j}><input required type="radio" name={`${e.id}-question-${i}`} checked={answers[i]===j} onChange={()=>setAnswers(previous=>previous.map((a,k)=>k===i?j:a))}/>{option}</label>)}</fieldset>)}<button type="submit">Submit {e.course.title} quiz</button></form><div className="cd-practical"><h4>Practical work</h4><p>{e.course.assignment}</p><p>Assigned facilitator: <strong>{facilitator?.name||'Awaiting assignment by Administration'}</strong></p>{e.feedback&&<p className="cd-note"><strong>Feedback ({e.review}):</strong> {e.feedback}</p>}<form className="cd-form" onSubmit={event=>{event.preventDefault();run('submit-work',{enrolmentId:e.id,text:work},'Practical work submitted. Administration can assign this revision for review.');}}><label>{e.course.title} practical submission<textarea value={work} onChange={event=>setWork(event.target.value)} required rows={5}/></label><button type="submit">{e.work?'Resubmit practical work':'Submit practical work'}</button><small>Each submission creates a new revision and needs a new assignment before review.</small></form></div></details></div>;
}

function ReviewForm({label,onReview}:{label:string;onReview:(outcome:'approved'|'needs-changes',note:string)=>boolean}) {const [note,setNote]=useState('');const [outcome,setOutcome]=useState<'approved'|'needs-changes'>('approved');return <form className="cd-form" onSubmit={e=>{e.preventDefault();if(onReview(outcome,note))setNote('');}}><label>{label}<select value={outcome} onChange={e=>setOutcome(e.target.value as typeof outcome)}><option value="approved">Approve</option><option value="needs-changes">Request changes</option></select></label><label>Review note<textarea required value={note} onChange={e=>setNote(e.target.value)} rows={3}/></label><button type="submit">Save review</button></form>;}
function LearnerWork({enrolment:e,actor,view,run,name}:{enrolment:ConnectedEnrolment;actor:Person;view:ConnectedView;run:Run;name:(id:string)=>string}) {
 const assignment=currentConnectedAssignment(view,e.learnerId,e.course.id);const eligible=view.people.filter(p=>p.role==='facilitator'&&p.status==='active'&&p.teachingCourseIds.includes(e.course.id));const [facilitator,setFacilitator]=useState('');const [note,setNote]=useState('');const learner=view.people.find(p=>p.id===e.learnerId);
 return <Card id={`work-${e.id}`}><div className="cd-card-heading"><h3>{name(e.learnerId)}</h3>{learner?.sample&&<Badge>Sample learner</Badge>}</div><h4>{e.course.title}</h4><p>{e.lessons.length}/{e.course.lessons.length} lessons · Best quiz {e.scores.length?Math.max(...e.scores):0}% · {connectedComplete(e)?'Complete':'In progress'}</p><p>Goal: {learner?.goal||'Not provided'}<br/>Access preference: {learner?.access||'Not provided'}</p><p>Facilitator: {assignment?name(assignment.facilitatorId):'Awaiting assignment'}{assignment?` · Assigned revision ${assignment.workRevision}`:''}</p>{assignment?.note&&<p className="cd-note">Assignment note: {assignment.note}</p>}<h4>Practical work · revision {e.workRevision}</h4><p className="cd-work">{e.work||'No practical work submitted yet.'}</p>{e.review&&<p className="cd-note">{e.review}: {e.feedback}</p>}{actor.role==='admin'&&<form className="cd-form" onSubmit={event=>{event.preventDefault();run('assign',{learnerId:e.learnerId,courseId:e.course.id,facilitatorId:facilitator,note});}}><label>Assign facilitator for {name(e.learnerId)} — {e.course.title}<select required value={facilitator} onChange={event=>setFacilitator(event.target.value)}><option value="">Choose an approved facilitator</option>{eligible.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label><label>Assignment note<textarea value={note} onChange={event=>setNote(event.target.value)} rows={2}/></label><button type="submit" disabled={!eligible.length}>Assign current revision</button>{!eligible.length&&<small>No approved facilitator teaches this course yet.</small>}</form>}{actor.role==='facilitator'&&e.work&&!e.review&&(assignment?.workRevision===e.workRevision?<ReviewForm key={`${e.id}:${e.workRevision}`} label={`Review ${name(e.learnerId)} — ${e.course.title} revision ${e.workRevision}`} onReview={(outcome,note)=>run('review-work',{enrolmentId:e.id,revision:e.workRevision,outcome,note})}/>:<p className="cd-note">This submission needs a fresh assignment from Administration before you can review it.</p>)}</Card>;
}

function TeachingProfile({actor,view,run}:{actor:Person;view:ConnectedView;run:Run}) {const [chosen,setChosen]=useState(actor.requestedCourseIds.length?actor.requestedCourseIds:actor.teachingCourseIds);const [bio,setBio]=useState(actor.bio);const [title,setTitle]=useState('');const [description,setDescription]=useState('');return <><Card><h3>Your teaching scope</h3><Badge>{actor.status}</Badge>{actor.teachingReviewPending&&<Badge>Review pending</Badge>}{actor.reviewNote&&<p className="cd-note">{actor.reviewNote}</p>}<form className="cd-form" onSubmit={e=>{e.preventDefault();run('request-teaching',{courseIds:chosen,bio},'Teaching scope sent to Administration for review.');}}><label>Teaching biography<textarea required value={bio} onChange={e=>setBio(e.target.value)} rows={4}/></label><CourseChoices courses={view.courses} chosen={chosen} setChosen={setChosen}/><button type="submit">Request teaching approval</button></form></Card><Card><h3>Suggest an additional topic</h3><p>Administration can approve a topic for planning. Topic approval does not publish a new course.</p><form className="cd-form" onSubmit={e=>{e.preventDefault();if(run('propose-topic',{title,description})){setTitle('');setDescription('');}}}><label>Proposed topic title<input required value={title} onChange={e=>setTitle(e.target.value)}/></label><label>Topic description and learning outcome<textarea required value={description} onChange={e=>setDescription(e.target.value)} rows={4}/></label><button type="submit">Send topic for review</button></form></Card><h3>Your topic requests</h3>{view.topics.filter(t=>t.facilitatorId===actor.id).map(t=><Card key={t.id}><h4>{t.title}</h4><Badge>{t.status}</Badge><p>{t.description}</p>{t.reviewNote&&<p className="cd-note">{t.reviewNote}</p>}</Card>)}</>;}

function Messages({actor,view,run}:{actor:Person;view:ConnectedView;run:Run}) {
 const threads=visibleThreads(view,actor.id);
 const recipients=chatRecipients(view,actor.id);
 const people=visiblePeople(view,actor.id);
 const getName=(id:string)=>people.find(p=>p.id===id)?.name||recipients.find(p=>p.id===id)?.name||'Earlier participant';
 const courseName=(id?:string)=>id?view.courses.find(c=>c.id===id)?.title||'Retained course':'Administration conversation';
 const [selectedThread,setSelectedThread]=useState('');
 const [starterRecipient,setStarterRecipient]=useState('');
 const [starterCourse,setStarterCourse]=useState('');
 const [newConversation,setNewConversation]=useState<{recipientId:string;courseId?:string}|null>(null);
 const [text,setText]=useState('');
 const starterPerson=recipients.find(p=>p.id===starterRecipient);
 const starterTeaching=!!starterPerson&&actor.role!=='admin'&&starterPerson.role!=='admin';
 const pairAssignments=(recipientId:string)=>{
  const learnerId=actor.role==='learner'?actor.id:recipientId;
  const facilitatorId=actor.role==='facilitator'?actor.id:recipientId;
  const facilitator=view.people.find(p=>p.id===facilitatorId);
  return view.assignments.filter(a=>a.learnerId===learnerId&&a.facilitatorId===facilitatorId&&facilitator?.status==='active'&&facilitator.teachingCourseIds.includes(a.courseId));
 };
 const availableCourses=starterTeaching?pairAssignments(starterRecipient):[];
 // Existing conversations open by their exact ID. A newly sent conversation is
 // resolved only by the explicitly chosen participant pair and course.
 const thread=selectedThread?threads.find(t=>t.id===selectedThread):newConversation?threads.find(t=>t.participants.includes(newConversation.recipientId)&&t.courseId===newConversation.courseId):undefined;
 const recipientId=thread?.participants.find(id=>id!==actor.id)||newConversation?.recipientId||'';
 const courseId=thread?.courseId||newConversation?.courseId;
 const recipient=recipients.find(p=>p.id===recipientId);
 const title=recipientId?getName(recipientId):'Choose a conversation';
 const canSend=!!recipient&&(!courseId||pairAssignments(recipientId).some(a=>a.courseId===courseId));
 const markRead=(id:string)=>{const existing=threads.find(t=>t.id===id);if(existing&&threadUnread(existing,actor.id)>0)run('read-thread',{threadId:id,count:existing.messages.length},'Conversation marked as read.');};
 function openThread(id:string){setSelectedThread(id);setNewConversation(null);setText('');markRead(id);}
 function startConversation(e:FormEvent<HTMLFormElement>){
  e.preventDefault();if(!starterPerson||(starterTeaching&&!availableCourses.some(a=>a.courseId===starterCourse)))return;
  const selectedCourse=starterTeaching?starterCourse:undefined;
  const existing=threads.find(t=>t.participants.includes(starterRecipient)&&t.courseId===selectedCourse);
  if(existing)openThread(existing.id);
  else{setSelectedThread('');setNewConversation({recipientId:starterRecipient,...(selectedCourse?{courseId:selectedCourse}:{})});setText('');}
 }
 return <>
  <p>Messages are visible to the participants in this sample interface. This is a local demonstration, not secure messaging. Share a separate support note when Administration needs to help.</p>
  <div className="cd-chat">
   <aside className="cd-chat-list" aria-label="Conversations">
    <h3>Conversations</h3>
    {threads.length===0&&<p>No conversations yet.</p>}
    {threads.map(t=>{const other=t.participants.find(id=>id!==actor.id)||'';const unread=threadUnread(t,actor.id);return <button key={t.id} aria-label={`Open conversation with ${getName(other)} — ${courseName(t.courseId)}`} aria-pressed={thread?.id===t.id} onClick={()=>openThread(t.id)}><strong>{getName(other)}</strong><small>{courseName(t.courseId)}</small>{unread>0&&<span className="cd-unread">{unread} unread</span>}</button>;})}
    <h4>Start a conversation</h4>
    {recipients.length===0?<p>No new recipients available.</p>:<form className="cd-form cd-chat-starter" onSubmit={startConversation}>
     <label>Conversation recipient<select required value={starterRecipient} onChange={e=>{setStarterRecipient(e.target.value);setStarterCourse('');}}><option value="">Choose a person</option>{recipients.map(p=><option key={p.id} value={p.id}>{p.name} · {roleName(p.role)}</option>)}</select></label>
     {starterTeaching&&<label>Conversation course<select required value={starterCourse} onChange={e=>setStarterCourse(e.target.value)}><option value="">Choose an assigned course</option>{availableCourses.map(a=><option key={a.courseId} value={a.courseId}>{courseName(a.courseId)}</option>)}</select></label>}
     <button type="submit" disabled={!starterPerson||(starterTeaching&&!starterCourse)}>Open selected conversation</button>
    </form>}
   </aside>
   <section className="cd-chat-window" aria-label="Message window">
    <header><h3>{title}</h3>{recipientId&&<small>{courseName(courseId)}</small>}</header>
    <div className="cd-chat-history" tabIndex={0} role="log" aria-live="polite" aria-label={`Messages with ${title}${courseId?` — ${courseName(courseId)}`:''}`}>
     {!recipientId?<p>Select a person and course, or open an existing conversation.</p>:!thread?.messages.length?<p>Your conversation starts with a message.</p>:thread.messages.map(m=><div key={m.id} className={`cd-message ${m.senderId===actor.id?'cd-message-mine':''}`}><strong>{getName(m.senderId)}</strong><p>{m.text}</p><small>{date(m.at)}</small></div>)}
    </div>
    {recipientId&&<form className="cd-form cd-composer" onSubmit={e=>{e.preventDefault();if(!canSend)return;if(run('send-message',{recipientId,text,...(courseId?{courseId}:{})},'Message sent.'))setText('');}}>
     <label>Message to {title}{courseId?` — ${courseName(courseId)}`:''}<textarea required value={text} onChange={e=>setText(e.target.value)} rows={3}/></label>
     <button type="submit" disabled={!canSend}>Send message</button>
     {!canSend&&<small>This earlier conversation remains available to its participants. New teaching messages require a current assignment for this course.</small>}
    </form>}
   </section>
  </div>
 </>;
}

function Support({actor,view,run,name}:{actor:Person;view:ConnectedView;run:Run;name:(id:string)=>string}) {
 const learners=visiblePeople(view,actor.id).filter(p=>p.role==='learner');const [learnerId,setLearnerId]=useState(actor.role==='learner'?actor.id:'');const [courseId,setCourseId]=useState('');const [note,setNote]=useState('');const referrals=view.referrals.filter(r=>actor.role==='admin'||r.learnerId===actor.id||r.facilitatorId===actor.id);
 return <><p>Support notes are explicitly shared with Administration. Conversation messages are not copied into these notes.</p>{actor.role!=='admin'&&<Card><h3>Share a support note with Administration</h3><form className="cd-form" onSubmit={e=>{e.preventDefault();if(run('refer-support',{learnerId,...(courseId?{courseId}:{}),note},'Support note shared with Administration.'))setNote('');}}>{actor.role==='facilitator'&&<label>Learner needing support<select required value={learnerId} onChange={e=>{setLearnerId(e.target.value);setCourseId('');}}><option value="">Choose an assigned learner</option>{learners.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label>}<label>Course (optional)<select value={courseId} onChange={e=>setCourseId(e.target.value)}><option value="">General support</option>{view.enrolments.filter(e=>e.learnerId===learnerId&&(actor.role==='learner'||currentConnectedAssignment(view,e.learnerId,e.course.id)?.facilitatorId===actor.id)).map(e=><option key={e.id} value={e.course.id}>{e.course.title}</option>)}</select></label><label>Support note shared with Administration<textarea required value={note} onChange={e=>setNote(e.target.value)} rows={4}/></label><button type="submit">Share support note</button></form>{actor.role==='facilitator'&&learners.length===0&&<p>No learners are currently assigned to you. You can contact Administration in Messages.</p>}</Card>}<h3>{actor.role==='admin'?'Shared support notes':'Your shared support notes'}</h3>{referrals.length===0&&<p>No support notes yet.</p>}{referrals.map(r=><Card key={r.id} id={`support-${r.id}`}><h4>{name(r.learnerId)}</h4><small>{date(r.at)}{r.courseId?` · ${view.courses.find(c=>c.id===r.courseId)?.title}`:''}</small><p className="cd-work">{r.note}</p>{r.response?<p className="cd-note"><strong>Administration response:</strong> {r.response}</p>:<Badge>Awaiting response</Badge>}{actor.role==='admin'&&!r.response&&<NoteAction label={`Administration response for ${name(r.learnerId)}`} button="Send support response" initial={r.response||''} onSubmit={text=>run('respond-support',{referralId:r.id,text})}/>}</Card>)}</>;
}
