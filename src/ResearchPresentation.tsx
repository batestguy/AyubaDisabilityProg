import { researchSlides } from './researchSlides';

export function ResearchPresentation() {
 return <section className="research-presentation" aria-labelledby="presentation-heading">
  <h2 id="presentation-heading">Impact Mosaic — Connecting people, evidence and accessible learning</h2>
  <p>Five opening slides · A proposed Plateau pilot</p>
  <p><a href="/?page=research">Return to the presentation</a> · <a href="/research/reading.html">Read or print all five slides</a></p>
  <details className="research-linear"><summary>Read the five slides as a continuous page</summary>
   {researchSlides.map((slide, i) => <article key={slide.title}>
    <h3>{i + 1}. {slide.title}</h3><ul>{slide.points.map(p => <li key={p}>{p}</li>)}</ul><p>{slide.note}</p>
    {slide.links?.map(l => <p key={l.url}><a href={l.url}>{l.label}</a></p>)}
    {slide.images.map(image => <figure key={image.path}><a href={image.path}><img src={image.path} alt={image.alt} width="900" height="600" loading="lazy" /></a><figcaption>{image.caption} {image.source ? <a href={image.source}>{image.credit}</a> : image.credit}</figcaption></figure>)}
   </article>)}
  </details>
 </section>;
}
