import { useRef, useState } from 'react';
import { SCENARIO_TRAINER, scenarioComplete, scenarioLearners, scenarioNextStep } from './teachingScenario';
import type { ActionType, LearnerId, ScenarioCommand, ScenarioLearner, ScenarioRole, ScenarioState } from './teachingScenario';
import './userDemo.css';
import './administratorDemo.css';
import './guidedTeaching.css';

const pages = ['Overview', 'My learners', 'Practical reviews', 'Learning questions', 'Support referrals', 'My courses', 'Activity history'] as const;
type Page = typeof pages[number];
type CommandInput = Omit<ScenarioCommand, 'id' | 'expectedVersion' | 'role'>;
type Props = { state: ScenarioState; role: ScenarioRole; onRole: (role: ScenarioRole) => void; onCommand: (input: CommandInput) => string | undefined; onReset: () => void };
const actionLabels: Record<ActionType, string> = {
 'submit-work': 'Submitted practical work', 'request-changes': 'Requested changes', 'approve-work': 'Approved practical work',
 'reply-question': 'Answered a learning question', 'refer-support': 'Referred a support need', 'respond-support': 'Responded to support referral', 'assign-work': 'Assigned latest practical work',
};

function ActionForm({ label, help, placeholder, initial = '', submit, onSubmit }: { label: string; help: string; placeholder?: string; initial?: string; submit: string; onSubmit: (text: string) => string | undefined }) {
 const [text, setText] = useState(initial);
 const [message, setMessage] = useState('');
 return <form className="gt-form" onSubmit={e => {
  e.preventDefault();
  if (text.trim().length < 10) { setMessage('Please write at least 10 characters so the next person has useful detail.'); return; }
  const error = onSubmit(text.trim());
  setMessage(error || 'Saved in this fictional scenario.');
  if (!error) setText('');
 }}>
  <label className="mp-field">{label}<textarea required minLength={10} maxLength={3000} rows={4} value={text} placeholder={placeholder} onChange={e => setText(e.target.value)} /></label>
  <p className="mp-muted">{help} Use 10–3,000 characters.</p>
  <button type="submit">{submit}</button>
  <p role="status" className="mp-status">{message}</p>
 </form>;
}

function Progress({ learner }: { learner: ScenarioLearner }) {
 return <><div className="gt-progress"><span>{learner.lessonsDone} / {learner.course.lessons.length} lessons</span><progress aria-label={`${learner.name}: lessons completed`} value={learner.lessonsDone} max={learner.course.lessons.length} /></div>
  <div className="gt-gates"><span>{learner.quizBest >= 70 ? '✓' : '○'} Quiz: {learner.quizBest}% · pass 70%</span><span>{learner.review === 'approved' ? '✓' : '○'} Practical {learner.review === 'approved' ? 'approved' : 'not approved'}</span></div>
  <p className={scenarioComplete(learner) ? 'gt-complete' : 'mp-muted'}>{scenarioComplete(learner) ? 'Demo course completed — every learning requirement is met.' : 'Completion requires every lesson, a quiz score of at least 70%, and approved practical work.'}</p></>;
}

