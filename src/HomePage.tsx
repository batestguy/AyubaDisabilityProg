import { reviewed } from './evidence';
import { photos, heroPhotos, sourceFor, sourceRegister, leadershipReading } from './showcase';
import { DocumentaryImage, PhotoCarousel } from './PhotoCarousel';
import { ProgrammeScenes, PhotoCaption } from './ProgrammeScenes';
import { PhotoViewer } from './PhotoGallery';
import { Timeline } from './Timeline';
import { useReducedMotion } from './useReducedMotion';
export function HomePage({reduceMotion}: {reduceMotion:boolean}) {
 const reduced=useReducedMotion(reduceMotion);
 const leader=photos.find(p=>p.id==='leadership')!;
 return <PhotoViewer><div className={`showcase ${reduced ? 'motion-reduced' : ''}`}>
 <nav className="home-sections" aria-label="Home sections"><a href="#contributions">Contributions</a><a href="#milestones">Milestones</a><a href="#source-register">Sources</a></nav>
 <section className="hero documentary-hero"><div className="hero-copy"><p className="eyebrow">LEADERSHIP. PARTNERSHIP. PARTICIPATION.</p><h1>Building a more<br/><em>inclusive Nigeria.</em></h1><p className="lead">Chief Ayuba Gufwan, Executive Secretary of the National Commission for Persons with Disabilities (NCPWD).</p><p>Explore Chief Ayuba Gufwan’s leadership, the Commission’s work, and the partners helping to widen participation.</p><a className="primary hero-cta" href="#contributions">Explore the contributions →</a><p className="hero-note">An independent, source-linked showcase of documented work.</p></div><PhotoCarousel photos={heroPhotos}/></section>
 <section id="leadership" className="section leadership-intro"><figure><DocumentaryImage photo={leader}/><PhotoCaption photo={leader}/></figure><div><p className="eyebrow">THE LEADERSHIP BEHIND THE WORK</p><h2>Chief Ayuba Gufwan.</h2><p className="lead">Disability advocacy, carried into a public mandate.</p><p>Appointed NCPWD Executive Secretary on 6 August 2024, Gufwan brings a background in law and disability advocacy. FMINO's leadership profile describes more than three decades of advocacy and a focus on working with development partners.</p><p>His agenda connects education, employment, health and accessible infrastructure. The chapters below trace documented engagements and activities, with the people and institutions involved.</p><a href={sourceFor('leadership').url} target="_blank" rel="noreferrer">Read the leadership profile ↗</a><div className="leadership-reading"><h3>More of his story.</h3><ul>{leadershipReading.map(story=><li key={story.id}><a href={story.url} target="_blank" rel="noreferrer">{story.title}</a><p>{story.summary}</p></li>)}</ul></div></div></section>
 <section id="contributions" className="section programme-section"><div className="section-heading"><div><p className="eyebrow">CONTRIBUTIONS PEOPLE CAN RECOGNISE</p><h2>Participation, in practice.</h2></div><p>People, partners and places behind the work. Follow the chapters and open any photograph for its full frame, caption and source.</p></div>
 <ProgrammeScenes reduced={reduced}/></section>

 <Timeline/>
 <section className="section" id="source-register"><h2>Sources you can check.</h2><p>Source review: {reviewed}. Historical reports are not open application calls. No currently verified live opportunity is listed.</p><div className="sources">{sourceRegister.map(s=><article key={s.id}><a href={s.url} target="_blank" rel="noreferrer">{s.title} ↗</a><small>{s.date} · Review: {reviewed}</small><p>{s.summary}</p></article>)}</div></section>
 </div></PhotoViewer>;
}
