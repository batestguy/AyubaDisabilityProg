import { researchSlides, researchSections } from './researchSlides';

const countWord = ['zero','one','two','three','four','five','six','seven','eight','nine','ten'][researchSlides.length] ?? String(researchSlides.length);
const CountWord = countWord[0].toUpperCase() + countWord.slice(1);

export function ResearchPresentation() {
 return <section className="research-presentation" aria-labelledby="presentation-heading">
  <h2 id="presentation-heading">Impact Mosaic — Connecting people, evidence and accessible learning</h2>
  <p>{CountWord} opening slides · A proposed pilot for Nigeria</p>
  <p><a href="/?page=research">Return to the presentation</a> · <a href="/research/reading.html">Read or print all {countWord} slides</a></p>
  <details className="research-linear"><summary>Read the {countWord} slides as a continuous page</summary>
   {researchSlides.map((slide, i) => <article key={slide.title} id={`reading-research-slide-${i+1}`}>
    <h3>{i + 1}. {slide.title}</h3>
    {slide.layout === 'contents' && <nav aria-label="Presentation contents">{researchSections.map((section, index) => <details key={section.id}>
     <summary>{String(index+1).padStart(2,'0')} {section.title}{section.subsections.some(item => item.destination) ? '' : ' · Planned'}</summary>
     <ul>{section.subsections.map(item => <li key={item.slideNumber}>{item.destination ? <a href={`#reading-${item.destination}`}>{item.title} — {item.slideNumber}</a> : <span>{item.title} — {item.slideNumber} · Planned</span>}</li>)}</ul>
    </details>)}</nav>}
    {slide.layout !== 'contents' && <ul>{slide.points.map(p => <li key={p}>{p}</li>)}</ul>}<p>{slide.note}</p>
    {slide.links?.map(l => <p key={l.url}><a href={l.url}>{l.label}</a></p>)}
    {slide.images.map(image => <figure key={image.path}><a href={image.path}><img src={image.path} alt={image.alt} width="900" height="600" loading="lazy" /></a><figcaption>{image.caption} {image.source ? <a href={image.source}>{image.credit}</a> : image.credit}</figcaption></figure>)}
   </article>)}
  </details>
 </section>;
}
