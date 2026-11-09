(() => {
 const init = async () => {
  if (!window.Reveal?.isReady()) { setTimeout(init, 40); return; }
  const deck = window.Reveal;
  deck.configure({ disableLayout:true, embedded:true, transition:'none', controls:false, progress:false, keyboard:false, touch:false, overview:false, autoSlide:0, loop:false });
  const slides = [...document.querySelectorAll('.slides > section')];
  if(parent !== window) for(const cls of ['large','reduce']) document.documentElement.classList.toggle(cls,parent.document.documentElement.classList.contains(cls));
  const records = await fetch('slides.json').then(r => { if(!r.ok) throw Error('Slide sources unavailable'); return r.json(); });
  const proposal = document.querySelector('a[href="/?page=research-reading"]');
  const hostParams = new URLSearchParams((parent !== window ? parent.location : location).search);
  if(hostParams.get('workspace') === 'earlier') proposal.href = '/?workspace=earlier&page=research-reading';
  const menu = document.querySelector('#deck-menu'), sources = document.querySelector('#sources-dialog');
  const trigger = document.querySelector('#menu-trigger'), previous = document.querySelector('#previous'), next = document.querySelector('#next'), selector = document.querySelector('#slide-selector');
  let timer, returnFocus = trigger;
  const awake = () => { document.body.classList.add('controls-awake'); clearTimeout(timer); timer = setTimeout(() => { if (!menu.open && !sources.open && document.activeElement !== trigger) document.body.classList.remove('controls-awake'); }, 2200); };
  document.addEventListener('pointermove', awake, {passive:true});
  document.addEventListener('focusin', awake);
  trigger.addEventListener('blur', awake);
  trigger.onclick = () => menu.showModal();
  document.querySelectorAll('[data-close]').forEach(b => b.onclick = () => b.closest('dialog').close());
  menu.addEventListener('close', () => { trigger.focus(); awake(); });
  sources.addEventListener('close', () => { returnFocus.focus(); awake(); });
  const contentsButton = document.querySelector('#contents');
  const contentsSlide = slides.find(s => s.classList.contains('layout-contents'));
  const contentsIndex = slides.indexOf(contentsSlide);
  const groups = [...contentsSlide.querySelectorAll('.contents-section')];
  let lastContentSlide;
  groups.forEach(group => group.addEventListener('toggle', () => {
   if(group.open) groups.forEach(other => { if(other !== group && other.open) other.open = false; });
  }));
  contentsSlide.querySelectorAll('[data-slide]').forEach(link => link.addEventListener('click', event => {
   event.preventDefault();
   const index = slides.findIndex(s => s.id === link.dataset.slide);
   if(index < 0) return;
   deck.slide(index);
   slides[index].focus({preventScroll:true});
  }));
  contentsButton.onclick = () => {
   contentsSlide.querySelectorAll('[aria-current]').forEach(link => link.removeAttribute('aria-current'));
   const current = lastContentSlide && contentsSlide.querySelector(`li a[data-slide="${lastContentSlide}"]`);
   if(current) {
    const group = current.closest('details');
    groups.forEach(other => { other.open = other === group; });
    current.setAttribute('aria-current','page');
   }
   deck.slide(contentsIndex);
   (current || groups[0].querySelector('summary')).focus({preventScroll:true});
   if(current) current.scrollIntoView({block:'nearest'});
  };
  function update() {
   const i = deck.getIndices().h;
   if(i !== contentsIndex) lastContentSlide = i > contentsIndex ? slides[i].id : undefined;
   contentsButton.hidden = i === contentsIndex;
   previous.disabled = i === 0; document.querySelector('#back').disabled = i === 0; selector.value = String(i);
   next.replaceChildren(document.createTextNode(i === slides.length - 1 ? 'Finish' : 'Next '));
   if(i < slides.length - 1) { const arrow = document.createElement('span'); arrow.setAttribute('aria-hidden','true'); arrow.textContent='→'; next.append(arrow); }
   document.querySelector('#slide-count').textContent = `${i+1} / ${slides.length}`;
   slides.forEach((s,n) => { s.tabIndex=n===i ? 0 : -1; s.inert=n!==i; s.setAttribute('aria-hidden',String(n!==i)); });
   const composition = slides[i].querySelector('.composition'); composition.classList.remove('entering'); void composition.offsetWidth; composition.classList.add('entering');
   slides[i].scrollTop=0;
   window.speechSynthesis?.cancel();
  }
  const finish = () => {
   window.speechSynthesis?.cancel();
   if(parent !== window) parent.postMessage({type:'mosaic-presentation-exit'}, location.origin);
   else { if(document.fullscreenElement) void document.exitFullscreen().catch(()=>{}); location.assign('/'); }
  };
  next.onclick = () => deck.getIndices().h === slides.length-1 ? finish() : deck.next();
  document.querySelector('#back').onclick = () => { deck.prev(); if(document.querySelector('#back').disabled) next.focus(); };
  previous.onclick = () => { deck.prev(); menu.close(); next.focus(); };
  selector.onchange = () => { deck.slide(Number(selector.value)); menu.close(); next.focus(); };
  document.querySelector('#exit').onclick = finish;
  document.querySelector('#exit-presentation').onclick = finish;
  document.querySelector('#fullscreen').onclick = () => {
   const host = parent !== window ? parent.document : document;
   try { if(host.fullscreenElement) void host.exitFullscreen().catch(()=>{}); else void host.documentElement.requestFullscreen?.().catch(()=>{}); } catch {}
   menu.close();
  };
  document.querySelector('#sources').onclick = () => {
   const record = records[deck.getIndices().h], content = document.querySelector('#source-content'); content.replaceChildren();
   const note = document.createElement('p'); note.textContent = record.note; content.append(note);
   for(const item of record.images) {
    const figure=document.createElement('figure'), img=document.createElement('img'), caption=document.createElement('figcaption');
    img.src=item.path; img.alt=item.alt; caption.textContent=item.caption+' ';
    const credit=document.createElement(item.source ? 'a' : 'span'); if(item.source) credit.href=item.source; credit.textContent=item.credit; caption.append(credit); figure.append(img,caption); content.append(figure);
    const link=document.createElement('a'); link.href=item.path; link.target='_blank'; link.rel='noopener'; link.textContent='Open original image'; content.append(link);
   }
   for(const item of record.links || []) { const p=document.createElement('p'), a=document.createElement('a'); a.href=item.url; a.textContent=item.label; p.append(a); content.append(p); }
   returnFocus=trigger; menu.close(); sources.showModal();
  };
  document.addEventListener('keydown',e=>{
   if(menu.open || sources.open || e.altKey || e.ctrlKey || e.metaKey || e.target.closest('select,input,textarea,summary,.contents-nav')) return;
   const actions={ArrowRight:()=>deck.next(),PageDown:()=>deck.next(),ArrowLeft:()=>deck.prev(),PageUp:()=>deck.prev(),Home:()=>deck.slide(0),End:()=>deck.slide(slides.length-1)};
   if(actions[e.key]) {e.preventDefault(); actions[e.key]();}
  });
  let touch;
  document.addEventListener('touchstart',e=>{if(e.target.closest('.contents-nav')){touch=null;return;}touch=e.touches.length===1 ? {x:e.touches[0].clientX,y:e.touches[0].clientY}:null;},{passive:true});
  document.addEventListener('touchend',e=>{if(!touch || menu.open || sources.open || e.changedTouches.length!==1)return; const dx=e.changedTouches[0].clientX-touch.x,dy=e.changedTouches[0].clientY-touch.y; touch=null; if(Math.abs(dx)>70 && Math.abs(dx)>Math.abs(dy)*1.7) dx<0 ? deck.next() : deck.prev();},{passive:true});
  function preference(id,cls) { const b=document.querySelector(id); b.setAttribute('aria-pressed',String(document.documentElement.classList.contains(cls))); b.onclick=()=>{const enabled=document.documentElement.classList.toggle(cls); b.setAttribute('aria-pressed',String(enabled));}; }
  preference('#deck-large','large'); preference('#deck-motion','reduce');
  document.querySelector('#deck-read').onclick=()=>{const status=document.querySelector('#speech-status'); if(!('speechSynthesis' in window)){status.textContent='Device read-aloud is unavailable.';return;} speechSynthesis.cancel();const record=records[deck.getIndices().h];const utterance=new SpeechSynthesisUtterance([record.title,...record.points].join('. '));utterance.lang='en';speechSynthesis.speak(utterance);};
  document.querySelector('#deck-stop').onclick=()=>window.speechSynthesis?.cancel();
  window.addEventListener('pagehide',()=>window.speechSynthesis?.cancel());
  deck.on('slidechanged',update); update();
 };
 if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else void init();
})();
