import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import type { Course } from './catalogue';
import { skillCategories, courseCategory, categoryTitle, type SkillCategory } from './skillCategories';
import { enrol, grade, uid, updateEnrolment, type Enrolment } from './store';
import { freshDemo, recommendationReasons, addAttachment, submitSupport, submitTeaching, submitWork, addToPortfolio, USER_LEARNER_ID, type Demo, type Profile } from './userDemo';
import type { SharedDemoSession } from './sharedDemo';
import { reviewRecord, type ReviewRecord } from './reviewDemo';
import { currentAssignment, courseCoordinationStatus } from './coordinationDemo';
import { ReviewResult } from './AdministratorReviews';
import { LearnerScorecard } from './LearnerScorecard';
import './userDemo.css';

// Content never enters storage or a network request. Kept across local page navigation only.
const files = new Map<string, File>();
export function clearUserFiles() { files.clear(); }
export type WorkSubmissionIntent = { kind: "work-submitted"; recordId: string };
type UserChange = (next: Demo, message?: string, intent?: WorkSubmissionIntent) => void;
const goals = ['Employment', 'Freelancing', 'Starting or improving a business', 'Personal development', 'Teaching others'];
const accessChoices = ['Captions and transcripts', 'Larger text', 'Keyboard use', 'Plain language', 'Flexible pace'];
const disabilityChoices = ['Physical or mobility', 'Visual', 'Hearing', 'Intellectual', 'Psychosocial', 'Multiple disabilities', 'Other'];
const states = 'Abia,Adamawa,Akwa Ibom,Anambra,Bauchi,Bayelsa,Benue,Borno,Cross River,Delta,Ebonyi,Edo,Ekiti,Enugu,Gombe,Imo,Jigawa,Kaduna,Kano,Katsina,Kebbi,Kogi,Kwara,Lagos,Nasarawa,Niger,Ogun,Ondo,Osun,Oyo,Plateau,Rivers,Sokoto,Taraba,Yobe,Zamfara,FCT'.split(',');
const steps = ['Create demo profile', 'About me', 'Access preferences', 'Learning circumstances', 'Skills and evidence', 'My direction'];
const views = ['Overview', 'My scorecard', 'My learning', 'My portfolio', 'Tools and support', 'Teach others', 'My profile'] as const;
type View = typeof views[number];
const nextSteps: Record<string, string[]> = {
  Employment: ['Build my skills summary', 'Choose portfolio examples', 'Practise a job application', 'Identify workplace accommodations'],
  Freelancing: ['Define a service I can offer', 'Prepare sample work', 'Practise client communication', 'Plan access to tools'],
  'Starting or improving a business': ['Draft a simple business plan', 'Identify potential customers', 'Practise budgeting', 'List startup requirements'],
  'Personal development': ['Set a practical personal goal', 'Choose my next learning activity'],
  'Teaching others': ['Explore the trainer/mentor application', 'Practise explaining a task accessibly'],
};

function Choices({ legend, options, value, onChange }: { legend: string; options: string[]; value: string[]; onChange: (v: string[]) => void }) {
  return <fieldset className="mp-choices"><legend>{legend}</legend>{options.map(option => <label key={option}><input type="checkbox" checked={value.includes(option)} onChange={e => onChange(e.target.checked ? [...value, option] : value.filter(v => v !== option))} />{option}</label>)}</fieldset>;
}
function TextField({ label, value, onChange, area = false, required = false }: { label: string; value: string; onChange: (v: string) => void; area?: boolean; required?: boolean }) {
  return <label className="mp-field">{label}{area ? <textarea value={value} required={required} maxLength={5000} onChange={e => onChange(e.target.value)} rows={4} /> : <input value={value} required={required} maxLength={250} onChange={e => onChange(e.target.value)} />}</label>;
}
function Brand() {
  return <div className="mp-brand"><img src="/mosaic-pathways-symbol.svg" width="52" height="52" alt="" /><span>Mosaic Pathways<small>Learn skills. Build opportunities. Share what you know.</small></span></div>;
}

function SkillAreaChoices({ value, onChange }: { value: string[]; onChange: (value: string[]) => void }) {
  return <fieldset className="mp-area-choices"><legend>Choose my skill areas (select one or several)</legend><div className="mp-area-grid">{skillCategories.map(area => <label className={value.includes(area.id) ? 'is-chosen' : ''} key={area.id}><input type="checkbox" checked={value.includes(area.id)} onChange={e => onChange(e.target.checked ? [...value, area.id] : value.filter(id => id !== area.id))} /><span><strong>{area.title}</strong><small>{area.description}</small></span></label>)}</div></fieldset>;
}

