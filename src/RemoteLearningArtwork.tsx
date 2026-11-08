import { useEffect, useId, useRef, useState } from 'react';
const activities = [
 { id: 'digital', label: 'Digital skills', facilitator: 'A woman with a burgundy headwrap teaches digital skills at a laptop.', learners: ['A woman using a wheelchair practises digital skills at a laptop in her home.', 'A man with albinism practises digital skills using a phone in his own home.'] },
 { id: 'sewing', label: 'Sewing', facilitator: 'A lean man with tied-back locs demonstrates sewing at a sewing machine.', learners: ['A woman wearing a navy hijab follows a laptop lesson at her home sewing machine.', 'A man with a prosthetic leg practises sewing with a phone lesson in his own home.'] },
 { id: 'electronics', label: 'Electronics', facilitator: 'A young woman with close-cropped hair teaches a battery-powered circuit.', learners: ['A man using a wheelchair practises a battery circuit with a laptop in his home.', 'A woman with short twists follows a phone lesson on a battery circuit in her own home.'] },
 { id: 'business', label: 'Business / Online business', facilitator: 'An older man with a grey beard teaches business and online business skills using bookkeeping examples.', learners: ['A woman with albinism uses a laptop beside stock and an accounts book in her home.', 'An older man with glasses and a crutch uses a phone beside his business notebook in his own home.'] },
];
type Connection = { id: string; path: string; kind: 'support' | 'teaching' };
export function RemoteLearningArtwork() {
 const network = useRef<HTMLDivElement>(null);
 const [connections, setConnections] = useState<Connection[]>([]);
 const marker = `remote-arrow-${useId().replaceAll(':', '')}`;
 useEffect(() => {
  const root = network.current;
  if (!root) return;
  function measure() {
   if (!root) return;
   const frame = root.getBoundingClientRect();
   const node = (selector: string) => {
    const rect = root.querySelector(selector)!.getBoundingClientRect();
    return { left: rect.left - frame.left, right: rect.right - frame.left, top: rect.top - frame.top, bottom: rect.bottom - frame.top, y: rect.top - frame.top + rect.height / 2, x: rect.left - frame.left + rect.width / 2 };
   };
   const admin = node('.remote-administration');
   const facilitators = node('.remote-facilitator-panel');
   const learners = node('.remote-learner-panel');
   setConnections([
    { id: 'administration-facilitators', kind: 'support', path: `M ${admin.x} ${admin.bottom + 4} V ${facilitators.top - 4}` },
    { id: 'facilitators-learners', kind: 'teaching', path: `M ${facilitators.x} ${facilitators.bottom + 4} V ${learners.top - 4}` },
    { id: 'administration-learners', kind: 'support', path: `M ${admin.right + 4} ${admin.y} H ${frame.width - 8} V ${learners.y} H ${learners.right + 4}` },
   ]);
  }
  const observer = new ResizeObserver(measure);
  observer.observe(root);
  root.querySelectorAll('.remote-panel').forEach(node => observer.observe(node));
  measure();
  return () => observer.disconnect();
 }, []);
 return <figure className="remote-learning" aria-label="Remote learning and support network">
  <figcaption className="remote-learning-title">Connected Learning Community</figcaption>
  <div className="remote-network" ref={network}>
   <svg className="remote-network-arrows" width="100%" height="100%" aria-hidden="true" focusable="false">
    <defs><marker id={marker} viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M 1 1 L 11 6 L 1 11 Z" fill="currentColor" /></marker></defs>
    {connections.map(connection => <g key={connection.id} data-connection={connection.id} className={`remote-edge remote-edge-${connection.kind}`}>
     <path className="remote-arrow-body" d={connection.path} markerStart={`url(#${marker})`} markerEnd={`url(#${marker})`} />
    </g>)}
   </svg>
   <div className="remote-administration remote-panel">
    <strong>Administration</strong>
    <div className="remote-offices">{[1, 2].map(number => <div className="remote-office" key={number}>
     <span>Admin {number}</span>
     <img src={`/photos/remote-admin-${number}-office-v4.webp`} alt={number === 1 ? 'Admin 1, a woman with a black bob, monitors progress alone in her office.' : 'Admin 2, an older bald man, reviews support notes alone in his separate office.'} width="640" height="640" decoding="async" />
    </div>)}</div>
   </div>
   <p className="remote-support-label">Support · progress</p>
   <section className="remote-panel remote-facilitator-panel" aria-label="Facilitators"><strong className="remote-panel-title">Facilitators</strong>
   <div className="remote-facilitators" aria-label="Four facilitators in separate teaching rooms">
    {activities.map((activity, index) => <div className="remote-facilitator remote-activity" data-activity={activity.id} key={activity.id}>
     <strong>Facilitator {index + 1}</strong>
     <img src={`/photos/remote-${activity.id}-facilitator-v4.webp`} alt={activity.facilitator} width="640" height="640" decoding="async" />
     <span>{activity.label}</span>
    </div>)}
   </div>
   </section>
   <p className="remote-teaching">Teaching · feedback</p>
   <section className="remote-panel remote-learner-panel" aria-label="Learners"><strong className="remote-panel-title">Learners · eight separate homes</strong>
   <div className="remote-learner-groups" aria-label="Eight learners in separate homes">
    {activities.map((activity, groupIndex) => <div className="remote-homes" data-activity={activity.id} key={activity.id}>
     {activity.learners.map((alt, index) => <div className="remote-home" key={alt}>
      <strong>Learner {groupIndex * 2 + index + 1}</strong>
      <img src={`/photos/remote-${activity.id}-home-${index + 1}-v4.webp`} alt={alt} width="640" height="640" decoding="async" />
      <span>{index === 0 ? 'Laptop' : 'Phone'}</span>
     </div>)}
    </div>)}
   </div>
   </section>
   <span className="remote-direct-label">Support · feedback</span>
  </div>
  <p className="remote-description">Administrators, facilitators and learners connect on one platform to share knowledge, build practical skills and support one another. Wherever learning begins, we grow together.</p>
 </figure>;
}