function Practical({ learner, role, onCommand }: { learner: ScenarioLearner; role: ScenarioRole; onCommand: Props['onCommand'] }) {
 const current = learner.submissionRevision === learner.assignmentRevision;
 const canReview = !!learner.work && current && !learner.review;
 const send = (type: ActionType) => (text: string) => onCommand({ learnerId: learner.id, type, text });
 return <article className="mp-card"><p className="eyebrow">PRACTICAL · {learner.name}</p><h3>{learner.course.title}</h3>
  <p><strong>Assignment:</strong> {learner.course.assignment}</p>
  {learner.work ? <><p className="gt-badge">Submission {learner.submissionRevision} · {learner.review === 'approved' ? 'Approved' : learner.review === 'needs-changes' ? 'Changes requested' : current ? 'Assigned for review' : 'Awaiting Administration assignment'}</p><blockquote className="gt-evidence">{learner.work}</blockquote></> : <p className="gt-empty">No practical work submitted yet.</p>}
  {learner.feedback && <div className="gt-feedback"><h4>{SCENARIO_TRAINER}’s feedback</h4><p className="mp-work">{learner.feedback}</p></div>}
  {role === 'User' && <ActionForm key={`${learner.id}:${learner.submissionRevision}`} label={learner.work ? 'Your revised practical work' : 'Your practical work'} help="Saving a submission clears its previous review. Administration assigns the new version before the trainer can review it." initial={learner.work || ''} submit={learner.work ? 'Submit revised work' : 'Submit practical work'} onSubmit={send('submit-work')} />}
  {role === 'Facilitator' && canReview && <><p>Review the current submission against the assignment. Give a clear next step or explain why it meets the requirements.</p><ActionForm label="Feedback for the learner" help="Describe the specific change needed." submit="Request changes" onSubmit={send('request-changes')} /><ActionForm label="Approval feedback" help="Approval covers the practical work. Lessons and the quiz still determine course completion." submit="Approve practical work" onSubmit={send('approve-work')} /></>}
  {role === 'Facilitator' && !canReview && <p className="ma-readonly">{!learner.work ? 'The learner needs to submit work first.' : !current ? 'The evidence changed. Administration must assign the latest submission before you can review it.' : 'Review recorded. A new learner submission will open a new review.'}</p>}
  {role === 'Administration' && learner.work && !current && <ActionForm label="Assignment note" help={`Assign submission ${learner.submissionRevision} to ${SCENARIO_TRAINER}. This makes the latest evidence available for a new trainer review.`} submit="Assign latest work" onSubmit={send('assign-work')} />}
  {role === 'Administration' && (!learner.work || current) && <p className="ma-readonly">{learner.work ? `Submission ${learner.submissionRevision} is already assigned to ${SCENARIO_TRAINER}.` : 'A submission is needed before you can assign practical work.'}</p>}
 </article>;
}

function Question({ learner, role, onCommand }: { learner: ScenarioLearner; role: ScenarioRole; onCommand: Props['onCommand'] }) {
 return <article className="mp-card"><p className="eyebrow">LEARNING QUESTION · {learner.name}</p><h3>{learner.course.title}</h3><blockquote className="gt-evidence">{learner.question}</blockquote>
  {learner.reply ? <div className="gt-feedback"><h4>{SCENARIO_TRAINER}’s reply</h4><p className="mp-work">{learner.reply}</p></div> : role === 'Facilitator' ? <ActionForm label="Your reply" help="Answer the learning question in plain language with a practical next step." submit="Send learning reply" onSubmit={text => onCommand({ learnerId: learner.id, type: 'reply-question', text })} /> : <p className="mp-muted">Waiting for {SCENARIO_TRAINER}’s reply.</p>}
 </article>;
}

function Support({ learner, role, onCommand }: { learner: ScenarioLearner; role: ScenarioRole; onCommand: Props['onCommand'] }) {
 return <article className="mp-card"><p className="eyebrow">SUPPORT · {learner.name}</p><h3>Make learning easier to access</h3><p><strong>Learning preference:</strong> {learner.access}</p>
  {learner.support ? <><h4>Trainer’s referral</h4><p className="gt-evidence">{learner.support}</p>{learner.supportResponse ? <div className="gt-feedback"><h4>Administration’s response</h4><p className="mp-work">{learner.supportResponse}</p></div> : role === 'Administration' ? <ActionForm label="Support response" help="Record an accessible next step for the trainer and learner. This only records a simulated response; no service is contacted." submit="Record support response" onSubmit={text => onCommand({ learnerId: learner.id, type: 'respond-support', text })} /> : <p className="mp-muted">Referral recorded. Waiting for Administration’s response.</p>}</> : role === 'Facilitator' ? <ActionForm label="Support referral note" help="Describe a learning access need and the help requested. Use fictional details only; no diagnosis is needed." submit="Refer to Administration" onSubmit={text => onCommand({ learnerId: learner.id, type: 'refer-support', text })} /> : <p className="gt-empty">No support referral recorded for this learner.</p>}
 </article>;
}

