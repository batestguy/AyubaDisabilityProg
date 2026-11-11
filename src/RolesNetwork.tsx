import { useEffect, useId, useRef, useState } from 'react';

// Learning Sandbox roles network. Three role nodes (Administration, Facilitators,
// Learners) joined by drawn, labelled connections. Duties merge the current app
// with the earlier detailed screens. Administration's monitoring steps follow.
const roles = {
 admin: { title: 'Administration', summary: 'Oversees the programme and keeps it fair and safe.', duties: [
  'Approves facilitators, new topics, public profiles and which courses are offered',
  'Matches each learner with a suitable facilitator and assigns work for review',
  'Tracks progress, scorecards and outcomes, with a map of where learners are',
  'Answers support notes and keeps the 37 state noticeboards in order',
  'Produces reports and downloads for planning and funding',
  'Sees programme records, but not private teaching conversations',
 ] },
 facilitators: { title: 'Facilitators', summary: 'Teach practical skills and give feedback.', duties: [
  'Register their teaching skills and background',
  'Publish a public directory profile, with consent',
  'Teach assigned courses and propose new topics',
  'Mark practical work and answer learning questions',
  'Message their assigned learners privately',
  'Raise a learner’s support needs with Administration',
 ] },
 learners: { title: 'Learners', summary: 'Build skills at their own pace, mostly from home.', duties: [
  'Register a profile: access needs, circumstances, skills and goals',
  'Choose a direction: a job, freelancing, a business, personal growth or teaching',
  'Study courses: lessons, quizzes and practical tasks',
  'Ask for a facilitator and message them privately',
  'Keep a scorecard, portfolio and achievement record',
  'Share support notes, use their state noticeboard, and can later apply to teach',
 ] },
};
type RoleId = keyof typeof roles;

const links = [
 { id: 'admin-facilitators', a: 'admin', b: 'facilitators', title: 'Administration ↔ Facilitators', text: 'Approves teaching and topics · monitors teaching · receives support needs' },
 { id: 'admin-learners', a: 'admin', b: 'learners', title: 'Administration ↔ Learners', text: 'Matches and supports · monitors progress · receives support notes' },
 { id: 'facilitators-learners', a: 'facilitators', b: 'learners', title: 'Facilitators ↔ Learners', text: 'Private teaching · practical work · feedback' },
] as const;

const monitoring = [
 { title: 'Registration', text: 'Checks new learner and facilitator profiles.' },
 { title: 'Approval', text: 'Approves facilitators, topics and courses.' },
 { title: 'Matching', text: 'Pairs each learner with a suitable facilitator.' },
 { title: 'Learning', text: 'Tracks lessons, quizzes and scorecards.' },
 { title: 'Practice and support', text: 'Routes work for review and answers support notes.' },
 { title: 'Outcomes', text: 'Records results and reports them.' },
];

type Line = { id: string; x1: number; y1: number; x2: number; y2: number };

export function RolesNetwork() {
 const box = useRef<HTMLDivElement>(null);
 const [lines, setLines] = useState<Line[]>([]);
 const marker = `roles-arrow-${useId().replaceAll(':', '')}`;
 useEffect(() => {
  const root = box.current;
  if (!root) return;
  function measure() {
   if (!root) return;
   // On narrow screens the nodes stack and the text links between them carry the connections.
   if (getComputedStyle(root).getPropertyValue('--roles-draw').trim() !== '1') { setLines([]); return; }
   const frame = root.getBoundingClientRect();
   const rect = (id: RoleId) => { const r = root.querySelector(`[data-role-node="${id}"]`)!.getBoundingClientRect(); return { l: r.left - frame.left, r: r.right - frame.left, t: r.top - frame.top, b: r.bottom - frame.top, x: r.left - frame.left + r.width / 2, y: r.top - frame.top + r.height / 2 }; };
   const admin = rect('admin'), fac = rect('facilitators'), learn = rect('learners');
   const gap = 6;
   setLines([
    { id: 'admin-facilitators', x1: admin.l - gap, y1: admin.y, x2: fac.x, y2: fac.t - gap },
    { id: 'admin-learners', x1: admin.r + gap, y1: admin.y, x2: learn.x, y2: learn.t - gap },
    { id: 'facilitators-learners', x1: fac.r + gap, y1: fac.y, x2: learn.l - gap, y2: learn.y },
   ]);
  }
  const observer = new ResizeObserver(measure);
  observer.observe(root);
  root.querySelectorAll('[data-role-node]').forEach(node => observer.observe(node));
  measure();
  return () => observer.disconnect();
 }, []);
 const node = (id: RoleId) => { const role = roles[id]; return <section className={`roles-node roles-node-${id}`} data-role-node={id} aria-labelledby={`roles-${id}-title`}>
  <h3 id={`roles-${id}-title`}>{role.title}</h3>
  <p className="roles-summary">{role.summary}</p>
  <ul>{role.duties.map(duty => <li key={duty}>{duty}</li>)}</ul>
 </section>; };
 const link = (l: (typeof links)[number]) => <p className={`roles-link roles-link-${l.id}`} data-connection={l.id}>
  <strong>{l.title}</strong><span>{l.text}</span>
 </p>;
 return <figure className="roles-network" aria-labelledby="roles-network-title">
  <figcaption id="roles-network-title" className="roles-network-title">How the Learning Sandbox connects</figcaption>
  <p className="roles-network-intro">Three roles, each linked to the other two. Administration sits at the top because it monitors every step.</p>
  <div className="roles-map" ref={box}>
   <svg className="roles-lines" width="100%" height="100%" aria-hidden="true" focusable="false">
    <defs><marker id={marker} viewBox="0 0 12 12" refX="10" refY="6" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M1 1 L11 6 L1 11 Z" fill="currentColor" /></marker></defs>
    {lines.map(line => <line key={line.id} data-line={line.id} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} markerStart={`url(#${marker})`} markerEnd={`url(#${marker})`} />)}
   </svg>
   {node('admin')}
   {link(links[0])}
   {link(links[1])}
   {node('facilitators')}
   {link(links[2])}
   {node('learners')}
  </div>
  <section className="roles-monitoring" aria-labelledby="roles-monitoring-title">
   <h3 id="roles-monitoring-title">Administration monitors every step</h3>
   <ol>{monitoring.map(step => <li key={step.title}><strong>{step.title}</strong><span>{step.text}</span></li>)}</ol>
  </section>
 </figure>;
}
