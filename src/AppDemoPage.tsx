import { useEffect, useRef, useState } from 'react';
import { UserDemo, clearUserFiles, type WorkSubmissionIntent } from './MosaicUserDemo';
import { AdministratorDemo } from './AdministratorDemo';
import { freshSharedDemo, loadSharedDemo, resetSharedDemo, saveSharedDemo, updateSharedDemo } from './sharedDemo';
import { decideReview, respondToTeaching, respondToSupport, type ReviewDecisionInput } from './reviewDemo';
import { decideCourse, assignLearning, saveCourseDraft, type CourseDecisionInput, type LearningAssignmentInput, type CourseDraftInput } from './coordinationDemo';
import { recordOutcome, acknowledgeOutcome, type OutcomeInput } from './scorecardDemo';
import { loadSampleCohort } from './reportingDemo';
import type { TeachingInput } from './userDemo';
import type { SharedDemoSession } from './sharedDemo';
import type { Demo } from './userDemo';

export function AppDemoPage() {
 const roles = ['User', 'Administration', 'Facilitator'];
 const [active, setActive] = useState(0);
 const [loaded, setLoaded] = useState(loadSharedDemo);
 const [session, setSession] = useState(loaded.session);
 const latest = useRef(session);
 const commit = (next: SharedDemoSession) => { latest.current = next; setSession(next); };
 const [storageOk, setStorageOk] = useState(loaded.storageOk);
 const [resetting, setResetting] = useState(false);
 const [resetError, setResetError] = useState('');
 const tabs = useRef<(HTMLButtonElement | null)[]>([]);
 useEffect(() => {
  if (!loaded.recovery && !loaded.memoryOnly) setStorageOk(saveSharedDemo(session));
 }, [session, loaded.recovery, loaded.memoryOnly]);
 function change(next: Demo, intent?: WorkSubmissionIntent) {
  if (!loaded.recovery) commit(updateSharedDemo(latest.current, next, intent));
 }
 function command(result: { session: SharedDemoSession; error?: string }) {
  if (loaded.recovery) return "Recover the saved demo before reviewing.";
  if (!result.error) commit(result.session);
  return result.error;
 }
 const loadSamples = () => command({ session: loadSampleCohort(latest.current) });
 const outcome = (input: OutcomeInput) => command(recordOutcome(latest.current, input));
 const receipt = (updateId: string, note: string) => command(acknowledgeOutcome(latest.current, updateId, note));
 const review = (input: ReviewDecisionInput) => command(decideReview(latest.current, input));
 const courseDecision = (input: CourseDecisionInput) => command(decideCourse(latest.current, input));
 const assignment = (input: LearningAssignmentInput) => command(assignLearning(latest.current, input));
 const courseDraft = (input: CourseDraftInput) => command(saveCourseDraft(latest.current, input));
 const teachingResponse = (input: TeachingInput, response: string) => command(respondToTeaching(latest.current, input, response));
 const supportResponse = (response: string) => command(respondToSupport(latest.current, response));
 function reset() {
  if (!resetSharedDemo()) {
   setResetError('Could not clear saved demo records. Retry when session storage is available.');
   return false;
  }
  clearUserFiles();
  const next = freshSharedDemo();
  commit(next); setLoaded({ session: next, storageOk: true });
  setResetting(false); setResetError('');
  return true;
 }
 function retry() {
  const next = loadSharedDemo();
  setLoaded(next); commit(next.session); setStorageOk(next.storageOk); setResetError('');
 }
 function retrySaving() {
  const saved = saveSharedDemo(session);
  setStorageOk(saved);
  if (saved) setLoaded({ session, storageOk: true });
 }
 function openUser() { setActive(0); tabs.current[0]?.focus(); }
 return <div className="showcase"><section className="section"><p className="eyebrow">APP DEMO</p><h1>Choose your role.</h1>
  <p>Start your Mosaic Pathways journey in User. Administration shows the same learning records. Facilitator follows later.</p>
  {!storageOk && <div className="mp-error"><p role="alert">Session storage is unavailable or could not be verified. Your changes remain in memory; reload may lose progress. {loaded.warning}</p>{!loaded.recovery && <button onClick={retrySaving}>Retry saving this session</button>}</div>}
  {loaded.recovery && <section className="mp-card" aria-label="Demo session recovery"><h2>Saved demo needs attention</h2><p role="alert">{loaded.recovery}</p><p>Your saved records have not been replaced. Retry loading, or explicitly reset this demo to start again. The separate learning sandbox is preserved.</p>
   <div className="mp-actions"><button onClick={retry}>Retry loading saved demo</button><button onClick={() => setResetting(!resetting)} aria-expanded={resetting}>Reset saved demo</button></div>
   {resetting && <div><p>Clear this shared demo’s saved profile, progress, requests, course drafts, reviewer assignments, scorecards, support provision/receipt, grants, follow-up, history, fictional geographic profiles, migration backup and temporary files? The separate learning sandbox is preserved.</p><button onClick={reset}>Confirm reset saved demo</button><button onClick={() => setResetting(false)}>Keep saved records</button></div>}
  </section>}
  {resetError && <p role="alert" className="mp-error">{resetError}</p>}
  <div role="tablist" aria-label="App roles" className="role-tabs">{roles.map((role, i) => <button key={role} ref={el => { tabs.current[i] = el; }} role="tab" id={`role-${i}`} aria-controls={`role-panel-${i}`} aria-selected={active === i} tabIndex={active === i ? 0 : -1} onClick={() => setActive(i)} onKeyDown={e => {
   let next = i;
   if (e.key === 'ArrowRight') next = (i + 1) % 3;
   else if (e.key === 'ArrowLeft') next = (i + 2) % 3;
   else if (e.key === 'Home') next = 0;
   else if (e.key === 'End') next = 2;
   else return;
   e.preventDefault(); setActive(next); tabs.current[next]?.focus();
  }}>{role}</button>)}</div>
  {roles.map((role, i) => <div key={role} role="tabpanel" id={`role-panel-${i}`} aria-labelledby={`role-${i}`} tabIndex={0} hidden={active !== i} className={i < 2 ? 'user-role-panel' : 'empty-role-panel'}>
   {!loaded.recovery && i === 0 && <UserDemo demo={session.user} active={active === 0} onChange={change} onReset={reset} session={session} onTeachingResponse={teachingResponse} onSupportResponse={supportResponse} onReceipt={receipt} />}
   {!loaded.recovery && i === 1 && <AdministratorDemo session={session} active={active === 1} onOpenUser={openUser} onDecide={review} onLoadSamples={loadSamples} onReset={reset} onCourseDecision={courseDecision} onAssignment={assignment} onCourseDraft={courseDraft} onOutcome={outcome} onReceipt={receipt} />}
  </div>)}
 </section></div>;
}
