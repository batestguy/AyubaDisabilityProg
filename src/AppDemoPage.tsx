import { useRef, useState } from 'react';
export function AppDemoPage() {
 const roles=['User','Administration','Facilitator'];
 const [active,setActive]=useState(0);
 const tabs=useRef<(HTMLButtonElement|null)[]>([]);
 return <div className="showcase"><section className="section"><p className="eyebrow">APP DEMO</p><h1>Choose your role.</h1><p>Select User, Administration or Facilitator. These spaces will grow with the next app features.</p> <div role="tablist" aria-label="App roles" className="role-tabs">{roles.map((role,i)=><button key={role} ref={el=>{tabs.current[i]=el;}} role="tab" id={`role-${i}`} aria-controls={`role-panel-${i}`} aria-selected={active===i} tabIndex={active===i?0:-1} onClick={()=>setActive(i)} onKeyDown={e=>{let next=i;if(e.key==='ArrowRight')next=(i+1)%3;else if(e.key==='ArrowLeft')next=(i+2)%3;else if(e.key==='Home')next=0;else if(e.key==='End')next=2;else return;e.preventDefault();setActive(next);tabs.current[next]?.focus();}}>{role}</button>)}</div>
 {roles.map((role,i)=><div key={role} role="tabpanel" id={`role-panel-${i}`} aria-labelledby={`role-${i}`} tabIndex={0} hidden={active!==i} className="empty-role-panel"/>)}
</section></div>;
}