export function UserDemo({ demo, active, onChange, onReset, session, onTeachingResponse, onSupportResponse, onReceipt }: { demo: Demo; active: boolean; onChange: (next: Demo, intent?: WorkSubmissionIntent) => void; onReset: () => boolean; session: SharedDemoSession; onTeachingResponse: (input: TeachingInput, response: string) => string | undefined; onSupportResponse: (response: string) => string | undefined; onReceipt: (updateId: string, note: string) => string | undefined }) {
  const [view, setView] = useState<View>('Overview');
  const [courseId, setCourseId] = useState('');
  const editing = demo.editingProfile || false;
  const [menu, setMenu] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [browseAll, setBrowseAll] = useState(false);
  const [courseFilter, setCourseFilter] = useState<'all' | 'selected' | SkillCategory>('all');
  const heading = useRef<HTMLHeadingElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => { if (active && error) errorRef.current?.focus(); }, [error]);
  useEffect(() => { if (active && demo.signedIn) heading.current?.focus(); }, [view, courseId, demo.step, demo.signedIn, editing]);
  const change: UserChange = (next, message = '', intent) => { onChange(next, intent); setError(''); setNotice(message); };
  const patch = <K extends keyof Profile>(key: K, value: Profile[K]) => change({ ...demo, profile: { ...demo.profile, [key]: value } });
  const navigate = (v: View) => { setView(v); setCourseId(''); setMenu(false); setNotice(''); setError(''); };
  const p = demo.profile;
  const supportReview = reviewRecord(session, 'support');
  const teachingReview = reviewRecord(session, 'teaching');
  const entries = demo.learning.enrolments;
  const courses = demo.learning.courses;
  const enrolledCourse = (id: string) => entries.find(e => e.courseId === id)?.courseVersion ?? courses.find(c => c.id === id);
  const completed = entries.filter(e => !!e.completedAt);
  const goCourse = (id: string) => {
    change({ ...demo, learning: enrol(demo.learning, USER_LEARNER_ID, id) });
    setView('My learning'); setCourseId(id);
  };
  const course = enrolledCourse(courseId);
  const entry = entries.find(e => e.courseId === courseId);

  function attachments() {
    return <section className="mp-card"><h3>Sample attachments</h3><p>Optional PDF, JPEG or PNG. Up to five files, 5 MB each. No file leaves this device. Use sample details only. Contents stay in memory; after reload, reselect a file to view it.</p>
      <label className="mp-field">Add sample files<input type="file" multiple accept="application/pdf,image/jpeg,image/png" onChange={e => {
        let next = demo; const errors: string[] = [];
        for (const file of Array.from(e.target.files || [])) {
          const result = addAttachment(next, file);
          if (result.error) errors.push(result.error);
          else { next = result.demo; const item = next.attachments.at(-1); if (item) files.set(item.id, file); }
        }
        change(next, 'Attachment selection processed locally.'); if (errors.length) setError(errors.join(' ')); e.target.value = '';
      }} /></label>
      {!demo.attachments.length && <p>No attachments added. You can learn without certificates.</p>}
      {demo.attachments.map(a => <div className="mp-evidence" key={a.id}><strong>{a.name}</strong> <small>{(a.size / 1024).toFixed(0)} KB · Unverified</small>
        <TextField label={`Description for ${a.name}`} value={a.description} onChange={description => change({ ...demo, attachments: demo.attachments.map(x => x.id === a.id ? { ...x, description } : x) })} />
        {files.has(a.id) ? <button onClick={() => {
          const url = URL.createObjectURL(files.get(a.id)!); const link = document.createElement('a'); link.href = url; link.download = a.name; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
        }}>View / download {a.name}</button> : <label className="mp-field">Reselect {a.name} to view<input type="file" accept="application/pdf,image/jpeg,image/png" onChange={e => {
          const file = e.target.files?.[0]; if (!file) return;
          if (file.name !== a.name || file.size !== a.size || file.type !== a.type) { setError('Please reselect the same file name, size and type, or remove this record and add a new file.'); return; }
          files.set(a.id, file); setNotice('Sample file available in memory again.'); setError(''); e.target.value = '';
        }} /></label>}
        <button onClick={() => { files.delete(a.id); change({ ...demo, attachments: demo.attachments.filter(x => x.id !== a.id) }, 'Attachment removed.'); }}>Remove {a.name}</button>
      </div>)}
    </section>;
  }

  function profileStep(): ReactNode {
    if (demo.step === 0) return <><p>This creates a simulated profile in this browser tab. No account verification or external registration occurs. Use fictional details; no password is needed.</p>
      <TextField label="Display name" value={p.name} onChange={v => patch('name', v)} required />
      <label className="mp-check"><input type="checkbox" checked={p.adult} onChange={e => patch('adult', e.target.checked)} />I confirm I am aged 18 or above</label>
      <TextField label="Sample contact details (optional)" value={p.contact} onChange={v => patch('contact', v)} /></>;
    if (demo.step === 1) return <><label className="mp-field">Nigerian state / FCT (optional)<select value={p.state} onChange={e => patch('state', e.target.value)}><option value="">Prefer not to say</option>{states.map(s => <option key={s}>{s}</option>)}</select></label>
      <TextField label="LGA (optional)" value={p.lga} onChange={v => patch('lga', v)} />
      <label className="mp-field">Gender (optional)<select value={p.gender} onChange={e => patch('gender', e.target.value)}>{['', 'Woman', 'Man', 'Self-description', 'Prefer not to say'].map(s => <option key={s} value={s}>{s || 'Not recorded'}</option>)}</select></label>
      {p.gender === 'Self-description' && <TextField label="Gender self-description (optional)" value={p.genderDescription} onChange={v => patch('genderDescription', v)} />}</>;
    if (demo.step === 2) return <><p>These choices are optional and editable. Disability and gender do not determine which courses you can access.</p>
      <Choices legend="Disability categories (optional, select several)" options={disabilityChoices} value={p.disabilities} onChange={v => patch('disabilities', v)} />
      <TextField label="Disability self-description (optional)" value={p.disabilityDescription} onChange={v => patch('disabilityDescription', v)} />
      <Choices legend="Accessibility preferences (independent of disability)" options={accessChoices} value={p.access} onChange={v => patch('access', v)} />
      <TextField label="Other access or support preferences (optional)" value={p.otherSupport} onChange={v => patch('otherSupport', v)} area /></>;
    if (demo.step === 3) return <><p>English lessons are available now. Record your preferred language for future development. Learn at your own pace; there is no time limit.</p>
      <TextField label="Available device (optional)" value={p.device} onChange={v => patch('device', v)} />
      <TextField label="Internet access (optional)" value={p.internet} onChange={v => patch('internet', v)} />
      <TextField label="Preferred language (optional)" value={p.language} onChange={v => patch('language', v)} />
      <TextField label="Approximate study availability (optional)" value={p.availability} onChange={v => patch('availability', v)} /></>;
    if (demo.step === 4) return <><Choices legend="Existing skills (optional)" options={['Digital confidence', 'Communication', 'Spreadsheets', 'Budgeting', 'Customer service', 'Craft or trade', 'Teaching']} value={p.skills} onChange={v => change({ ...demo, profile: { ...p, skills: v, startingFresh: v.length ? false : p.startingFresh } })} />
      <label className="mp-check"><input type="checkbox" checked={p.startingFresh} onChange={e => change({ ...demo, profile: { ...p, startingFresh: e.target.checked, skills: e.target.checked ? [] : p.skills } })} />I'm starting fresh</label>
      <TextField label="Experience or other skills (optional)" value={p.experience} onChange={v => patch('experience', v)} area />
      <TextField label="Existing certificates — unverified (optional)" value={p.certificates} onChange={v => patch('certificates', v)} area />
      <TextField label="Existing portfolio descriptions — unverified (optional)" value={p.portfolioDescription} onChange={v => patch('portfolioDescription', v)} area />{attachments()}</>;
    const visibleCourses = courses.filter(c => c.status === 'published').filter(c => browseAll || p.categories.includes(courseCategory(c)));
    return <><p>Choose a skill area before beginning. People & Workplace Skills covers soft skills; Hands-On & Livelihood Skills covers the practical pathways. Every area stays open to you, and you can change your choices later.</p>
      <SkillAreaChoices value={p.categories} onChange={v => patch('categories', v)} />
      <button type="button" aria-pressed={browseAll} onClick={() => setBrowseAll(!browseAll)}>{browseAll ? 'Show my chosen skill areas' : 'Browse every skill area'}</button>
      {!visibleCourses.length ? <p>Choose an area to see its courses, or browse every skill area. You can also skip these optional choices.</p> : <>
        <Choices legend="Courses I am interested in (optional)" options={visibleCourses.map(c => c.title)} value={p.interests} onChange={v => patch('interests', v)} />
        <details><summary>Preview courses before choosing</summary>{visibleCourses.map(c => <article key={c.id}><h3>{c.title}</h3><p>{categoryTitle(c)} · {c.description}</p><p>{c.lessons.length} lessons, quiz and practical work. Skills: {c.skills.join(', ')}.</p>{c.delivery === 'foundation' && <p>{c.outcome} Tools for optional supervised practice: {c.tools?.join(', ')}. Written foundation tasks need no trade equipment.</p>}</article>)}</details>
      </>}
      {!!p.interests.length && <section className="mp-card"><h3>My chosen course interests</h3>{p.interests.map(title => <p key={title}>{title} <button type="button" onClick={() => patch('interests', p.interests.filter(t => t !== title))}>Remove interest: {title}</button></p>)}</section>}
      <Choices legend="My goals (select several, optional)" options={goals} value={p.goals} onChange={v => patch('goals', v)} />
      <TextField label="Support needed during learning or afterwards (optional)" value={p.otherSupport} onChange={v => patch('otherSupport', v)} area />
      <p>You can change these choices later and browse every course.</p></>;
  }

  function onboarding() {
    return <section className="mp-onboarding"><p className="eyebrow">YOUR LEARNING PROFILE · STEP {demo.step + 1} OF {steps.length}</p>
      <progress max={steps.length} value={demo.step + 1} aria-label="Onboarding progress" />
      <h2 ref={heading} tabIndex={-1}>{steps[demo.step]}</h2>
      <form onSubmit={e => {
        e.preventDefault();
        if (!p.name.trim() || !p.adult) { setError('Enter a display name and confirm you are aged 18 or above to create a demo profile.'); return; }
        if (demo.step === steps.length - 1) { change({ ...demo, onboarded: true, editingProfile: false }, 'Profile saved. Your learning pathway is ready.'); navigate('Overview'); }
        else change({ ...demo, step: demo.step + 1 });
      }}>
        {profileStep()}
        <div className="mp-actions"><button type="button" onClick={() => {
          if (demo.step > 0) change({ ...demo, step: demo.step - 1 }); else change({ ...demo, signedIn: false });
        }}>Back</button><button className="primary">{demo.step === steps.length - 1 ? 'Open dashboard' : 'Continue'}</button>
        {demo.step > 0 && <button type="submit">{demo.step === steps.length - 1 ? 'Skip optional choices and finish' : 'Skip optional step'}</button>}
        {editing && <button type="button" onClick={() => change({ ...demo, editingProfile: false })}>Return to dashboard</button>}</div>
      </form><p className="mp-muted">Answers save as you type within this browser tab.</p>
    </section>;
  }

  function catalogue(showFilters = false) {
    const visible = courses.filter(c => c.status === 'published' || entries.some(e => e.courseId === c.id)).map(c => enrolledCourse(c.id) ?? c).filter(c => !showFilters || courseFilter === 'all' || (courseFilter === 'selected' ? p.categories.includes(courseCategory(c)) : courseCategory(c) === courseFilter));
    return <>{showFilters && <section className="mp-catalogue-choice"><h3>Choose a skill area to explore</h3><div className="mp-area-filters" role="group" aria-label="Filter courses by skill area"><button aria-pressed={courseFilter === 'all'} onClick={() => setCourseFilter('all')}>All skill areas</button><button aria-pressed={courseFilter === 'selected'} onClick={() => setCourseFilter('selected')}>My chosen areas</button>{skillCategories.map(area => <button key={area.id} aria-pressed={courseFilter === area.id} onClick={() => setCourseFilter(area.id)}>{area.title}</button>)}</div><p role="status">{visible.length} course{visible.length === 1 ? '' : 's'} shown. {courseFilter === 'all' ? 'Explore all areas before enrolling.' : 'You can switch areas at any time.'}</p><button onClick={() => { change({ ...demo, step: 5, editingProfile: true }); }}>Change my skill areas and interests</button></section>}
      {!visible.length && <p>No chosen skill areas yet. Choose your interests above or select All skill areas.</p>}
      <div className="mp-course-grid">{[...visible].sort((a, b) => recommendationReasons(p, b).length - recommendationReasons(p, a).length).map(c => {
      const e = entries.find(x => x.courseId === c.id); const reasons = recommendationReasons(p, c);
      return <article className="mp-card" key={c.id}><p className="eyebrow">{categoryTitle(c)}</p><h3>{c.title}</h3><p>{c.description}</p>{c.delivery === 'foundation' && <p className="mp-course-scope"><strong>Foundation course</strong><br />Written planning and role play; supervised hands-on practice is a separate next step. {c.outcome}</p>}<p className="mp-muted">{reasons.length ? `Suggested because: ${reasons.join('; ')}.` : 'Open to everyone. Explore this course if it suits your goals.'}</p>
        {courseCoordinationStatus(session, c.id) === 'archived' && <p>Archived for new enrolments. Your retained course remains available.</p>}
        {e && <p>{e.completedAt ? 'Completed · Demo achievement available' : `${e.lessons.length} of ${c.lessons.length} lessons · Best quiz ${Math.max(0, ...e.scores)}%`}</p>}
        <button className="primary" onClick={() => goCourse(c.id)}>{e ? 'Resume' : 'Enrol'} {c.title}</button></article>;
    })}</div></>;
  }

  function overview() {
    const ongoing = entries.find(e => !e.completedAt);
    return <><section className="mp-next"><p className="eyebrow">YOUR NEXT STEP</p><h3>{ongoing ? 'Continue where you left off.' : completed.length ? 'Put your learning into practice.' : 'Choose a useful skill to learn.'}</h3>
      <button className="primary" onClick={() => ongoing ? goCourse(ongoing.courseId) : navigate(completed.length ? 'My portfolio' : 'My learning')}>{ongoing ? `Resume ${enrolledCourse(ongoing.courseId)?.title}` : completed.length ? 'Build my portfolio' : 'Choose my first course'}</button></section>
      <ol className="mp-path" aria-label="My pathway">{['Profile', 'Choose course', 'Learn', 'Practise', 'Receive feedback', 'Complete', 'Apply skills', 'Explore teaching'].map((s, i) => <li key={s}><span>{i + 1}</span>{s}</li>)}</ol>
      <div className="mp-stats"><p><strong>{entries.length}</strong> courses chosen</p><p><strong>{completed.length}</strong> demo achievements</p><p><strong>{demo.portfolio.length}</strong> practical examples</p></div>
      <h3>Preparing to apply my skills</h3><p>Choose the next steps that help you. Work, freelancing, business and personal development are all possible directions.</p>
      {!p.goals.length && <button onClick={() => { change({ ...demo, step: 5, editingProfile: true }); }}>Choose my goals</button>}
      {p.goals.map(goal => <Choices key={goal} legend={goal} options={nextSteps[goal] || []} value={demo.checklist} onChange={value => change({ ...demo, checklist: [...demo.checklist.filter(x => !(nextSteps[goal] || []).includes(x)), ...value.filter(x => (nextSteps[goal] || []).includes(x))] })} />)}
      <h3>Discover a course</h3>{catalogue()}</>;
  }

  function portfolio() {
    return <><p>Existing claims are unverified. Demonstrated skills below come from completed practical work in this demo.</p>
      <section className="mp-card"><h3>My existing evidence · Unverified</h3><p>{p.experience || 'No experience description recorded.'}</p><p>{p.certificates || 'No certificates recorded. They are not needed to learn.'}</p><p>{p.portfolioDescription || 'No existing portfolio description recorded.'}</p></section>
      {attachments()}<h3>Demonstrated practical work</h3>{!demo.portfolio.length && <p>No practical work added yet. Complete a course and choose “Add completed work to portfolio”.</p>}
      {demo.portfolio.map(item => <article key={item.id} className="mp-card"><h3>{item.title}</h3><p>Completed in this demo · {new Date(item.createdAt).toLocaleDateString('en-NG')}</p><p className="mp-work">{item.text}</p><button onClick={() => change({ ...demo, portfolio: demo.portfolio.filter(x => x.id !== item.id) }, 'Portfolio example removed.')}>Remove {item.title}</button></article>)}
      {completed.filter(e => !demo.portfolio.some(x => x.courseId === e.courseId)).map(e => <button key={e.id} onClick={() => change(addToPortfolio(demo, e.id), 'Completed practical work added to your portfolio.')}>Add {enrolledCourse(e.courseId)?.title} work to portfolio</button>)}
    </>;
  }

  function support() {
    const same = demo.supportRequest && JSON.stringify(demo.supportRequest.items) === JSON.stringify(demo.support);
    return <><p>Plan what you need for learning and afterwards: equipment, data/power, assistive technology, accessible materials, workspace/transport, business guidance, job preparation or mentoring.</p>
      {p.otherSupport && <p className="mp-card">From your profile: {p.otherSupport}</p>}
      {!demo.support.length && <p>No support items yet. Add a need to start your checklist.</p>}
      {demo.support.map((item, i) => <section className="mp-card" key={item.id}><h3>Support item {i + 1}</h3>
        <TextField label={`What I need — item ${i + 1}`} value={item.need} onChange={need => change({ ...demo, support: demo.support.map(x => x.id === item.id ? { ...x, need } : x) })} />
        <TextField label={`Already available — item ${i + 1}`} value={item.available} onChange={available => change({ ...demo, support: demo.support.map(x => x.id === item.id ? { ...x, available } : x) })} />
        <label className="mp-field">Priority — item {i + 1}<select value={item.priority} onChange={e => change({ ...demo, support: demo.support.map(x => x.id === item.id ? { ...x, priority: e.target.value as typeof item.priority } : x) })}>{['High', 'Medium', 'Low'].map(v => <option key={v}>{v}</option>)}</select></label>
        <button onClick={() => change({ ...demo, support: demo.support.filter(x => x.id !== item.id) })}>Remove support item {i + 1}</button></section>)}
      <div className="mp-actions"><button onClick={() => change({ ...demo, support: [...demo.support, { id: uid(), need: '', available: '', priority: 'Medium' }] })}>Add support item</button>
        <button className="primary" disabled={!!same || supportReview?.status === 'needs-clarification' || supportReview?.status === 'resubmitted'} onClick={() => {
          if (!demo.support.length || demo.support.some(x => !x.need.trim())) { setError('Describe what you need in every support item before submitting.'); return; }
          change(submitSupport(demo), 'Pending review — demo request.');
        }}>{supportReview?.status === 'resubmitted' ? 'Await review of resubmitted request' : supportReview?.status === 'needs-clarification' ? 'Use the clarification response below' : same ? 'Demo request already submitted' : 'Submit demo support request'}</button></div>
      {supportReview && <ReviewResult record={supportReview} />}
      {supportReview?.status === 'needs-clarification' && <form className="mp-card" onSubmit={e => { e.preventDefault(); const message = onSupportResponse(String(new FormData(e.currentTarget).get('response') || '')); setError(message || ''); if (!message) setNotice('Support response resubmitted for review.'); }}><label className="mp-field">Response to support clarification<textarea name="response" required maxLength={5000} rows={4} /></label><p>Update your checklist above if needed, then include your response.</p><button className="primary">Resubmit support response</button></form>}
      {demo.supportRequest && <section className="mp-card"><h3>{supportReview?.status === "pending" ? "Pending review — demo request" : "Submitted demo request"}</h3><p>Submitted {new Date(demo.supportRequest.submittedAt).toLocaleDateString('en-NG')}. {same ? 'Your latest checklist is in this request.' : 'Your checklist has changed. Submit the revised checklist when ready.'}</p><ul>{demo.supportRequest.items.map(x => <li key={x.id}>{x.need} · {x.priority} priority · Available: {x.available || 'Not recorded'}</li>)}</ul></section>}
      <p>No equipment, grants, employment or funding have been approved or provided. This is a simulated request.</p></>;
  }

  function teach() {
    return <Teaching demo={demo} record={teachingReview} onResponse={(input, response) => { const message = onTeachingResponse(input, response); setError(message || ''); if (!message) setNotice('Trainer response resubmitted for review.'); }} onSubmit={input => { const result = submitTeaching(demo, input); if (result.error) setError(result.error); else change(result.demo, 'Trainer/mentor application: pending review.'); }} />;
  }

  const welcome = <section className="mp-welcome"><p className="eyebrow">YOUR ABILITIES. YOUR NEXT CHAPTER.</p><h2>Make room for<br />what you can do.</h2><p>Mosaic Pathways helps adults with disabilities identify their abilities, learn useful skills, prepare for work or business, and share what they know.</p>
    <div className="mp-actions">{p.name && <button className="primary" onClick={() => change({ ...demo, signedIn: true })}>Resume demo</button>}
      {!p.name && <button className="primary" onClick={() => change({ ...demo, signedIn: true })}>Start my demo journey</button>}
      <button onClick={() => {
        if (p.name) { setNotice('Reset your existing demo first to explore a new sample without overwriting your progress.'); return; }
        const sample = freshDemo(); sample.signedIn = true; sample.onboarded = true;
        sample.profile = { ...sample.profile, name: 'Amina (sample)', adult: true, state: 'Bauchi', language: 'English', access: ['Plain language', 'Flexible pace'], goals: ['Employment', 'Personal development'], categories: ['digital'], interests: ['Digital Essentials'] };
        change(sample, 'Fictional sample profile opened. All courses are available.');
      }}>Explore a sample profile</button></div>
    <div className="mp-benefits">{[['01', 'Learn useful skills', 'Start with what you know. Learn at a pace that suits you.'], ['02', 'Build opportunities', 'Practise and prepare for work, freelancing, business or a personal goal.'], ['03', 'Share what you know', 'Explore becoming a trainer or mentor through a reviewed application.']].map(([n, title, text]) => <article key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
    <p className="mp-muted">A local demonstration for adults 18+. No verified accounts, external registration or Commission endorsement. Your tab’s session holds progress; closing it may clear records.</p></section>;

  return <div className={`mp-demo ${p.access.includes('Larger text') ? 'mp-large' : ''}`} lang="en"><Brand />
    <div role="status" aria-live="polite" className="mp-status">{notice}</div>
    {error && <p role="alert" tabIndex={-1} ref={errorRef} className="mp-error">{error}</p>}
    {!demo.signedIn ? welcome : !demo.onboarded || editing ? onboarding() : <div className="mp-workspace">
      <aside className="mp-sidebar"><p className="mp-user">{p.name}<small>My demo pathway</small></p><button className="mp-menu-toggle" aria-expanded={menu} aria-controls="mp-navigation" onClick={() => setMenu(!menu)}>My pathway menu</button>
        <nav id="mp-navigation" className={menu ? 'is-open' : ''} aria-label="My pathway">{views.map(v => <button key={v} aria-current={view === v ? 'page' : undefined} onClick={() => navigate(v)}>{v}</button>)}</nav>
        <button onClick={() => change({ ...demo, signedIn: false }, 'Signed out of demo. Your tab progress is preserved.')}>Sign out of demo</button></aside>
      <section className="mp-content"><p className="eyebrow">LEARN · BUILD · SHARE</p><h2 ref={heading} tabIndex={-1}>{view === 'Overview' ? `Welcome, ${p.name}.` : course?.title || view}</h2>
        {view === 'Overview' ? overview() : view === 'My scorecard' ? <LearnerScorecard session={session} canReceive onReceipt={onReceipt} /> : view === 'My learning' ? course && entry ? <Learning key={entry.id} session={session} demo={demo} course={course} entry={entry} change={change} onError={setError} onBack={() => setCourseId('')} onSupport={() => navigate('Tools and support')} /> : <><p>Every course is open to you. Choose an area, preview a course, then enrol. Text-first lessons, quiz retries and written practical work with sample trainer review.</p>{catalogue(true)}</> : view === 'My portfolio' ? portfolio() : view === 'Tools and support' ? support() : view === 'Teach others' ? teach() : <><p>All profile details remain editable. Disability, gender and evidence are optional.</p><dl className="mp-card"><dt>Name</dt><dd>{p.name}</dd><dt>Skill areas</dt><dd>{skillCategories.filter(c => p.categories.includes(c.id)).map(c => c.title).join(', ') || 'Not chosen yet'}</dd><dt>Course interests</dt><dd>{p.interests.join(', ') || 'Not recorded'}</dd><dt>Goals</dt><dd>{p.goals.join(', ') || 'Not recorded'}</dd><dt>Existing skills · Unverified</dt><dd>{p.skills.join(', ') || (p.startingFresh ? 'Starting fresh' : 'Not recorded')}</dd><dt>Demonstrated skills</dt><dd>{[...new Set(completed.flatMap(e => enrolledCourse(e.courseId)?.skills || []))].join(', ') || 'Complete a course to demonstrate skills.'}</dd><dt>Disability preferences (optional)</dt><dd>{p.disabilities.join(', ') || 'Not recorded'} {p.disabilityDescription}</dd><dt>Access preferences</dt><dd>{p.access.join(', ') || 'Not recorded'}</dd><dt>Preferred language</dt><dd>{p.language || 'Not recorded'}</dd></dl><button className="primary" onClick={() => { change({ ...demo, step: 0, editingProfile: true }); }}>Edit my profile</button></>}
      </section></div>}
    <div className="mp-session-controls"><button onClick={() => setResetting(!resetting)} aria-expanded={resetting}>Reset demo</button>{resetting && <div><p>Clear this shared demo’s profile, progress, requests, application, course drafts, reviewer assignments, scorecards, support provision/receipt, grants, follow-up, history, fictional geographic profiles, migration backup and temporary files in this tab? The separate learning sandbox is preserved.</p><button onClick={() => { if (!onReset()) { setError('Could not clear saved demo records. Retry when session storage is available.'); return; } setNotice('User demo reset.'); setError(''); setView('Overview'); setCourseId(''); setResetting(false); setBrowseAll(false); setCourseFilter('all'); }}>Clear user demo records</button><button onClick={() => setResetting(false)}>Keep my demo</button></div>}</div>
    <p className="mp-credit"><a href="https://deerflow.tech" target="_blank" rel="noreferrer">Created By Deerflow</a></p>
  </div>;
}

function Learning({ session, demo, course, entry, change, onError, onBack, onSupport }: { session: SharedDemoSession; demo: Demo; course: Course; entry: Enrolment; change: UserChange; onError: (e: string) => void; onBack: () => void; onSupport: () => void }) {
  const [print, setPrint] = useState(false);
  const patch = (values: Partial<Enrolment>, message: string) => change({ ...demo, learning: updateEnrolment(demo.learning, entry.id, values) }, message);
  const requests = demo.learning.requests.filter(r => r.courseId === course.id);
  function formText(e: FormEvent<HTMLFormElement>, key: string) { e.preventDefault(); return String(new FormData(e.currentTarget).get(key) || '').trim(); }
  return <div className="mp-study"><button onClick={onBack}>Back to all courses</button><p>{course.description}</p>
    {courseCoordinationStatus(session, course.id) === 'archived' && <p className="mp-card">Archived for new enrolments. You can continue with your retained lessons, assessments and progress.</p>}
    <LearnerAssignment session={session} kind="enrolment" recordId={entry.id} />
    {course.delivery === 'foundation' && <section className="mp-practice"><h3>Foundation learning and practice plan</h3><p>{course.outcome}</p><p>You can complete written plans and role play without trade equipment. Tools for optional supervised practice: {course.tools?.join(', ')}.</p><p><strong>Supervised practice: not assessed in this demo.</strong> Course completion records reviewed foundation work; it does not establish observed trade competence.</p><button onClick={onSupport}>Plan tools and practice support</button></section>}
    <progress value={entry.lessons.length} max={course.lessons.length} aria-label="Lesson progress" /><p>{entry.lessons.length}/{course.lessons.length} lessons · Best quiz: {Math.max(0, ...entry.scores)}% · Practical work: {entry.approved ? 'Approved in demo' : entry.submitted ? 'Pending trainer review' : 'Not submitted'}</p>
    {course.lessons.map((lesson, i) => <details key={lesson.title}><summary>{i + 1}. {lesson.title}{entry.lessons.includes(i) ? ' · Done' : ''}</summary><p>{lesson.body}</p>{lesson.resource && <p className="mp-practice">{lesson.resource}</p>}{lesson.transcript && <p>{lesson.transcript}</p>}
      <button disabled={entry.lessons.includes(i)} onClick={() => patch({ lessons: [...entry.lessons, i] }, `Lesson ${i + 1} marked complete.`)}>{entry.lessons.includes(i) ? 'Lesson completed' : `Mark lesson ${i + 1} complete`}</button></details>)}
    <section className="mp-card"><h3>Quiz · Pass at 70%</h3><p>Retry whenever you like. Your best score counts; there is no time limit.</p><form onSubmit={e => {
      e.preventDefault(); const data = new FormData(e.currentTarget); const score = grade(course, course.quiz.map((_, i) => Number(data.get(`question-${i}`)))); patch({ scores: [...entry.scores, score] }, `Quiz score: ${score}%. ${score >= 70 ? 'Pass.' : 'Review the lessons and try again.'}`);
    }}>{course.quiz.map((q, i) => <fieldset key={q.question} className="mp-choices"><legend>{i + 1}. {q.question}</legend>{q.options.map((option, n) => <label key={option}><input type="radio" name={`question-${i}`} value={n} required />{option}</label>)}</fieldset>)}<button className="primary">Submit quiz</button></form></section>
    <section className="mp-card"><h3>Practical assignment</h3><p>{course.assignment}</p><form onSubmit={e => { const text = formText(e, 'work'); if (!text) { onError('Write your practical work before submitting.'); return; } change(submitWork(demo, entry.id, text), 'Work submitted. Pending trainer review; use Demo controls to show sample review.', { kind: 'work-submitted', recordId: entry.id }); }}>
      <label className="mp-field">My practical work<textarea key={entry.submitted || 'new'} name="work" defaultValue={entry.submitted || ''} rows={7} maxLength={10000} required /></label><button className="primary">{entry.submitted ? 'Resubmit practical work' : 'Submit practical work'}</button></form>
      <p>Every resubmission needs fresh approval. Completion also requires all lessons and a best quiz score of at least 70%.</p>{entry.feedback && <p className="mp-feedback"><strong>Sample trainer feedback:</strong> {entry.feedback}</p>}</section>
    <section className="mp-card"><h3>Ask a trainer</h3><form onSubmit={e => { const text = formText(e, 'question'); if (!text) { onError('Write a question before sending.'); return; } change({ ...demo, learning: { ...demo.learning, requests: [...demo.learning.requests, { id: uid(), learnerId: USER_LEARNER_ID, courseId: course.id, kind: 'question', text, createdAt: Date.now() }] } }, 'Question sent. Pending sample trainer reply.'); e.currentTarget.reset(); }}>
      <label className="mp-field">My question<textarea name="question" required maxLength={2000} rows={3} /></label><button>Send question</button></form>
      {requests.map(r => <article className="mp-evidence" key={r.id}><p>{r.text}</p><p>{r.reply ? `Sample trainer reply: ${r.reply}` : 'Pending trainer reply — demo question'}</p><LearnerAssignment session={session} kind="question" recordId={r.id} /></article>)}</section>
    <details className="mp-controls"><summary>Demo controls · Presenter actions</summary><p>These explicit actions simulate a trainer. They do not send work to a real facilitator. Submissions and questions remain pending until a presenter acts.</p>
      <button disabled={!entry.submitted} onClick={() => patch({ feedback: 'Sample feedback: your practical work is available for discussion. Check the task requirements, explain your choices clearly and revise any missing steps.' }, 'Sample trainer feedback added; approval remains separate.')}>Add sample trainer feedback</button>
      <button disabled={!entry.submitted || entry.approved} onClick={() => patch({ approved: true, feedback: 'Sample approval: this submission has been approved for this demonstration.' }, 'Sample trainer approval recorded. Completion still requires every lesson and a quiz pass.')}>Approve submitted work in demo</button>
      {requests.filter(r => !r.reply).map(r => <button key={r.id} onClick={() => change({ ...demo, learning: { ...demo.learning, requests: demo.learning.requests.map(x => x.id === r.id ? { ...x, reply: 'Sample reply: break the task into small steps, try the lesson practice and describe where you need help. We can discuss an accessible approach.', repliedAt: Date.now() } : x) } }, 'Sample trainer reply added.')}>Reply to question: {r.text.slice(0, 50)}</button>)}</details>
    {entry.completedAt && <section className="mp-achievement"><h3>Course complete · Demo achievement</h3>{course.delivery === 'foundation' && <p><strong>Foundation learning record.</strong> {course.outcome} Supervised practical competence is not assessed.</p>}<p>{course.skills.join(' · ')}</p><button onClick={() => change(addToPortfolio(demo, entry.id), 'Completed work added to portfolio.')}>Add completed work to portfolio</button><button onClick={() => setPrint(!print)}>View printable demo achievement</button>
      {print && <article className="mp-print-record" aria-label="Demo achievement record"><h3>Mosaic Pathways · Demo achievement record</h3><p>{demo.profile.name} completed {course.title}.</p><p>All {course.lessons.length} lessons, best quiz {Math.max(0, ...entry.scores)}%, practical work submitted and explicitly approved in the demo.</p>{course.delivery === 'foundation' && <p>Foundation learning only. {course.outcome} No observed trade competence is certified.</p>}<p>Date: {new Date(entry.completedAt).toLocaleDateString('en-NG')}</p><p>Demonstration only. This is not an accredited qualification.</p><button onClick={() => window.print()}>Print demo achievement</button></article>}</section>}
  </div>;
}

type TeachingInput = { route: 'experience' | 'progression'; skill: string; examples: string; explanation: string; accessibility: string };
function Teaching({ demo, onSubmit, record, onResponse }: { demo: Demo; record?: ReviewRecord; onResponse: (input: TeachingInput, response: string) => void; onSubmit: (input: TeachingInput) => void }) {
  const [route, setRoute] = useState<'experience' | 'progression'>('experience');
  const done = demo.learning.enrolments.filter(e => e.completedAt);
  const skills = [...new Set(done.flatMap(e => (e.courseVersion ?? demo.learning.courses.find(c => c.id === e.courseId))?.skills || []))];
  const a = demo.teaching;
  const responding = record?.status === 'needs-changes';
  const chosenRoute = responding ? a!.route : route;
  return <><p>Trainers and mentors help others learn. Choose an entry route and prepare a short, accessible teaching example. Administration reviews applications using four clear criteria. Foundation-course completion demonstrates planning and written practice; it does not qualify someone to supervise specialist trade tasks.</p>
    <div className="mp-card"><h3>Two routes to sharing your skills</h3><p><strong>Existing experience:</strong> describe a skill, provide work examples and explain what you can teach.</p><p><strong>Learning progression:</strong> complete at least one course, choose a demonstrated skill and provide practical work.</p></div>
    {record && <ReviewResult record={record} />}
    {a && !responding ? <section className="mp-card"><h3>{record?.status === "pending" ? "Trainer/mentor application: pending review" : "Submitted trainer/mentor application"}</h3><p>Route: {a.route === 'experience' ? 'Existing experience' : 'Learning progression'}</p><p>Skill to teach: {a.skill}</p><p className="mp-work">{a.examples}</p><p className="mp-work">{a.explanation}</p><p className="mp-work">{a.accessibility}</p><p>This application does not grant facilitator status. No real application has been sent.</p></section> : <form className="mp-card" onSubmit={e => { e.preventDefault(); const f = new FormData(e.currentTarget); const input = { route: chosenRoute, skill: String(f.get('skill') || '').trim(), examples: String(f.get('examples') || '').trim(), explanation: String(f.get('explanation') || '').trim(), accessibility: String(f.get('accessibility') || '').trim() }; if (responding) onResponse(input, String(f.get('response') || '')); else onSubmit(input); }}>
      {!responding && <fieldset className="mp-choices"><legend>Application route</legend><label><input type="radio" checked={chosenRoute === 'experience'} onChange={() => setRoute('experience')} />Existing experience</label><label><input type="radio" checked={chosenRoute === 'progression'} onChange={() => setRoute('progression')} />Learning progression</label></fieldset>}
      {chosenRoute === 'progression' && !done.length ? <p>Complete at least one course, including explicit sample trainer approval, to use this route.</p> : <><label className="mp-field">Skill I could teach{chosenRoute === 'experience' ? <input name="skill" required maxLength={250} defaultValue={responding ? a!.skill : ""} /> : <select name="skill" required defaultValue={responding ? a!.skill : undefined}>{skills.map(s => <option key={s}>{s}</option>)}</select>}</label>
        <label className="mp-field">{chosenRoute === 'experience' ? 'Work examples and what I could teach' : 'Practical work from my completed course'}<textarea name="examples" required maxLength={5000} rows={5} defaultValue={responding ? a!.examples : chosenRoute === 'progression' ? done.map(e => e.submitted).join('\n\n') : demo.profile.experience} key={route} /></label>
        <label className="mp-field">Teaching preparation: explain one task clearly<textarea name="explanation" defaultValue={responding ? a!.explanation : ""} required maxLength={5000} rows={4} /></label>
        <label className="mp-field">How I would make this lesson accessible<textarea name="accessibility" defaultValue={responding ? a!.accessibility : ""} required maxLength={5000} rows={4} /></label>
        {responding && <label className="mp-field">Response to requested changes<textarea name="response" required maxLength={5000} rows={4} /></label>}<button className="primary">{responding ? "Resubmit trainer/mentor response" : "Submit trainer/mentor demo application"}</button></>}
    </form>}
  </>;
}

function LearnerAssignment({ session, kind, recordId }: { session: SharedDemoSession; kind: 'enrolment' | 'question'; recordId: string }) {
 const current = currentAssignment(session, kind, recordId);
 if (!current) return null;
 const roster = session.reviews?.roster.find(r => r.id === current.assignment.rosterId);
 return <section className="mp-card"><h3>Demo review coordination</h3><p>{current.stale ? 'Earlier assignment: your evidence has changed and needs a fresh assignment.' : `Assigned to ${session.user.profile.name} · ${roster?.skill ?? 'Demo reviewer'}.`}</p><p>{current.assignment.suitabilityNote}</p><p>{current.assignment.reason}</p><p>No real trainer has been contacted. Assessment and replies remain separate demo actions.</p></section>;
}
