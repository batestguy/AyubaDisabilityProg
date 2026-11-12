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
  const explanation = document.querySelector('#explanation-dialog');
  const viewer = document.querySelector('#slide-viewer');
  const modalOpen = () => menu.open || sources.open || explanation.open || viewer.open;
  const viewport = viewer.querySelector('.viewer-scroll');
  const canvas = viewer.querySelector('.viewer-canvas');
  const viewerImage = document.querySelector('#viewer-image');
  let zoom = 1, viewerTrigger, pinch;
  function setZoom(value) {
   const old = zoom;
   zoom = Math.max(1, Math.min(8, value));
   const x = (viewport.scrollLeft + viewport.clientWidth / 2) / old;
   const y = (viewport.scrollTop + viewport.clientHeight / 2) / old;
   canvas.style.width = `${viewport.clientWidth * zoom}px`;
   document.querySelector('#zoom-level').textContent = `${Math.round(zoom * 100)}%`;
   document.querySelector('#zoom-out').disabled = zoom === 1;
   document.querySelector('#zoom-in').disabled = zoom === 8;
   viewport.scrollLeft = x * zoom - viewport.clientWidth / 2;
   viewport.scrollTop = y * zoom - viewport.clientHeight / 2;
  }
  document.querySelector('#zoom-in').onclick = () => setZoom(zoom * 1.5);
  document.querySelector('#zoom-out').onclick = () => setZoom(zoom / 1.5);
  document.querySelector('#zoom-reset').onclick = () => setZoom(1);
  document.querySelectorAll('.slide-image-button').forEach(button => button.onclick = () => {
   viewerTrigger = button;
   viewerImage.src = button.querySelector('img').src;
   viewerImage.alt = button.querySelector('img').alt;
   viewer.showModal();
   zoom = 1; setZoom(3); viewport.scrollTo(0, 0);
  });
  viewer.addEventListener('close', () => {
   pinch = null;
   const target = viewerTrigger?.getClientRects().length ? viewerTrigger : document.querySelector('.slides>section.present');
   target?.focus({preventScroll:true});
  });
  viewer.addEventListener('keydown', e => {
   if(e.key === 'Tab') {
    const controls = [...viewer.querySelectorAll('button,[tabindex="0"]')].filter(n=>!n.disabled && n.getClientRects().length);
    const first = controls[0], last = controls.at(-1);
    if(e.shiftKey && document.activeElement === first) {e.preventDefault();last.focus();}
    else if(!e.shiftKey && document.activeElement === last) {e.preventDefault();first.focus();}
   }
   if(e.key === '+' || e.key === '=') { e.preventDefault(); setZoom(zoom * 1.5); }
   if(e.key === '-') { e.preventDefault(); setZoom(zoom / 1.5); }
   if(e.key === '0') { e.preventDefault(); setZoom(1); }
  });
  viewport.addEventListener('touchstart', e => {
   if(e.touches.length === 2) { e.preventDefault(); pinch = { distance: Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY), zoom }; }
  }, {passive:false});
  viewport.addEventListener('touchmove', e => {
   if(pinch && e.touches.length === 2) { e.preventDefault(); setZoom(pinch.zoom * Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY) / pinch.distance); }
  }, {passive:false});
  viewport.addEventListener('touchend', () => { pinch = null; });
  window.addEventListener('resize', () => { if(viewer.open) setZoom(zoom); });
  const trigger = document.querySelector('#menu-trigger'), previous = document.querySelector('#previous'), next = document.querySelector('#next'), selector = document.querySelector('#slide-selector');
  let timer, returnFocus = trigger;
  const awake = () => { document.body.classList.add('controls-awake'); clearTimeout(timer); timer = setTimeout(() => { if (!modalOpen() && document.activeElement !== trigger) document.body.classList.remove('controls-awake'); }, 2200); };
  document.addEventListener('pointermove', awake, {passive:true});
  document.addEventListener('focusin', awake);
  trigger.addEventListener('blur', awake);
  trigger.onclick = () => menu.showModal();
  document.querySelectorAll('[data-close]').forEach(b => b.onclick = () => b.closest('dialog').close());
  menu.addEventListener('close', () => { trigger.focus(); awake(); });
  sources.addEventListener('close', () => { returnFocus.focus(); awake(); });
  let explanationTrigger;
  document.querySelectorAll('[data-explanation]').forEach(button => button.addEventListener('click', () => {
   const slide = button.closest('.slides > section');
   const record = records[slides.indexOf(slide)];
   const pathway = record.pathway;
   const key = button.dataset.explanation;
   explanation.dataset.kind = key === 'bayesian' ? 'bayesian' : 'cycle';
   const item = key === 'bayesian' ? { ...record.recruitment.explanation, explanation: record.recruitment.explanation.text } : key === 'database' ? pathway.database : pathway.steps[Number(key.slice(5))];
   document.querySelector('#explanation-title').textContent = item.title;
   document.querySelector('#explanation-text').textContent = item.explanation;
   const symbols = document.querySelector('#explanation-symbols');
   symbols.open = false;
   symbols.hidden = !item.symbols;
   document.querySelector('#explanation-symbol-text').textContent = item.symbols || '';
   const status = document.querySelector('#explanation-status');
   status.hidden = !item.status;
   status.textContent = item.status || '';

   explanationTrigger = button;
   touch = null;
   window.speechSynthesis?.cancel();
   explanation.showModal();
   placeThought();
   explanation.querySelector('.thought-content').scrollTop = 0;
  }));
  function placeThought() {
   if(!explanation.open || !explanationTrigger) return;
   const target = (explanationTrigger.closest('[data-cycle-step],.cycle-hub') || explanationTrigger).getBoundingClientRect();
   const width = explanation.getBoundingClientRect().width, height = explanation.getBoundingClientRect().height;
   const gap = 32, edge = 16;
   let x, y, side;
   if(target.right + gap + width <= innerWidth - edge) {
    x = target.right + gap; y = target.top + (target.height - height) / 2; side = 'left';
   } else if(target.left - gap - width >= edge) {
    x = target.left - gap - width; y = target.top + (target.height - height) / 2; side = 'right';
   } else {
    x = target.left + (target.width - width) / 2;
    if(target.bottom + gap + height <= innerHeight - edge) { y = target.bottom + gap; side = 'top'; }
    else if(target.top - gap - height >= edge) { y = target.top - gap - height; side = 'bottom'; }
    else { y = (innerHeight - height) / 2; side = target.top < innerHeight / 2 ? 'top' : 'bottom'; }
   }
   x = Math.max(edge, Math.min(x, innerWidth - width - edge));
   y = Math.max(edge, Math.min(y, innerHeight - height - edge));
   explanation.style.left = `${x}px`; explanation.style.top = `${y}px`;
   explanation.dataset.tail = side;
   const anchor = side === 'left' || side === 'right' ? target.top + target.height / 2 - y : target.left + target.width / 2 - x;
   explanation.style.setProperty('--thought-anchor', `${Math.max(32, Math.min(anchor, (side === 'left' || side === 'right' ? height : width) - 32))}px`);
  }
  window.addEventListener('resize', placeThought);
  document.querySelector('#explanation-symbols').addEventListener('toggle', () => requestAnimationFrame(placeThought));
  explanation.addEventListener('keydown', event => {
   if(event.key !== 'Tab') return;
   const controls = [...explanation.querySelectorAll('summary,button,a[href],select,input,textarea,[tabindex="0"]')].filter(e => !e.disabled && e.getClientRects().length);
   const first = controls[0], last = controls.at(-1);
   if(event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
   else if(!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  explanation.addEventListener('close', () => { touch = null; explanationTrigger?.focus({preventScroll:true}); awake(); });
  let backdropStart = false;
  const outside = event => { const r = explanation.getBoundingClientRect(); return event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom; };
  explanation.addEventListener('pointerdown', event => { backdropStart = event.target === explanation && outside(event); });
  explanation.addEventListener('click', event => { if(backdropStart && event.target === explanation && outside(event)) explanation.close(); backdropStart = false; });
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
   if(modalOpen()) return;
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
   if(i !== contentsIndex) lastContentSlide = slides[i].id;
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
  next.onclick = () => { if(!modalOpen()) deck.getIndices().h === slides.length-1 ? finish() : deck.next(); };
  document.querySelector('#back').onclick = () => { if(modalOpen()) return; deck.prev(); if(document.querySelector('#back').disabled) next.focus(); };
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
   if(modalOpen() || e.altKey || e.ctrlKey || e.metaKey || e.target.closest('select,input,textarea,summary,.contents-nav')) return;
   const actions={ArrowRight:()=>deck.next(),PageDown:()=>deck.next(),ArrowLeft:()=>deck.prev(),PageUp:()=>deck.prev(),Home:()=>deck.slide(0),End:()=>deck.slide(slides.length-1)};
   if(actions[e.key]) {e.preventDefault(); actions[e.key]();}
  });
  let touch;
  document.addEventListener('touchstart',e=>{if(modalOpen() || e.target.closest('.contents-nav')){touch=null;return;}touch=e.touches.length===1 ? {x:e.touches[0].clientX,y:e.touches[0].clientY}:null;},{passive:true});
  document.addEventListener('touchend',e=>{if(!touch || modalOpen() || e.changedTouches.length!==1)return; const dx=e.changedTouches[0].clientX-touch.x,dy=e.changedTouches[0].clientY-touch.y; touch=null; if(Math.abs(dx)>70 && Math.abs(dx)>Math.abs(dy)*1.7) dx<0 ? deck.next() : deck.prev();},{passive:true});
  function preference(id,cls) { const b=document.querySelector(id); b.setAttribute('aria-pressed',String(document.documentElement.classList.contains(cls))); b.onclick=()=>{const enabled=document.documentElement.classList.toggle(cls); b.setAttribute('aria-pressed',String(enabled));}; }
  preference('#deck-large','large'); preference('#deck-motion','reduce');
  document.querySelector('#deck-read').onclick=()=>{const status=document.querySelector('#speech-status'); if(!('speechSynthesis' in window)){status.textContent='Device read-aloud is unavailable.';return;} speechSynthesis.cancel();const record=records[deck.getIndices().h];const utterance=new SpeechSynthesisUtterance([record.title,...record.points].join('. '));utterance.lang='en';speechSynthesis.speak(utterance);};
  document.querySelector('#deck-stop').onclick=()=>window.speechSynthesis?.cancel();
  window.addEventListener('pagehide',()=>window.speechSynthesis?.cancel());
  deck.on('slidechanged',update); update();
 };
 if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else void init();
})();
