import { useEffect, useRef, useState, lazy, Suspense, type ReactNode } from 'react';
import type { SharedDemoSession } from './sharedDemo';
import { USER_LEARNER_ID, type SupportItem } from './userDemo';
import { categoryTitle, skillCategories } from './skillCategories';
import { administratorCounts, demoDate, matchesLearner } from './administratorMetrics';
import { AdministratorReviews } from './AdministratorReviews';
import { reviewRecord, reviewStatusLabel, type ReviewDecisionInput } from './reviewDemo';
import { AdministratorCoordination, type CoordinationCallbacks } from './AdministratorCoordination';
const AdministratorGeography = lazy(() => import('./AdministratorGeography').then(m => ({ default: m.AdministratorGeography })));
const AdministratorReports = lazy(() => import('./AdministratorReports').then(m => ({ default: m.AdministratorReports })));
import { AdministratorScreenBoundary } from './AdministratorScreenBoundary';
import { LearnerScorecard, LearnerProgress, type ScorecardCallbacks } from './LearnerScorecard';
import './administratorDemo.css';

type View = 'Overview' | 'Learners' | 'Learner progress' | 'Detail' | 'Trainer applications' | 'Support requests' | 'Trainer roster' | 'Courses' | 'Learning oversight' | 'Learner map' | 'Reports' | 'Activity history' | 'Demo settings';
type DetailSection = 'scorecard' | 'profile' | 'learning' | 'portfolio' | 'support' | 'teaching';
function Values({ items }: { items: { label: string; value: ReactNode }[] }) {
 return <dl className="ma-values">{items.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.value || 'Not recorded'}</dd></div>)}</dl>;
}

