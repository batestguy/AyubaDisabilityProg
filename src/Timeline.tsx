import { useEffect, useRef, useState } from 'react';
import { achievements, milestones, photos, sourceFor } from './showcase';
import { DocumentaryImage } from './PhotoCarousel';
import { PhotoCaption } from './ProgrammeScenes';
export function Timeline() {
 const [year,setYear]=useState('All years');
 const [selected,setSelected]=useState(milestones[0].id);
 const markers=useRef<Record<string,HTMLButtonElement|null>>({});
 const events=milestones.filter(m=>year==='All years'||m.date.startsWith(year));
 const index=events.findIndex(m=>m.id===selected);
 const event=events[index]||events[0];
 const photo=photos.find(p=>p.source===event.source);
 const caveat=achievements.find(a=>a.source===event.source)?.evidence||sourceFor(event.source).summary;
 useEffect(()=>{const marker=markers.current[selected];if(!marker)return;const strip=marker.parentElement!;if(marker.offsetLeft<strip.scrollLeft)strip.scrollLeft=marker.offsetLeft;else if(marker.offsetLeft+marker.offsetWidth>strip.scrollLeft+strip.clientWidth)strip.scrollLeft=marker.offsetLeft+marker.offsetWidth-strip.clientWidth;},[selected]);
 return <section id="milestones" className="section milestones"><p className="eyebrow">A SHORT TIMELINE</p><h2>Milestones during his tenure.</h2><p>Starting with the verified 6 August 2024 appointment. Reported activities and announced plans carry different evidence.</p>
 <div className="timeline-filters" role="group" aria-label="Timeline year">{['All years','2024','2025','2026'].map(y=><button key={y} aria-pressed={year===y} onClick={()=>{setYear(y);setSelected(milestones.find(m=>y==='All years'||m.date.startsWith(y))!.id);}}>{y}</button>)}</div>
 <div className="timeline-strip" role="group" aria-label="Milestone dates">{events.map(m=><button ref={el=>{markers.current[m.id]=el;}} key={m.id} aria-pressed={selected===m.id} aria-controls="selected-event" onClick={()=>setSelected(m.id)}><time dateTime={m.date}>{new Date(m.date+'T12:00:00Z').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'})}</time><span>{m.title}</span></button>)}</div>
 <div className="timeline-navigation"><button disabled={index<=0} onClick={()=>setSelected(events[index-1].id)}>Previous event</button><span>{index+1} / {events.length}</span><button disabled={index>=events.length-1} onClick={()=>setSelected(events[index+1].id)}>Next event</button></div>
 <article id="selected-event" className="timeline-event" aria-live="polite" aria-atomic="true"><div><time dateTime={event.date}>{event.date}</time><span className="activity-status">{event.status}</span><h3>{event.title}</h3><p>{event.text}</p><p><b>Evidence caveat:</b> {caveat}</p><a href={sourceFor(event.source).url} target="_blank" rel="noreferrer">Source ↗</a></div>{photo&&<figure><DocumentaryImage photo={photo}/><PhotoCaption photo={photo}/></figure>}</article>
 </section>;
}