export function GuidedTeachingDemo({ state, role, onRole, onCommand, onReset }: Props) {
 const [page, setPage] = useState<Page>('Overview');
 const [selected, setSelected] = useState<LearnerId>('ada');
 const [large, setLarge] = useState(false);
 const [menu, setMenu] = useState(false);
 const heading = useRef<HTMLHeadingElement>(null);
 const learners = scenarioLearners(state);
 const learner = learners.find(l => l.id === selected)!;
 const next = scenarioNextStep(state);
 const done = learners[0].review === 'approved' && !!learners[1].reply && !!learners[1].supportResponse;
 const open = (target: Page, id?: LearnerId) => { setPage(target); if (id) setSelected(id); setMenu(false); requestAnimationFrame(() => heading.current?.focus()); };
 const walk = () => {
  onRole(next.role);
  const target = done ? 'Overview' : next.role === 'User' || (next.learnerId === 'ada') ? 'Practical reviews' : !learners[1].reply ? 'Learning questions' : 'Support referrals';
  open(target, next.learnerId);
 };
 const reviewCount = learners.filter(l => l.work && l.assignmentRevision === l.submissionRevision && !l.review).length;
 return <div className={`mp-demo ma-demo gt-demo ${large ? 'mp-large' : ''}`} lang="en">
  <div className="mp-brand"><img src="/mosaic-pathways-symbol.svg" width="52" height="52" alt="" /><span>Mosaic Pathways<small>A teaching journey · Fictional guided demo</small></span></div>
  <div className="gt-demo-note"><span className="gt-badge">SIMULATED WORKSPACE</span><p>Explore one shared story as a learner, trainer and administrator. All names and records here are fictional. No real accounts, messages, payments or services are created.</p><button aria-pressed={large} onClick={() => setLarge(!large)}>{large ? 'Use standard text' : 'Use larger text'}</button></div>
  <div className="mp-workspace"><aside className="mp-sidebar"><p className="mp-user">{role === 'Facilitator' ? SCENARIO_TRAINER : role === 'User' ? 'Learner perspective' : 'Administration'}<small>{role === 'Facilitator' ? 'Your teaching workspace' : 'Same learners · same scenario'}</small></p>
   <button className="mp-menu-toggle" aria-expanded={menu} aria-controls="gt-navigation" onClick={() => setMenu(!menu)}>Teaching demo menu</button><nav id="gt-navigation" aria-label="Teaching demo" className={menu ? 'is-open' : ''}>{pages.map(p => <button key={p} aria-current={page === p ? 'page' : undefined} onClick={() => open(p)}>{p}</button>)}</nav>
   <p className="mp-muted">Trainer: {SCENARIO_TRAINER}<br />2 fictional learners<br />1 shared learning journey</p>
   <button className="gt-reset" onClick={onReset}>Restart guided scenario</button>
  </aside><section className="mp-content"><p className="eyebrow">{role.toUpperCase()} · GUIDED TEACHING DEMO</p><h2 ref={heading} tabIndex={-1}>{page === 'Overview' ? role === 'Facilitator' ? 'Help each learner move forward.' : 'Follow the learning journey.' : page}</h2>
   <section className={`gt-walkthrough ${done ? 'is-complete' : ''}`} aria-label="Guided walkthrough"><div className="gt-walkthrough-mark" aria-hidden="true">{done ? '✓' : '→'}</div><div><p className="eyebrow">{done ? 'WALKTHROUGH COMPLETE' : `RECOMMENDED NEXT · ${next.role.toUpperCase()}`}</p><h3>{next.title}</h3><p>{next.detail}</p>{!done && <button onClick={walk}>{next.role === role ? 'Go to next action' : `Continue as ${next.role}`}</button>}{done && <p>Review the activity history or restart to try the journey again.</p>}</div></section>
   <div key={role}>
   {page === 'Overview' && <><div className="ma-metrics gt-metrics"><article><p>Fictional learners</p><strong>02</strong><button onClick={() => open('My learners')}>Meet your learners</button></article><article><p>Practical reviews ready</p><strong>{reviewCount.toString().padStart(2, '0')}</strong><button onClick={() => open('Practical reviews')}>Open practical reviews</button></article><article><p>Support awaiting response</p><strong>{learners.filter(l => l.support && !l.supportResponse).length.toString().padStart(2, '0')}</strong><button onClick={() => open('Support referrals')}>Open support referrals</button></article></div><h3 className="gt-section-title">Two learners. Individual next steps.</h3><div className="gt-learner-grid">{learners.map(l => <article className="mp-card" key={l.id}><span className="gt-initial" aria-hidden="true">{l.name.split(' ').map(n => n[0]).join('')}</span><h3>{l.name}</h3><p>{l.goal}</p><p className="mp-muted">{l.access}</p><Progress learner={l} /><button onClick={() => open('My learners', l.id)}>View {l.name.split(' ')[0]}’s learning</button></article>)}</div><p className="ma-boundary">The trainer reviews practical evidence and answers learning questions. Administration coordinates changed submissions and support. Switch roles above to see how each action carries through.</p></>}
   {page !== 'Overview' && page !== 'Activity history' && page !== 'My courses' && <label className="mp-field gt-learner-select">Fictional learner<select value={selected} onChange={e => setSelected(e.target.value as LearnerId)}>{learners.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</select></label>}
   <div key={`${selected}:${page}`}>
   {page === 'My learners' && <><div className="gt-learner-grid">{learners.map(l => <button className="gt-learner-choice" key={l.id} aria-pressed={selected === l.id} onClick={() => setSelected(l.id)}><strong>{l.name}</strong><span>{l.goal}</span><small>{l.lessonsDone}/{l.course.lessons.length} lessons · quiz {l.quizBest}% · {scenarioComplete(l) ? 'Course complete' : 'Learning in progress'}</small></button>)}</div><article className="mp-card"><p className="eyebrow">FICTIONAL LEARNER PROFILE</p><h3>{learner.name}</h3><dl className="ma-values"><div><dt>Learning goal</dt><dd>{learner.goal}</dd></div><div><dt>Access preference</dt><dd>{learner.access}</dd></div><div><dt>Course</dt><dd>{learner.course.title}</dd></div><div><dt>Assigned trainer</dt><dd>{SCENARIO_TRAINER}</dd></div></dl><Progress learner={learner} /><div className="mp-actions"><button onClick={() => open('Practical reviews')}>View practical work</button><button onClick={() => open('Learning questions')}>View learning question</button><button onClick={() => open('Support referrals')}>View support</button></div></article></>}
   {page === 'Practical reviews' && <Practical learner={learner} role={role} onCommand={onCommand} />}
   {page === 'Learning questions' && <Question learner={learner} role={role} onCommand={onCommand} />}
   {page === 'Support referrals' && <Support learner={learner} role={role} onCommand={onCommand} />}
   </div>
   {page === 'My courses' && <><p>Both learners are assigned to {SCENARIO_TRAINER} for this fictional course. Lesson and quiz records are seeded for the walkthrough.</p><article className="mp-card"><p className="eyebrow">ASSIGNED COURSE</p><h3>{learners[0].course.title}</h3><p>{learners[0].course.description}</p><p><strong>Learning outcome:</strong> {learners[0].course.outcome}</p><p><strong>Practical assignment:</strong> {learners[0].course.assignment}</p><details><summary>Read the {learners[0].course.lessons.length} lesson outlines</summary>{learners[0].course.lessons.map((l, i) => <section className="ma-course" key={l.title}><h4>{i + 1}. {l.title}</h4><p>{l.body}</p></section>)}</details></article><div className="gt-learner-grid">{learners.map(l => <article className="mp-card" key={l.id}><h3>{l.name}</h3><Progress learner={l} /></article>)}</div></>}
   {page === 'Activity history' && <><p>Every saved action appears here for all three roles. Initial lesson, quiz and submission records are scenario starting data.</p>{!state.events.length ? <div className="mp-card gt-empty"><h3>The story is ready to begin.</h3><p>Follow the recommended next action above. Saved actions will appear here.</p></div> : <ol className="gt-history">{[...state.events].reverse().map(event => <li key={event.id}><p className="eyebrow">{event.role} · {learners.find(l => l.id === event.learnerId)?.name}</p><h3>{actionLabels[event.type]}</h3><p className="mp-work">{event.text}</p><time dateTime={new Date(event.at).toISOString()}>{new Date(event.at).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })}</time></li>)}</ol>}</>}
   </div>
  </section></div>
 </div>;
}