export function AdministratorDemo({ session, active, onOpenUser, onDecide, onLoadSamples, onReset, onOutcome, onReceipt, ...coordination }: CoordinationCallbacks & ScorecardCallbacks & { session: SharedDemoSession; active: boolean; onOpenUser: () => void; onLoadSamples: () => string | undefined; onReset: () => boolean; onDecide: (input: ReviewDecisionInput) => string | undefined }) {
 const demo = session.user;
 const p = demo.profile;
 const counts = administratorCounts(demo);
 const supportReview = reviewRecord(session, 'support');
 const teachingReview = reviewRecord(session, 'teaching');
 counts.support = supportReview && ['pending', 'resubmitted'].includes(supportReview.status) ? 1 : 0;
 counts.teaching = teachingReview && ['pending', 'resubmitted'].includes(teachingReview.status) ? 1 : 0;
 const [view, setView] = useState<View>('Overview');
 const [menu, setMenu] = useState(false);
 const [search, setSearch] = useState('');
 const [filter, setFilter] = useState<'all' | 'incomplete' | 'ready'>('all');
 const [target, setTarget] = useState<DetailSection>('profile');
 const [navigation, setNavigation] = useState(0);
 const heading = useRef<HTMLHeadingElement>(null);
 const sections = useRef<Partial<Record<DetailSection, HTMLHeadingElement | null>>>({});
 const visible = matchesLearner(demo, search, filter);
 const detail = view === 'Detail' && counts.learners > 0;
 const entries = demo.learning.enrolments.filter(e => e.learnerId === USER_LEARNER_ID);
 useEffect(() => {
  if (!active || navigation === 0) return;
  const focus = detail ? sections.current[target] : heading.current;
  focus?.focus();
 }, [navigation, view, target]);
 function navigate(next: View, section: DetailSection = 'profile') {
  setView(next); setTarget(section); setMenu(false); setNavigation(n => n + 1);
 }
 const snapshots = (kind: 'support' | 'teaching') => session.submissions.filter(s => s.kind === kind);

 function overview() {
  const metrics = [
   ['Learners', counts.learners, 'profile'], ['Course enrolments', counts.enrolments, 'learning'],
   ['Completed courses', counts.completed, 'learning'], ['Practical work awaiting review', counts.practical, 'learning'],
   ['Unanswered learning questions', counts.questions, 'learning'], ['Support requests pending review', counts.support, 'support'],
   ['Trainer applications pending review', counts.teaching, 'teaching'],
  ] as const;
  return <><section className="ma-next"><p className="eyebrow">YOUR NEXT COORDINATION STEP</p><h3>{counts.learners ? 'Understand this learner’s pathway.' : 'Start with a learning profile.'}</h3>
   <p>{counts.learners ? `${p.name} · ${demo.onboarded ? 'Profile ready' : 'Profile incomplete'}. View learning progress, access preferences and submitted requests before later reviews.` : 'Create a profile in User, or use the existing sample-profile option. Its records will appear here immediately.'}</p>
   <button className="primary" onClick={() => counts.learners ? navigate('Detail') : onOpenUser()}>{counts.learners ? 'View learner' : 'Open User to create a profile'}</button>
  </section>
  <div className="ma-metrics" aria-label="Current demo totals">{metrics.map(([label, total, section]) => <article key={label}><p>{label}</p><strong>{total}</strong>{counts.learners > 0 && <button onClick={() => section === 'support' ? navigate('Support requests') : section === 'teaching' ? navigate('Trainer applications') : navigate('Detail', section)}>View {label.toLowerCase()}</button>}</article>)}</div>
  <section className="ma-boundary"><h3>Learning and review, at a glance</h3><p><strong>{counts.availableCourses} seed courses available</strong> across four skill areas. Counts above use this tab’s current records, including profiles still in onboarding.</p><p>Review applications and support plans in their queues. All decisions are simulated. Practical assessment belongs to trainers; Administration does not approve learning work here.</p><p>Foundation learning records written planning and role play. Staff-recorded support/grants and User receipt acknowledgements appear in individual scorecards. They do not verify actual delivery, observed trade competence or employment outcomes.</p></section></>;
 }
 function learners() {
  return <><p>Find the profile created in User. This wave has one learner and does not add a fictional cohort.</p><div className="ma-filters">
   <label>Search learners by name or location<input type="search" value={search} onChange={e => setSearch(e.target.value)} /></label>
   <label>Profile status<select aria-label="Profile status" value={filter} onChange={e => setFilter(e.target.value as typeof filter)}><option value="all">All profiles</option><option value="incomplete">Profile incomplete</option><option value="ready">Profile ready</option></select></label>
  </div><p role="status">{visible ? '1 learner shown.' : '0 learners shown.'}</p>
  {!counts.learners ? <section className="mp-card"><h3>No learner profile yet</h3><p>Records appear after a display name is entered in User.</p><button onClick={onOpenUser}>Open User to create a profile</button></section> : !visible ? <section className="mp-card"><h3>No matching learner</h3><p>Try another name, state or LGA, or clear the filters.</p><button onClick={() => { setSearch(''); setFilter('all'); }}>Clear learner filters</button></section> : <article className="ma-learner"><p className="eyebrow">{demo.onboarded ? 'PROFILE READY' : 'PROFILE INCOMPLETE'}</p><h3>{p.name}</h3><p>{[p.lga, p.state].filter(Boolean).join(', ') || 'Location not recorded'}</p><p>{counts.enrolments} enrolments · {counts.completed} completed courses</p><p>{p.goals.join(' · ') || 'Goals not recorded yet'}</p><button className="primary" onClick={() => navigate('Detail')}>View learner details</button></article>}
  </>;
 }
 const sectionHeading = (section: DetailSection, title: string) => <h3 ref={node => { sections.current[section] = node; }} tabIndex={-1}>{title}</h3>;
 function learnerDetail() {
  return <><button onClick={() => navigate('Learners')}>Back to learners</button><p className="ma-readonly">Profile and learning evidence are read-only · {demo.onboarded ? 'Profile ready' : 'Profile incomplete'}. User edits appear here immediately. Administration can append simulated outcome records below.</p>
   <section>{sectionHeading('scorecard', 'Learner scorecard and outcomes')}<LearnerScorecard session={session} editable onOutcome={onOutcome} /></section>
   <section className="mp-card">{sectionHeading('profile', 'Profile and learning direction')}<Values items={[
    { label: 'Display name', value: p.name }, { label: 'Location', value: [p.lga, p.state].filter(Boolean).join(', ') },
    { label: 'Goals', value: p.goals.join(', ') }, { label: 'Skill areas', value: skillCategories.filter(c => p.categories.includes(c.id)).map(c => c.title).join(', ') },
    { label: 'Course interests', value: p.interests.join(', ') }, { label: 'Existing skills · Unverified', value: p.skills.join(', ') || (p.startingFresh ? 'Starting fresh' : '') },
    { label: 'Experience · Unverified', value: p.experience }, { label: 'Access preferences', value: p.access.join(', ') },
    { label: 'Other support preferences', value: p.otherSupport }, { label: 'Available device', value: p.device }, { label: 'Internet access', value: p.internet },
    { label: 'Preferred language', value: p.language }, { label: 'Study availability', value: p.availability },
   ]} /><details className="ma-private"><summary>Optional personal details and unverified evidence</summary><p>Self-reported details do not determine course access or ranking. File contents stay in the User view and require reselection after reload.</p><Values items={[
    { label: 'Sample contact', value: p.contact }, { label: 'Gender', value: [p.gender, p.genderDescription].filter(Boolean).join(' · ') },
    { label: 'Disability disclosures', value: [...p.disabilities, p.disabilityDescription].filter(Boolean).join(' · ') },
    { label: 'Existing certificates · Unverified', value: p.certificates }, { label: 'Existing portfolio claims · Unverified', value: p.portfolioDescription },
   ]} />{!demo.attachments.length && <p>No attachment records.</p>}{demo.attachments.map(a => <p key={a.id}><strong>{a.name}</strong> · {(a.size / 1024).toFixed(0)} KB · {a.type} · Unverified<br />{a.description || 'No description recorded'}</p>)}</details></section>
   <section className="mp-card">{sectionHeading('learning', 'Learning progress and achievements')}
    {!entries.length && <p>No courses enrolled yet.</p>}{entries.map(e => {
     const c = e.courseVersion ?? demo.learning.courses.find(c => c.id === e.courseId)!;
     const questions = demo.learning.requests.filter(r => r.learnerId === USER_LEARNER_ID && r.courseId === c.id && r.kind === 'question');
     return <article className="ma-course" key={e.id}><p className="eyebrow">{categoryTitle(c)}</p><h4>{c.title}</h4><p>{e.lessons.length} of {c.lessons.length} lessons · Best quiz {Math.max(0, ...e.scores)}%</p><p><strong>{e.completedAt ? 'Completed in this demo' : e.submitted && !e.approved ? 'Practical work pending trainer review' : e.approved ? 'Work approved; other completion requirements remain' : 'Learning in progress'}</strong></p>
      {e.completedAt && <p>Demo achievement: {demoDate(e.completedAt)} · Non-accredited.</p>}
      {c.delivery === 'foundation' && <div className="ma-foundation"><strong>Foundation learning only</strong><p>{c.outcome}</p><p>Tools for optional supervised practice: {c.tools?.join(', ') || 'Not recorded'}. Observed trade competence is not assessed in this demo.</p></div>}
      {e.submitted && <details><summary>Submitted practical work and sample feedback</summary><p className="mp-work">{e.submitted}</p><p>{e.feedback || 'No trainer feedback recorded.'}</p></details>}
      {questions.map(q => <div className="ma-question" key={q.id}><p><strong>{q.reply ? 'Sample trainer reply recorded' : 'Unanswered learning question'}</strong> · {demoDate(q.createdAt)}</p><p className="mp-work">{q.text}</p>{q.reply && <p>{q.reply}</p>}</div>)}
     </article>;
    })}
   </section>
   <section className="mp-card">{sectionHeading('portfolio', 'Demonstrated portfolio')}<p>Examples are added explicitly after completed, reviewed demo work. Foundation examples do not certify observed trade competence.</p>{!demo.portfolio.length && <p>No demonstrated examples added.</p>}{demo.portfolio.map(item => <article key={item.id}><h4>{item.title}</h4><p>{demoDate(item.createdAt)}</p><p className="mp-work">{item.text}</p></article>)}</section>
   <section className="mp-card">{sectionHeading('support', 'Support requests and submitted history')}<p>Support decisions record a simulated plan. A pending request does not mean equipment, funding or support has been delivered.</p>
    {!demo.supportRequest ? <p>No support request submitted.</p> : <><p><strong>{supportReview ? reviewStatusLabel(supportReview.status, 'support') : 'Pending review'}</strong> · {demoDate(demo.supportRequest.submittedAt)}</p><ul>{demo.supportRequest.items.map(item => <li key={item.id}>{item.need} · {item.priority} priority · Already available: {item.available || 'Not recorded'}</li>)}</ul></>}
    {!!snapshots('support').length && <details><summary>Support submission history ({snapshots('support').length})</summary>{snapshots('support').map(s => <article key={s.id}><h4>Revision {s.revision}</h4><p>{demoDate(s.submittedAt)}</p><ul>{(s.payload as { items: SupportItem[] }).items.map(item => <li key={item.id}>{item.need} · {item.priority} priority · Already available: {item.available || 'Not recorded'}</li>)}</ul></article>)}</details>}
   </section>
   <section className="mp-card">{sectionHeading('teaching', 'Trainer and mentor application')}<p>Trainer decisions use the four-point checklist. Applying does not grant a facilitator role or verify professional competence.</p>
    {!demo.teaching ? <p>No trainer application submitted.</p> : <><p><strong>{teachingReview ? reviewStatusLabel(teachingReview.status, 'teaching') : 'Pending review'}</strong> · {demoDate(demo.teaching.submittedAt)}</p><Values items={[
     { label: 'Entry route', value: demo.teaching.route === 'experience' ? 'Existing experience' : 'Learning progression' }, { label: 'Skill', value: demo.teaching.skill },
     { label: 'Examples · Self-reported', value: demo.teaching.examples }, { label: 'Teaching explanation', value: demo.teaching.explanation }, { label: 'Accessibility plan', value: demo.teaching.accessibility },
    ]} /></>}
   </section>
  </>;
 }
 return <div className={`mp-demo ma-demo ${p.access.includes('Larger text') ? 'mp-large' : ''}`} lang="en"><div className="mp-brand"><img src="/mosaic-pathways-symbol.svg" width="52" height="52" alt="" /><span>Mosaic Pathways<small>Administration · Understand. Coordinate. Follow through.</small></span></div>
  <div className="mp-workspace"><aside className="mp-sidebar"><p className="mp-user">Administration<small>Local demo overview</small></p><button className="mp-menu-toggle" aria-expanded={menu} aria-controls="ma-navigation" onClick={() => setMenu(!menu)}>Administration menu</button><nav id="ma-navigation" className={menu ? 'is-open' : ''} aria-label="Administration">{(['Overview', 'Learners', 'Learner progress', 'Trainer applications', 'Support requests', 'Trainer roster', 'Courses', 'Learning oversight', 'Learner map', 'Reports', 'Activity history', 'Demo settings'] as const).map(item => <button key={item} aria-current={(view === item || (item === 'Learners' && detail)) ? 'page' : undefined} onClick={() => navigate(item)}>{item}</button>)}</nav><p className="mp-muted">One shared tab session. Role selection is simulated; there are no verified accounts.</p></aside>
   <section className="mp-content"><p className="eyebrow">ADMINISTRATOR · WAVE 4</p><h2 ref={heading} tabIndex={-1}>{detail ? p.name : view === 'Learners' || view === 'Detail' ? 'Learners' : view === 'Overview' ? 'Administration overview' : view}</h2>{detail ? learnerDetail() : view === 'Overview' ? overview() : view === 'Learner progress' ? <LearnerProgress session={session} onOpenScorecard={() => navigate('Detail','scorecard')} /> : view === 'Trainer applications' || view === 'Support requests' ? <AdministratorReviews key={view} session={session} kind={view === 'Trainer applications' ? 'teaching' : 'support'} onDecide={onDecide} /> : view === 'Trainer roster' || view === 'Courses' || view === 'Learning oversight' ? <AdministratorCoordination key={`${view}:${navigation}`} session={session} view={view} {...coordination} /> : view === 'Learner map' ? <AdministratorScreenBoundary key={`${view}:${navigation}`}><Suspense fallback={<p role="status">Opening geographic view…</p>}><AdministratorGeography key={`${view}:${navigation}`} session={session} onOpenUserRecord={() => navigate('Detail')} /></Suspense></AdministratorScreenBoundary> : view === 'Reports' || view === 'Activity history' || view === 'Demo settings' ? <AdministratorScreenBoundary key={`${view}:${navigation}`}><Suspense fallback={<p role="status">Opening Administration view…</p>}>{active && <AdministratorReports key={`${view}:${navigation}`} session={session} view={view} onLoadSamples={onLoadSamples} onReset={onReset} onOpenGeography={() => navigate('Learner map')} />}</Suspense></AdministratorScreenBoundary> : learners()}</section>
  </div><p className="mp-credit"><a href="https://deerflow.tech" target="_blank" rel="noreferrer">Created By Deerflow</a></p>
 </div>;
}
