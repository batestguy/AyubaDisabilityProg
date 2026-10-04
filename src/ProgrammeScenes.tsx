import { useEffect, useRef, useState } from 'react';
import { achievements, photos, sourceFor, type DocumentaryPhoto } from './showcase';
import { ExpandablePhoto } from './PhotoGallery';
import { PhotoCaption } from './PhotoCaption';
export { PhotoCaption } from './PhotoCaption';

export function ProgrammeScenes({ reduced }: { reduced: boolean }) {
 const root = useRef<HTMLDivElement>(null);
 const frame = useRef<HTMLDivElement>(null);
 const [active, setActive] = useState(0);
 const [enhanced, setEnhanced] = useState(false);
 const [desktop, setDesktop] = useState(() => window.matchMedia('(min-width: 1024px)').matches);
 useEffect(() => {
  const query = window.matchMedia('(min-width: 1024px)');
  const update = () => setDesktop(query.matches);
  query.addEventListener('change', update);
  return () => query.removeEventListener('change', update);
 }, []);
 useEffect(() => {
  if (!desktop || !root.current || !('IntersectionObserver' in window)) { setEnhanced(false); return; }
  setEnhanced(true);
  const articles = [...root.current.querySelectorAll<HTMLElement>('.programme')];
  const observer = new IntersectionObserver(entries => {
   const entry = entries.filter(e => e.isIntersecting).sort((a,b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top))[0];
   if (entry) setActive(articles.indexOf(entry.target as HTMLElement));
  }, { rootMargin: '-25% 0px -55% 0px', threshold: 0 });
  articles.forEach(a => observer.observe(a));
  return () => observer.disconnect();
 }, [desktop]);
 useEffect(() => {
  if (reduced || !desktop || !root.current || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
   for (const entry of entries) if (entry.isIntersecting) {
    const el = entry.target as HTMLElement;
    // Animate only elements currently entering view; never hide unread content.
    el.classList.add('chapter-enter', 'chapter-revealed');
    el.addEventListener('animationend', () => el.classList.remove('chapter-enter'), { once: true });
    observer.unobserve(el);
   }
  }, { threshold: .15 });
  root.current.querySelectorAll('.programme-copy:not(.chapter-revealed)').forEach(a => observer.observe(a));
  return () => { observer.disconnect(); root.current?.querySelectorAll('.chapter-enter').forEach(el => el.classList.remove('chapter-enter')); };
 }, [desktop, reduced]);
 useEffect(() => {
  const el = frame.current;
  if (!el || !enhanced || reduced) { if (el) el.style.transform = ''; return; }
  let pending = 0;
  const update = () => {
   pending = 0;
   const bounds = root.current?.getBoundingClientRect();
   if (!bounds) return;
   const displacement = Math.max(-24, Math.min(24, (window.innerHeight / 2 - bounds.top) * .025));
   el.style.transform = `translateY(${displacement}px)`;
  };
  const onScroll = () => { if (!pending) pending = requestAnimationFrame(update); };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll); update();
  return () => { cancelAnimationFrame(pending); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); el.style.transform = ''; };
 }, [enhanced, reduced]);
 const selected = achievements[active];
 const scenePhoto = photos.find(p => p.id === selected.photos[0]);
 return <div ref={root} className={`programme-scenes ${enhanced ? 'scene-enhanced' : ''}`} data-active-chapter={selected.id}>
 {enhanced && <aside className="sticky-scene" aria-label="Programme photographs">
  <div className="chapter-index" aria-label="Chapter navigation">{achievements.map((a,i) => <a key={a.id} href={`#${a.id}`} aria-current={i === active ? 'step' : undefined} aria-label={`${i+1}. ${a.title}`}>{String(i+1).padStart(2,'0')}</a>)}</div>
  <figure aria-live="off"><div className="scene-image" ref={frame}>
   {achievements.map(a => { const p = photos.find(p => p.id === a.photos[0]); return p && <div className={`scene-layer ${a.id === selected.id ? 'is-active' : ''}`} aria-hidden={a.id !== selected.id} key={a.id}><ExpandablePhoto photo={p} tabIndex={a.id===selected.id?0:-1}/></div>; })}
  </div>{scenePhoto && <PhotoCaption photo={scenePhoto}/>}</figure>
 </aside>}
 <div className="chapter-stack">{achievements.map((a,i) => {
  const chapterPhotos=photos.filter(p=>a.photos.includes(p.id)||(a.id==='institutions'&&p.id==='leadership'));
  const photo = photos.find(p => p.id === a.photos[0]);
  return <article id={a.id} className="programme" key={a.id}>
   <div className="programme-visual">{photo && <figure><ExpandablePhoto photo={photo}/><PhotoCaption photo={photo}/></figure>}</div>
   <div className="programme-copy"><span className="number">{String(i+1).padStart(2,'0')} / {a.status.toUpperCase()}</span><h3>{a.title}</h3><p className="programme-location">{a.location} · Report: {a.date}</p><p>{a.account}</p><p><b>Gufwan / NCPWD's role:</b> {a.role}</p><p className="partner-credit"><b>Partner credit:</b> {a.partners}</p><a href={sourceFor(a.source).url} target="_blank" rel="noreferrer">Read the activity report ↗</a><details><summary>Evidence and activity status</summary><p>{a.evidence}</p>{a.id === 'institutions' && <p><a href={sourceFor('cbm').url} target="_blank" rel="noreferrer">CBM engagement report ↗</a><br/><a href={sourceFor('data').url} target="_blank" rel="noreferrer">NDMIS workshop report ↗</a></p>}{a.id === 'livelihoods' && <a href={sourceFor('partnership').url} target="_blank" rel="noreferrer">Skills partnership report ↗</a>}</details>{chapterPhotos.slice(1).map(p=><figure className="related-photo" key={p.id}><ExpandablePhoto photo={p}/><PhotoCaption photo={p}/></figure>)}</div>
  </article>;
 })}</div></div>;
}
