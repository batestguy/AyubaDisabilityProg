import { useState } from 'react';
import { startFreshDemo } from './freshDemoReset';
import { clearUserFiles } from './MosaicUserDemo';

// Intent: presenters start again deliberately. Existing warm surfaces/native controls,
// body-sized copy and 16px gaps keep the destructive scope clear before confirmation.
export function FreshDemoControl() {
 const [confirming,setConfirming]=useState(false),[error,setError]=useState('');
 function reset() {
  try {
   const result=startFreshDemo(window.localStorage,window.sessionStorage);
   if(result.error){setError(result.error);return;}
   clearUserFiles();
   const url=new URL(window.location.href);
   url.searchParams.delete('workspace');url.searchParams.set('demo','connected');url.hash='';
   window.location.replace(url);
  } catch {setError('Browser storage is unavailable. The fresh start could not be completed.');}
 }
 return <details className="fresh-demo-controls"><summary>Demo controls</summary><p>Start again with the learner, facilitator and Administration sample identities and the course catalogue.</p><button onClick={()=>{setConfirming(true);setError('');}}>Start a fresh demo</button>{confirming&&<section aria-label="Fresh demo confirmation"><h2>Clear demo activity and start again?</h2><p>This clears registered participants, imported profiles, enrolments, progress, submissions, assignments, messages, support requests, noticeboards and history. It also clears this tab’s earlier demo, guided-example history, legacy backup and temporary attachments.</p><p>The five permanent sample identities and eight courses remain available. They start with no enrolments, assignments or messages. This affects this app’s records in this browser origin and tab; other tabs may retain their own earlier sessions.</p><div className="mp-actions"><button onClick={reset}>Clear demo activity and start fresh</button><button onClick={()=>{setConfirming(false);setError('');}}>Keep current demo</button></div>{error&&<p role="alert">{error}</p>}</section>}</details>;
}
