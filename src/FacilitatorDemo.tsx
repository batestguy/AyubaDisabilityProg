import { useRef, useState } from 'react';
import type { SharedDemoSession } from './sharedDemo';
import { facilitatorAssignments } from './facilitatorAssignments';
import { demoDate } from './administratorMetrics';
import { enrolmentCourse, type Enrolment } from './store';
import './administratorDemo.css';

const views = ['Overview', 'Assigned courses', 'Practical submissions', 'Learning questions'] as const;
type View = typeof views[number];

export function FacilitatorDemo({ session, onOpenAdministration }: { session: SharedDemoSession; onOpenAdministration: () => void }) {
 const [identity, setIdentity] = useState('');
 const [view, setView] = useState<View>('Overview');
 const [search, setSearch] = useState('');
 const [filter, setFilter] = useState('all');
 const [menu, setMenu] = useState(false);
 const heading = useRef<HTMLHeadingElement>(null);
 const roster = session.reviews?.roster ?? [];
 const selected = roster.find(r => r.id === identity);
 const assigned = facilitatorAssignments(session, identity);
 const kind = view === 'Assigned courses' ? 'course' : view === 'Practical submissions' ? 'enrolment' : 'question';
 function navigate(next: View) { setView(next); setSearch(''); setFilter('all'); setMenu(false); requestAnimationFrame(() => heading.current?.focus()); }
 const title = (recordKind: string, id: string) => {
  const enrolment = session.user.learning.enrolments.find(e => e.id === id);
  const question = session.user.learning.requests.find(q => q.id === id);
  return (enrolment ? enrolmentCourse(session.user.learning, enrolment) : session.user.learning.courses.find(c => c.id === (recordKind === 'course' ? id : question?.courseId)))?.title ?? 'Course unavailable';
 };
 const visible = assigned.filter(({ assignment: a, stale }) => a.kind === kind && (filter === 'all' || (filter === 'stale' ? stale : !stale)) && `${title(a.kind, a.recordId)} ${session.user.profile.name}`.toLowerCase().includes(search.trim().toLowerCase()));
 return <div className={`mp-demo ma-demo ${session.user.profile.access.includes('Larger text') ? 'mp-large' : ''}`} lang="en">
  <div className="mp-brand"><img src="/mosaic-pathways-symbol.svg" width="52" height="52" alt="" /><span>Mosaic Pathways<small>Facilitator · Listen. Guide. Review.</small></span></div>
  <div className="mp-workspace"><aside className="mp-sidebar"><p className="mp-user">Facilitator<small>Assigned learning workspace</small></p>
   <button className="mp-menu-toggle" aria-expanded={menu} aria-controls="mf-navigation" onClick={() => setMenu(!menu)}>Facilitator menu</button>
   <nav id="mf-navigation" aria-label="Facilitator" className={menu ? 'is-open' : ''}>{views.map(item => <button key={item} aria-current={view === item ? 'page' : undefined} onClick={() => navigate(item)}>{item}</button>)}</nav>
   <p className="mp-muted">Local demo. Identity selection is simulated; there are no verified accounts.</p>
  </aside><section className="mp-content"><p className="eyebrow">FACILITATOR · WAVE 1</p><h2 ref={heading} tabIndex={-1}>{view === 'Overview' ? 'Facilitator overview' : view}</h2>
   <label className="mp-field">Demo facilitator identity<select value={selected ? identity : ''} onChange={e => { setIdentity(e.target.value); navigate('Overview'); }}><option value="">Choose an approved demo trainer</option>{roster.map(r => <option key={r.id} value={r.id}>{session.user.profile.name} · {r.skill}</option>)}</select></label>
   {!roster.length ? <section className="mp-card"><h3>No approved demo trainers yet</h3><p>Submit a teaching application in User, then review it in Administration. An approved application creates a simulated mentoring roster entry.</p><button onClick={onOpenAdministration}>Open Administration</button></section> : !selected ? <section className="mp-card"><h3>Choose your demo identity</h3><p>Select an approved trainer to inspect the learning records assigned to them.</p></section> : <div key={`${identity}:${view}`}>
    <p>{selected.skill} · Demo mentoring only. Approval does not verify professional qualifications.</p>
    {view === 'Overview' ? <><section className="ma-next"><p className="eyebrow">YOUR TEACHING WORKSPACE</p><h3>Start with the assigned evidence.</h3><p>Administration coordinates assignments. Review the learner’s retained course requirements and check whether the assigned evidence is still current.</p></section>
     <div className="ma-metrics" aria-label="Selected facilitator assignments">{views.slice(1).map((item, i) => <article key={item}><p>{item}</p><strong>{assigned.filter(a => a.assignment.kind === ['course', 'enrolment', 'question'][i]).length}</strong><button onClick={() => navigate(item)}>View {item.toLowerCase()}</button></article>)}</div>
     {!assigned.length && <p>No assignments yet. Administration can assign a course, submitted practical work or unanswered learning question to this demo trainer.</p>}
     <p>{assigned.filter(a => a.stale).length} assignments have changed evidence and need coordination.</p>
    </> : <><div className="ma-filters"><label>Search assigned learning<input type="search" value={search} onChange={e => setSearch(e.target.value)} /></label><label>Assignment evidence<select aria-label="Assignment evidence" value={filter} onChange={e => setFilter(e.target.value)}><option value="all">All assignments</option><option value="current">Current evidence</option><option value="stale">Changed evidence</option></select></label></div><p role="status">{visible.length} assignments shown.</p>
     {!visible.length && <section className="mp-card"><h3>No matching assignments</h3><p>Clear the filters or ask Administration to coordinate this type of learning record.</p><button onClick={() => { setSearch(''); setFilter('all'); }}>Clear assignment filters</button></section>}
     {visible.map(({ assignment: a, stale }) => {
      const e = session.user.learning.enrolments.find(x => x.id === a.recordId);
      const q = session.user.learning.requests.find(x => x.id === a.recordId);
      const c = e ? enrolmentCourse(session.user.learning, e) : session.user.learning.courses.find(x => x.id === (a.kind === 'course' ? a.recordId : q?.courseId));
      const snapshot = session.submissions.find(x => x.id === a.submissionId);
      const evidence = snapshot?.payload as Enrolment | undefined;
      return <article className="mp-card" key={a.id}><h3>{title(a.kind, a.recordId)}</h3><p>{a.kind === 'course' ? 'Course review assignment' : `Learner: ${session.user.profile.name || 'Unnamed learner'}`} · {demoDate(a.at)}</p>
       <p className={stale ? 'mp-error' : 'ma-readonly'}>{stale ? 'Evidence changed since assignment. Ask Administration to assign the latest evidence.' : 'Assigned evidence is current.'}</p>
       <p><strong>Suitability and access approach:</strong> {a.suitabilityNote}</p><p><strong>Coordination reason:</strong> {a.reason}</p>
       {a.kind === 'enrolment' && <><p>{e?.completedAt ? 'Demo course completed' : e?.approved ? 'Practical approved; other learning gates may remain' : 'Practical awaiting trainer review'}</p><details><summary>Inspect assigned practical evidence</summary><p className="mp-work">{evidence?.submitted || 'Assigned text unavailable.'}</p><p>Submission recorded: {demoDate(snapshot?.recordedAt ?? a.at)}. This is the assigned snapshot.</p></details>{e?.feedback && <p><strong>Recorded feedback:</strong> {e.feedback}</p>}</>}
       {a.kind === 'question' && <details><summary>Inspect learning question</summary><p className="mp-work">{q?.text}</p>{q?.reply ? <p><strong>Recorded reply:</strong> {q.reply}</p> : <p>Awaiting a trainer reply.</p>}</details>}
       {c && <details><summary>{e ? 'Retained course requirements' : 'Inspect course requirements'}</summary><p>{c.description}</p><p>{c.outcome}</p><p><strong>Practical assignment:</strong> {c.assignment}</p><p>Tools: {c.tools?.join(', ') || 'None specified'}</p>{c.delivery === 'foundation' && <p className="ma-foundation">Foundation planning and role play. This does not certify observed trade competence.</p>}{c.lessons.map((l, i) => <article key={i}><h4>{i + 1}. {l.title}</h4><p className="mp-work">{l.body}</p></article>)}</details>}
      </article>;
     })}
    </>}
    <p className="ma-boundary">This first wave supports inspection. Trainer feedback, practical decisions and question replies follow in the next wave.</p>
   </div>}
  </section></div>
 </div>;
}
