// One made-up learner's journey through the same cycle the Research slides describe:
// reached → needs understood → matched → practises → reviewed.
const steps = [
 { title: 'Reached', text: 'A neighbour who already takes part tells Hauwa about the programme and passes on the contact.' },
 { title: 'Needs understood', text: 'She explains she learns best from short videos and voice notes she can replay while sewing.' },
 { title: 'Matched', text: 'Administration pairs her with Nanle, who teaches tailoring and has time on weekday evenings.' },
 { title: 'Practises', text: 'She sews her first straight seams at home and sends photos of the work.' },
 { title: 'Reviewed', text: 'Nanle replies with feedback, and together they agree her next step: a simple skirt.' },
];

export function SandboxStory() {
 return <section className="sandbox-story" aria-labelledby="sandbox-story-title">
  <p className="sandbox-story-eyebrow">A made-up example · painted illustration, not a real participant</p>
  <h2 id="sandbox-story-title">Hauwa learns tailoring from home</h2>
  <div className="sandbox-story-scene">
   <figure className="sandbox-story-person">
    <img src="/photos/remote-sewing-home-1-v4.webp" alt="Hauwa, a woman in a navy hijab, sews at her machine at home while following a lesson on her laptop." width="439" height="440" decoding="async" />
    <figcaption><strong>Hauwa</strong> · learner, at home in Bukuru</figcaption>
   </figure>
   <div className="sandbox-story-link">
    <svg viewBox="0 0 120 40" aria-hidden="true" focusable="false"><path d="M4 20 H116" /><path d="M10 13 L3 20 L10 27 M110 13 L117 20 L110 27" /><rect x="48" y="6" width="24" height="28" rx="4" /><path d="M56 29 H64" /></svg>
    <p>Video lessons · voice notes · photos of her seams</p>
   </div>
   <figure className="sandbox-story-person">
    <img src="/photos/remote-sewing-facilitator-v4.webp" alt="Nanle, a tailoring facilitator with tied-back locs and a tape measure, works at a sewing machine in his studio." width="508" height="508" decoding="async" />
    <figcaption><strong>Nanle</strong> · tailoring facilitator, Jos</figcaption>
   </figure>
  </div>
  <ol className="sandbox-story-steps">
   {steps.map(step => <li key={step.title}><strong>{step.title}</strong><span>{step.text}</span></li>)}
  </ol>
 </section>;
}
