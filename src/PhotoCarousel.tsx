import { useEffect, useRef, useState } from 'react';
import { type DocumentaryPhoto, sourceFor } from './showcase';
export function DocumentaryImage({photo, loading="lazy"}: {photo:DocumentaryPhoto;loading?:"lazy"|"eager"}) {
 const [failed,setFailed]=useState(false);
 useEffect(()=>setFailed(false),[photo.path]);
 return failed ? <div className="photo-fallback" role="img" aria-label={photo.alt} style={{aspectRatio:`${photo.width}/${photo.height}`}}>Photograph unavailable. The activity caption and source remain below.</div> : <img src={photo.path} alt={photo.alt} width={photo.width} height={photo.height} loading={loading} decoding="async" onError={()=>setFailed(true)}/>;
}
export function PhotoCarousel({photos}: {photos:DocumentaryPhoto[]}) {
 const [index,setIndex]=useState(0);
 const touch=useRef<{x:number;y:number}|null>(null);
 useEffect(()=>{if(photos.length<2)return;const timer=window.setInterval(()=>setIndex(i=>(i+1)%photos.length),4000);return()=>window.clearInterval(timer);},[photos.length]);
 const move=(n:number)=>setIndex((n+photos.length)%photos.length);
 const photo=photos[index];if(!photo)return null;
 return <section id="opening-pictures" className="photo-carousel" aria-label="Contributions in pictures" aria-roledescription="carousel"
 onKeyDown={e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();move(index+(e.key==='ArrowLeft'?-1:1));}}}
 onTouchStart={e=>{touch.current={x:e.touches[0].clientX,y:e.touches[0].clientY};}}
 onTouchEnd={e=>{const start=touch.current;touch.current=null;if(!start)return;const dx=e.changedTouches[0].clientX-start.x,dy=e.changedTouches[0].clientY-start.y;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy))move(index+(dx<0?1:-1));}}>
 <figure aria-live="off" aria-label={`Photograph ${index+1} of ${photos.length}`} aria-roledescription="slide">
 <div className="photo-frame" key={photo.id}><DocumentaryImage photo={photo} loading="eager"/></div>
 <figcaption><span className="photo-location">{photo.location} · Report: {photo.date}</span><p>{photo.caption}</p><div className="photo-links"><a href={sourceFor(photo.source).url} target="_blank" rel="noreferrer">{photo.credit}</a><a href={`#${photo.programme}`}>Explore the programme →</a></div></figcaption></figure>
 <div className="carousel-controls"><button aria-label="Previous photograph" onClick={()=>move(index-1)}>←</button>
 <div className="slide-indicators">{photos.map((p,i)=><button key={p.id} aria-label={`Show photograph ${i+1}`} aria-current={i===index?'true':undefined} onClick={()=>move(i)}>{String(i+1).padStart(2,'0')}</button>)}</div><button aria-label="Next photograph" onClick={()=>move(index+1)}>→</button></div>
</section>;
}
