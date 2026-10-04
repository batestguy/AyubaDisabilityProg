import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { type DocumentaryPhoto } from './showcase';
import { DocumentaryImage } from './PhotoCarousel';
import { PhotoCaption } from './PhotoCaption';

const PhotoContext=createContext<((photo:DocumentaryPhoto,opener:HTMLButtonElement)=>void)|null>(null);
export function ExpandablePhoto({photo,tabIndex=0}: {photo:DocumentaryPhoto;tabIndex?:number}) {
 const open=useContext(PhotoContext);
 return <button className="gallery-open" tabIndex={tabIndex} aria-label={`Open photograph: ${photo.caption}`} onClick={e=>open?.(photo,e.currentTarget)}><DocumentaryImage photo={photo}/><span className="gallery-expand" aria-hidden="true">View full photograph ↗</span></button>;
}
export function PhotoViewer({children}: {children:ReactNode}) {
 const [selected, setSelected] = useState<DocumentaryPhoto | null>(null);
 const dialog = useRef<HTMLDialogElement>(null);
 const opener = useRef<HTMLButtonElement | null>(null);
 useEffect(() => {
  const el = dialog.current;
  if (!selected || !el) return;
  const previousOverflow = document.body.style.overflow;
  el.showModal(); document.body.style.overflow = 'hidden';
  el.querySelector<HTMLButtonElement>('button')?.focus();
  return () => { el.close(); document.body.style.overflow = previousOverflow; opener.current?.focus({ preventScroll: true }); };
 }, [selected]);
 return <PhotoContext.Provider value={(photo,button)=>{opener.current=button;setSelected(photo);}}>{children}
  {selected && <dialog className="photo-dialog" ref={dialog} aria-labelledby="photo-dialog-title" onCancel={e => { e.preventDefault(); setSelected(null); }} onClick={e => { if (e.target === e.currentTarget) setSelected(null); }} onKeyDown={e => {
   if (e.key !== 'Tab') return;
   const controls = [...e.currentTarget.querySelectorAll<HTMLElement>('button, a[href]')];
   const first = controls[0], last = controls[controls.length - 1];
   if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
   if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }}>
   <div className="dialog-heading"><h2 id="photo-dialog-title">Photograph & source</h2><button onClick={() => setSelected(null)} aria-label="Close photograph">Close ×</button></div>
   <figure><DocumentaryImage key={selected.id} photo={selected} loading="eager"/><PhotoCaption photo={selected}/></figure>
  </dialog>}
 </PhotoContext.Provider>;
}
