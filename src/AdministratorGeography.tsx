import { useEffect, useRef, useState } from 'react';
import type { SharedDemoSession } from './sharedDemo';
import { learnerRows, type LearnerRow, type ReportScope } from './reportingDemo';
import { areaViewBox, geographyCounts, locateLearner, validNigeriaAtlas, type NigeriaAtlas, type MapArea } from './geographyDemo';

export function AdministratorGeography({ session, onOpenUserRecord }: { session: SharedDemoSession; onOpenUserRecord: () => void }) {
 const [atlas,setAtlas]=useState<NigeriaAtlas>();
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState('');
 const [attempt,setAttempt]=useState(0);
 const [stateId,setStateId]=useState('');
 const [lgaId,setLgaId]=useState('');
 const [unmatched,setUnmatched]=useState(false);
 const [scope,setScope]=useState<ReportScope>('all');
 const [search,setSearch]=useState('');
 const [ready,setReady]=useState('all');
 const [sample,setSample]=useState<LearnerRow>();
 const [navigation,setNavigation]=useState(0);
 const heading=useRef<HTMLHeadingElement>(null);
 useEffect(()=>{
  const controller=new AbortController(); setLoading(true);setError('');
  fetch('/nigeria-admin-map.json',{signal:controller.signal}).then(r=>{if(!r.ok)throw new Error('Map unavailable');return r.json();}).then(data=>{if(!validNigeriaAtlas(data))throw new Error('Map data failed validation');setAtlas(data);setLoading(false);}).catch(e=>{if(!controller.signal.aborted){setError(e.message);setLoading(false);}});
  return ()=>controller.abort();
 },[attempt]);
 useEffect(()=>{if(navigation)heading.current?.focus();},[navigation]);
 const rows=learnerRows(session).filter(r=>(scope==='all'||(scope==='user'?r.source==='user':r.source==='sample'))&&(ready==='all'||(ready==='ready'?r.onboarded:!r.onboarded)));
 const counts=atlas?geographyCounts(atlas,rows):undefined;
 const state=atlas?.states.find(s=>s.id===stateId);
 const lga=state?.lgas.find(l=>l.id===lgaId);
 const areas:MapArea[]=state?state.lgas:atlas?.states??[];
 const viewBox=state?areaViewBox(areas):atlas?`0 0 ${atlas.width} ${atlas.height}`:'';
 const markerScale=state?Number(viewBox.split(' ')[2]):0;
 const shown=rows.filter(r=>{
  if(!atlas)return true;
  const located=locateLearner(atlas,r);
  return unmatched?!located.lga:lga?located.lga?.id===lga.id:state?located.state?.id===state.id:true;
 }).filter(r=>[r.name,r.state,r.lga].join(' ').toLowerCase().includes(search.trim().toLowerCase()));
 function navigate(nextState='',nextLga='',unknown=false){setStateId(nextState);setLgaId(nextLga);setUnmatched(unknown);setSample(undefined);setNavigation(n=>n+1);}
 const locationTitle=sample?'Fictional sample profile':unmatched?'Unmatched or missing LGA':lga?`${state!.name} · ${lga.name}`:state?`${state.name} · Local government areas`:'Nigeria · Learners by location';
 return <><p>Click a state, then an LGA, to see recorded learner profiles. Counts describe this local demo; they are not population estimates or programme impact.</p><div className="ma-filters"><label>Geographic data scope<select aria-label="Geographic data scope" value={scope} onChange={e=>{setScope(e.target.value as ReportScope);setSample(undefined);}}><option value="all">User profile and loaded fictional samples</option><option value="user">User-created profile only</option><option value="samples">Fictional sample profiles only</option></select></label><label>Geographic profile status<select aria-label="Geographic profile status" value={ready} onChange={e=>setReady(e.target.value)}><option value="all">All profile statuses</option><option value="ready">Profile ready</option><option value="incomplete">Profile incomplete</option></select></label></div>
  <nav className="ma-breadcrumbs" aria-label="Geographic drill-down"><button onClick={()=>navigate()}>Nigeria</button>{state&&<button onClick={()=>navigate(state.id)}>{state.name}</button>}{lga&&<button onClick={()=>navigate(state!.id,lga.id)}>{lga.name}</button>}</nav><h3 ref={heading} tabIndex={-1}>{locationTitle}</h3>
  {sample?<section className="mp-card"><h4>{sample.name}</h4><p>Fictional sample profile · {sample.onboarded?'Profile ready':'Profile incomplete'}</p><p>Recorded state: {sample.state} · LGA: {sample.lga}</p><p>This explicitly loaded example has no enrolments, assessments, support decisions or real contact details.</p><button onClick={()=>{setSample(undefined);setNavigation(n=>n+1);}}>Back to geographic learners</button></section>:<>
  {loading&&<p role="status">Loading local Nigeria map…</p>}{error&&<section className="mp-error"><p role="alert">{error}. The recorded learner list remains available.</p><button onClick={()=>setAttempt(n=>n+1)}>Retry loading map</button></section>}
  {atlas&&<><div className="ma-filters"><label>Choose state or FCT<select aria-label="Choose state or FCT" value={stateId} onChange={e=>navigate(e.target.value)}><option value="">All Nigeria</option>{atlas.states.map(s=><option key={s.id} value={s.id}>{s.name} ({counts?.states[s.id]??0} profiles)</option>)}</select></label>{state&&<label>Choose LGA<select aria-label="Choose LGA" value={lgaId} onChange={e=>navigate(state.id,e.target.value)}><option value="">All {state.name} LGAs</option>{state.lgas.map(a=><option key={a.id} value={a.id}>{a.name} ({counts?.lgas[a.id]??0} profiles)</option>)}</select></label>}</div>
   {!unmatched&&<div className="ma-map-wrap"><svg className="ma-nigeria-map" role="group" aria-label={state?`${state.name} LGA map`:'Nigeria state map'} viewBox={viewBox}>
    {areas.map(a=>{const total=(state?counts?.lgas[a.id]:counts?.states[a.id])??0;const chosen=lgaId===a.id;return <g key={a.id}><path role="button" tabIndex={0} aria-label={`${a.name}: ${total} learner profile${total===1?'':'s'}`} aria-pressed={chosen} className={`ma-map-area ${total?'has-learners':''} ${chosen?'is-selected':''}`} fill={total>1?'#255775':total===1?'#88b2a0':'#eff3ed'} d={a.path} fillRule="evenodd" vectorEffect="non-scaling-stroke" onClick={()=>state?navigate(state.id,a.id):navigate(a.id)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();state?navigate(state.id,a.id):navigate(a.id);}}}><title>{a.name} · {total} profiles</title></path>{total>0&&<g aria-hidden="true" pointerEvents="none"><circle cx={a.center[0]} cy={a.center[1]} r={state?Math.max(1,markerScale*.022):9} fill="#173f36"/><text x={a.center[0]} y={a.center[1]} dy=".35em" textAnchor="middle" fill="white" fontSize={state?Math.max(2,markerScale*.027):12}>{total}</text></g>}</g>;})}
   </svg><p className="ma-map-legend"><span>Light: 0 profiles</span><span>Green: 1 profile</span><span>Blue: 2 or more profiles</span> · Counts are also shown in the selectors and lists.</p></div>}
   <p className="mp-muted">Administrative boundaries: GRID3 via <a href="https://www.geoboundaries.org/api/current/gbOpen/NGA/ADM2/" target="_blank" rel="noreferrer">geoBoundaries</a>, represented year 2022; <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>. Simplified for display; no home coordinates are shown.</p><div className="mp-actions"><button onClick={()=>navigate('','',true)}>View unmatched or missing LGA ({counts?.unmatched.length??0})</button>{unmatched&&<button onClick={()=>navigate()}>Return to Nigeria map</button>}</div>
  </>}
  <label className="mp-field">Search geographic learners<input type="search" value={search} onChange={e=>setSearch(e.target.value)} /></label><p role="status">{shown.length} learner profile{shown.length===1?'':'s'} shown. {scope==='samples'?'Fictional examples only.':`${rows.filter(r=>r.source==='user').length} User-created, ${rows.filter(r=>r.source==='sample').length} fictional samples in the selected scope.`}</p>
  {!shown.length&&<section className="mp-card"><h4>No matching learner profiles</h4><p>Select another location or clear the search/status filters. Load fictional examples explicitly in Demo settings to explore a cohort.</p><button onClick={()=>{setSearch('');setReady('all');}}>Clear geographic filters</button></section>}{shown.map(r=><article className="ma-learner" key={r.id}><h4>{r.name}</h4><p>{r.source==='sample'?'Fictional sample profile':'User-created demo profile'} · {r.onboarded?'Profile ready':'Profile incomplete'}</p><p>{r.state||'State not recorded'} · {r.lga||'LGA not recorded'}</p>{atlas&&!locateLearner(atlas,r).lga&&<p>LGA is missing or does not match the recorded state. This profile is retained in the unmatched list.</p>}<button onClick={()=>r.source==='user'?onOpenUserRecord():(setSample(r),setNavigation(n=>n+1))}>View learner: {r.name}</button></article>)}
  </>}
 </>;
}
