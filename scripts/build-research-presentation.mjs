import ts from 'typescript';
import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

await mkdir('public/research', { recursive: true });
const code = ts.transpileModule(await readFile('src/researchSlides.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { researchSlides: slides, researchSections: sections } = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
const esc = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const caption = image => `${esc(image.caption)} ${image.source ? `<a href="${esc(image.source)}">${esc(image.credit)}</a>` : esc(image.credit)}`;
const points = slide => `<ul>${slide.points.map(p => `<li>${esc(p)}</li>`).join('')}</ul><p class="slide-note">${esc(slide.note)}</p>${(slide.links || []).map(l => `<p><a href="${esc(l.url)}">${esc(l.label)}</a></p>`).join('')}`;
const figure = (image, interactive) => `<figure><a href="${esc(image.path)}"><img src="${esc(image.path)}" alt="${esc(image.alt)}" width="900" height="600"></a><figcaption>${caption(image)}</figcaption></figure>`;
const contents = (interactive) => `<nav class="contents-nav" aria-label="Presentation contents">${sections.map((section, i) => {
 const available = section.subsections.find(item => item.destination);
 const destination = item => interactive ? `#/${item.destination}` : `#${item.destination}`;
 return `<details class="contents-section" data-section="${esc(section.id)}"><summary><span class="contents-number">${String(i+1).padStart(2,'0')}</span><span>${esc(section.title)}</span>${available ? '' : '<span class="planned-label">Planned</span>'}</summary><div class="contents-subsections">${available ? `<a class="section-start" href="${destination(available)}" ${interactive ? `data-slide="${esc(available.destination)}"` : ''}>Go to section <span aria-hidden="true">→</span></a>` : ''}<ul>${section.subsections.map(item => `<li>${item.destination ? `<a href="${destination(item)}" ${interactive ? `data-slide="${esc(item.destination)}"` : ''}><span>${esc(item.title)}</span><span class="contents-page">${String(item.slideNumber).padStart(2,'0')} <span aria-hidden="true">→</span></span></a>` : `<span class="planned-item"><span>${esc(item.title)}</span><span class="contents-page">${String(item.slideNumber).padStart(2,'0')} · Planned</span></span>`}</li>`).join('')}</ul></div></details>`;
}).join('')}</nav>`;
// Native illustrative symbols describe concepts; they depict no real participants or results.
const journeyArt = [
 `<path d="M30 43Q80 8 130 43M40 72H120" fill="none" stroke="#d29a45" stroke-width="4" stroke-dasharray="5 5"/><path d="M13 98V81Q13 64 32 64Q51 64 51 81V98M109 98V81Q109 64 128 64Q147 64 147 81V98" fill="#167b63"/><circle cx="32" cy="48" r="14" fill="#91502d"/><circle cx="128" cy="48" r="14" fill="#91502d"/><path d="M48 103V83Q48 57 80 57Q112 57 112 83V103" fill="#124b61"/><circle cx="80" cy="36" r="19" fill="#ac623b"/><path d="M61 32Q60 10 80 13Q101 11 99 32L90 23L68 26Z" fill="#35231f"/><path d="M63 82H97" stroke="#efc88d" stroke-width="5" stroke-linecap="round"/>`,
 `<rect x="32" y="13" width="96" height="91" rx="7" fill="white" stroke="#124b61" stroke-width="3"/><path d="M50 13V6M110 13V6" stroke="#124b61" stroke-width="5" stroke-linecap="round"/><circle cx="61" cy="43" r="12" fill="#ac623b"/><path d="M43 71Q43 57 61 57Q79 57 79 71" fill="#167b63"/><path d="M89 37H112M89 49H106M48 84H104M48 93H91" stroke="#124b61" stroke-width="4" stroke-linecap="round"/><circle cx="127" cy="87" r="20" fill="#e6b75e"/><path d="M117 87L124 94L137 78" fill="none" stroke="#124b61" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`,
 `<circle cx="31" cy="33" r="15" fill="#ac623b"/><path d="M10 85V65Q10 49 31 49Q52 49 52 65V85" fill="#167b63"/><circle cx="129" cy="33" r="15" fill="#91502d"/><path d="M108 85V65Q108 49 129 49Q150 49 150 65V85" fill="#d29a45"/><rect x="49" y="43" width="62" height="44" rx="4" fill="#124b61"/><rect x="56" y="49" width="48" height="30" rx="2" fill="white"/><path d="M43 88H117L110 97H50Z" fill="#124b61"/><path d="M68 61H92M68 68H86" stroke="#167b63" stroke-width="4" stroke-linecap="round"/><path d="M59 19H101M96 14L103 19L96 24" fill="none" stroke="#d29a45" stroke-width="3"/>`,
 `<path d="M22 83H139V96H22Z" fill="#124b61"/><path d="M35 96V109M126 96V109" stroke="#124b61" stroke-width="8"/><path d="M32 67L55 46Q62 40 68 47L77 59L68 79H40Z" fill="#ac623b"/><path d="M131 65L107 45Q100 40 94 47L85 59L94 79H123Z" fill="#91502d"/><path d="M71 22L84 17L101 66L87 71Z" fill="#e6b75e"/><path d="M87 71L100 66L98 84Z" fill="#124b61"/><path d="M48 22L59 33L55 44L44 48L33 37L37 26L43 34L48 32Z" fill="#167b63"/><path d="M55 43L79 70" stroke="#167b63" stroke-width="10" stroke-linecap="round"/>`,
 `<rect x="28" y="12" width="86" height="94" rx="6" fill="white" stroke="#124b61" stroke-width="3"/><rect x="51" y="6" width="40" height="15" rx="4" fill="#124b61"/><path d="M42 39L47 44L56 33M42 60L47 65L56 54M42 81L47 86L56 75" fill="none" stroke="#167b63" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M66 39H97M66 60H92M66 81H87" stroke="#124b61" stroke-width="4" stroke-linecap="round"/><circle cx="119" cy="80" r="24" fill="#e6b75e" stroke="#124b61" stroke-width="3"/><path d="M119 65V80L130 86" fill="none" stroke="#124b61" stroke-width="4" stroke-linecap="round"/>`
];
const journeySymbol = index => `<svg class="journey-art" viewBox="0 0 160 116" aria-hidden="true" focusable="false"><path d="M7 65Q2 11 78 7Q154 1 155 64Q160 112 80 112Q3 113 7 65" fill="#fff3de"/>${journeyArt[index]}</svg>`;
const cycleRing = `<svg class="cycle-ring" viewBox="0 0 780 560" aria-hidden="true" focusable="false"><defs><marker id="adaptive-cycle-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="11" markerHeight="11" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#efc88d"/></marker></defs><g class="cycle-spokes">${Array.from({length:5},(_,i)=>{const angle=(-90+i*72)*Math.PI/180;const inner=115,outer=i===0?145:165;const x1=390+inner*Math.cos(angle),y1=290+inner*Math.sin(angle),x2=390+outer*Math.cos(angle),y2=290+outer*Math.sin(angle);return `<path class="cycle-spoke" d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="#efc88d" stroke-width="2" opacity=".7" marker-end="url(#adaptive-cycle-arrow)"/>`;}).join('')}<path d="M380 135L380 192" fill="none" stroke="#efc88d" stroke-width="2" opacity=".7" marker-end="url(#adaptive-cycle-arrow)"/></g><circle class="closed-cycle" cx="390" cy="290" r="220" fill="none" stroke="#efc88d" stroke-width="3" opacity=".55"/>${Array.from({length:5},(_,i)=>{const angle=(-90+i*72+25)*Math.PI/180,end=(-90+(i+1)*72-25)*Math.PI/180;return `<path d="M${390+220*Math.cos(angle)} ${290+220*Math.sin(angle)} A220 220 0 0 1 ${390+220*Math.cos(end)} ${290+220*Math.sin(end)}" fill="none" stroke="#efc88d" stroke-width="5" marker-end="url(#adaptive-cycle-arrow)"/>`;}).join('')}<g class="cycle-map-dots">${Array.from({length:5},(_,i)=>{const angle=(-90+i*72)*Math.PI/180,x=390+220*Math.cos(angle),y=290+220*Math.sin(angle);return `<circle cx="${x}" cy="${y}" r="25" fill="#701f18" stroke="#efc88d" stroke-width="2"/><text x="${x}" y="${y+10}" text-anchor="middle" fill="white" font-size="28">${i+1}</text>`;}).join('')}</g></svg>`;
const databaseSymbol = `<svg class="database-art" viewBox="0 0 56 60" aria-hidden="true" focusable="false"><path d="M5 12V47C5 59 51 59 51 47V12" fill="none" stroke="currentColor" stroke-width="3"/><ellipse cx="28" cy="12" rx="23" ry="9" fill="none" stroke="currentColor" stroke-width="3"/><path d="M5 29C5 41 51 41 51 29M5 43C5 55 51 55 51 43" fill="none" stroke="currentColor" stroke-width="3"/></svg>`;
const top = '';
const countWord = ['zero','one','two','three','four','five','six','seven','eight','nine','ten'][slides.length] || String(slides.length);
const CountWord = countWord[0].toUpperCase() + countWord.slice(1);
const controls = `<button id="back" class="back-button" disabled><span aria-hidden="true">←</span> Back</button><button id="exit-presentation" class="exit-presentation-button">Exit presentation</button><button id="contents" class="contents-button">Contents</button><button id="menu-trigger" class="menu-trigger" aria-haspopup="dialog" aria-controls="deck-menu">Menu</button><span id="slide-count" class="deck-count" role="status" aria-live="polite">1 / ${slides.length}</span><button id="next" class="next-button">Next <span aria-hidden="true">→</span></button>
<dialog id="deck-menu" aria-labelledby="menu-title"><h2 id="menu-title">Presentation menu</h2><button data-close>Close menu</button><nav aria-label="Presentation options"><button id="previous">Previous slide</button><label>Choose a slide<select id="slide-selector">${slides.map((s, i) => `<option value="${i}">${i + 1}. ${esc(s.title)}</option>`).join('')}</select></label><button id="fullscreen">Full screen</button><a href="reading.html" target="_top">Reading edition / print</a><a href="/?page=research-reading" target="_top">Detailed Research proposal</a><button id="sources">Sources and full image</button><details><summary>Accessibility options</summary><button id="deck-large" aria-pressed="false">A+ Text</button><button id="deck-motion" aria-pressed="false">Reduce motion</button><button id="deck-read">Read current slide aloud</button><button id="deck-stop">Stop reading</button><span id="speech-status" role="status"></span></details><button id="exit">Exit presentation</button></nav></dialog>
<dialog id="explanation-dialog" aria-labelledby="explanation-title" aria-describedby="explanation-text"><div class="thought-content"><h2 id="explanation-title"></h2><p id="explanation-text"></p><details id="explanation-symbols" hidden><summary>What the symbols mean</summary><p id="explanation-symbol-text"></p></details><p id="explanation-status" hidden></p><button data-close autofocus>Close</button></div></dialog>
<dialog id="sources-dialog" aria-labelledby="sources-title"><h2 id="sources-title">Sources and full image</h2><button data-close>Close sources</button><div id="source-content"></div></dialog><script src="deck.js"></script>`;
const composition = slide => {
 const title = `<h2>${esc(slide.title).replaceAll('\n', '<br>')}</h2>`;
 const lines = slide.points.map(p => `<p>${esc(p)}</p>`).join('');
 if (slide.layout === 'cover') return `<div class="composition cover"><img class="cover-art" src="${esc(slide.images[0].path)}" alt="${esc(slide.images[0].alt)}"><div class="cover-shade"></div><div class="slide-copy">${title}<p class="tagline">${esc(slide.points[0])}</p><div class="pilot-lines"><p>${esc(slide.points[1])}</p><p>${esc(slide.points[2])}</p></div><div class="creators"><p>${esc(slide.points[3])}</p><p>${esc(slide.points[4])}</p></div></div></div>`;
 if (slide.layout === 'contents') return `<div class="composition contents"><div class="mosaic-motif" aria-hidden="true"></div><div class="slide-copy">${title}${contents(true)}</div></div>`;
 if (slide.layout === 'database') {
  const d = slide.database;
  if (!d) throw new Error('Database slide requires shared content');
  const photo = slide.images[0];
  const motifs = [
   '<path d="M4 5h6q2 0 2 2v12q0-2-2-2H4zM20 5h-6q-2 0-2 2v12q0-2 2-2h6z"/>',
   '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="m12 12 8-8M16 4h4v4"/>',
   '<path d="M8 11V7a4 4 0 0 1 8 0v4M5 11h14v9H5zM12 14v3"/>',
   '<path d="M4 19V5M4 19h16M7 15l4-5 4 2 5-7"/>'
  ];
  const icon = i => `<svg viewBox="0 0 24 24" class="database-record-icon" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${motifs[i]}</g></svg>`;
  return `<div class="composition database-slide"><div class="slide-copy"><header class="database-header">${title}<p>${esc(d.subtitle)}</p></header><div class="database-layout"><div class="database-acknowledgment"><figure class="database-portrait"><img src="${esc(photo.path)}" alt="${esc(photo.alt)}"><figcaption><a href="${esc(photo.source)}" target="_blank" rel="noopener">Photo: FMINO · separate from the interview</a></figcaption></figure><blockquote class="database-quote"><span class="database-quote-mark" aria-hidden="true">“</span><p>${esc(d.quote)}</p></blockquote><p class="database-attribution"><strong>${esc(d.attribution)}</strong><span>TheCable · ${esc(d.interviewDate)}</span><a class="database-interview-link" href="${esc(d.interviewSource)}" target="_blank" rel="noopener">Read the interview <span aria-hidden="true">↗</span></a></p></div><div class="database-flow" data-database-flow role="group" aria-label="Proposed participant database for Nigeria: learners join through adaptive snowball recruitment and facilitators through volunteering or recruitment; their records support needs, teaching, support and progress decisions"><p class="database-intro">${esc(d.intro)}</p><div class="database-inlets">${d.inlets.map((inlet,i)=>`<div class="database-inlet"><svg viewBox="0 0 48 40" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">${i===0?'<circle cx="17" cy="11" r="6"/><path d="M5 33v-4q0-10 12-10t12 10v4M33 17h10m-5-5 5 5-5 5"/>':'<circle cx="24" cy="9" r="5"/><path d="M8 20h11q5 0 5 4 0-4 5-4h11v16H29q-5 0-5 3 0-3-5-3H8zM24 24v15"/>'}</g></svg><span><strong>${esc(inlet.title)}</strong><small>${esc(inlet.detail)}</small></span></div>`).join('')}</div><svg class="database-incoming database-arrow" viewBox="0 0 600 55" preserveAspectRatio="none" aria-hidden="true" focusable="false"><defs><marker id="database-incoming-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10Z" fill="currentColor"/></marker></defs><path d="M150 4C150 26 300 12 300 30M450 4C450 26 300 12 300 30" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M300 30V48" fill="none" stroke="currentColor" stroke-width="2.5" marker-end="url(#database-incoming-head)"/></svg><div class="database-vessel"><svg class="database-shell" viewBox="0 0 600 280" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M25 40C25-3 575-3 575 40V238C575 283 25 283 25 238Z" fill="#fff8ef" stroke="#efc88d" stroke-width="2"/><ellipse cx="300" cy="40" rx="275" ry="32" fill="#f5e5cf" stroke="#d4aa72" stroke-width="2"/><path d="M25 225C25 270 575 270 575 225" fill="none" stroke="#d4aa72" stroke-width="1.5"/></svg><h3>Participant database</h3><ul>${d.records.map((record,i)=>`<li>${icon(i)}<span>${esc(record)}</span></li>`).join('')}</ul></div><svg class="database-branches database-arrow" viewBox="0 0 600 65" preserveAspectRatio="none" aria-hidden="true" focusable="false"><defs><marker id="database-branch-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10Z" fill="currentColor"/></marker></defs>${[75,225,375,525].map(x=>`<path d="M300 0V12C300 28 ${x} 24 ${x} 52" fill="none" stroke="currentColor" stroke-width="2" marker-end="url(#database-branch-head)"/>`).join('')}</svg><ul class="database-outcomes">${d.outcomes.map((outcome,i)=>`<li>${icon(i)}<span>${esc(outcome)}</span></li>`).join('')}</ul><p class="database-update">Records inform decisions. Progress updates the records.</p><p class="database-status">${esc(d.status)}</p></div></div></div></div>`;
 }
 if (slide.layout === 'recruitment') {
  const r = slide.recruitment;
  if (!r) throw new Error('Recruitment slide requires shared content');
  const image = slide.images[0];
  // Conceptual dots only: fixed positions shared by all three rounds, no real people or counts.
  const seeds = [[30,28],[70,64],[32,84]];
  const reached = [[52,14],[10,50],[50,44],[78,32],[96,50],[90,86],[60,98],[12,100]];
  const links = [[0,0],[0,1],[0,2],[0,3],[1,4],[1,5],[1,6],[1,2],[2,7],[2,6],[2,1]];
  const cluster = [[122,18],[146,16],[156,38],[138,48],[118,40]];
  const newSeed = [137,31];
  const dot = ([x,y], kind) => kind === 'seed' ? `<circle cx="${x}" cy="${y}" r="6.5" fill="#efc88d" stroke="#fff8ef" stroke-width="1.5"/>` : kind === 'reached' ? `<circle cx="${x}" cy="${y}" r="4.6" fill="#fff8ef"/>` : `<circle cx="${x}" cy="${y}" r="4.2" fill="none" stroke="#d9c3bc" stroke-width="1.6"/>`;
  const line = ([x1,y1],[x2,y2]) => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#efc88d" stroke-width="1.6" opacity=".8"/>`;
  const roundArt = i => {
   let body = '<rect x="1" y="1" width="178" height="108" rx="10" fill="#803026" stroke="#b27552"/>';
   if (i === 0) body += [...reached, ...cluster].map(p => dot(p, 'missing')).join('') + seeds.map(p => dot(p, 'seed')).join('');
   else {
    body += links.map(([a,b]) => line(seeds[a], reached[b])).join('');
    if (i === 2) body += cluster.map(p => line(newSeed, p)).join('');
    body += `<circle cx="137" cy="31" r="29" fill="none" stroke="${i === 2 ? '#efc88d' : '#d9c3bc'}" stroke-width="1.4" stroke-dasharray="4 4"/>`;
    body += `<text x="137" y="76" text-anchor="middle" font-size="9.5" font-family="Segoe UI, sans-serif" fill="${i === 2 ? '#efc88d' : '#eadbd6'}">${i === 2 ? 'New contact' : 'Not reached yet'}</text>`;
    body += reached.map(p => dot(p, 'reached')).join('') + cluster.map(p => dot(p, i === 2 ? 'reached' : 'missing')).join('') + seeds.map(p => dot(p, 'seed')).join('');
    if (i === 2) body += dot(newSeed, 'seed');
   }
   return `<svg class="recruitment-round-art" viewBox="0 0 180 110" preserveAspectRatio="xMinYMid meet" role="img" aria-label="${esc(r.rounds[i].label + ': ' + r.rounds[i].detail)}" focusable="false">${body}</svg>`;
  };
  const swatch = kind => `<svg class="recruitment-swatch" viewBox="0 0 16 16" aria-hidden="true" focusable="false">${dot([8,8], kind === 0 ? 'seed' : kind === 1 ? 'reached' : 'missing')}</svg>`;
  const loopLabel = `Adaptive snowball recruitment in three rounds. ${r.rounds.map(round => `${round.label}: ${round.title}`).join('. ')}. Then the next round starts again with what we learned.`;
  return `<div class="composition recruitment"><div class="slide-copy"><header class="recruitment-header">${title}<p>${esc(r.subtitle)}</p></header><div class="recruitment-grid"><div class="recruitment-foundation"><figure><img src="${esc(image.path)}" alt="${esc(image.alt)}"><figcaption><p>${esc(r.foundation)}</p><span class="recruitment-credit">Beautiful Gate / Senator Abba Moro partnership<br><a href="${esc(image.source)}" target="_blank" rel="noopener">Photo: The Qualitative Magazine</a></span></figcaption></figure></div><div class="recruitment-proposal"><div class="recruitment-purpose"><h3 class="recruitment-question">${esc(r.question)}</h3><p>${esc(r.answer)}</p></div><div class="recruitment-loop" data-recruitment-loop role="group" aria-label="${esc(loopLabel)}"><ol class="recruitment-rounds">${r.rounds.map((round,i)=>`<li>${roundArt(i)}<span class="recruitment-round-label">${esc(round.label)}</span><span class="recruitment-round-title">${esc(round.title)}</span>${i<2?'<span class="recruitment-round-arrow" aria-hidden="true">→</span>':''}</li>`).join('')}</ol><p class="recruitment-next"><span><span aria-hidden="true">↺ </span>${esc(r.nextRound)}</span></p><ul class="recruitment-legend" aria-label="Key">${r.legend.map((item,i)=>`<li>${swatch(i)}<span>${esc(item)}</span></li>`).join('')}</ul></div><p class="recruitment-distinction"><strong>${esc(r.distinction[0])}</strong> ${esc(r.distinction[1])}</p><p class="recruitment-limit">${esc(r.limit)}</p><div class="recruitment-maths"><h3>${esc(r.mathsHeading)}</h3><button type="button" class="equation-trigger" data-explanation="bayesian" aria-label="${esc(r.equationLabel)}" aria-haspopup="dialog" aria-controls="explanation-dialog"><span aria-hidden="true">${esc(r.equation)}</span><span class="equation-open" aria-hidden="true">↗</span></button><p class="equation-instruction">Proposed Bayesian refinement · Select to explore</p></div></div></div></div></div>`;
 }
 if (slide.layout === 'cycle') {
  const c = slide.cycle;
  if (!c) throw new Error('Cycle slide requires shared content');
  // Ring drawn in a stretchable box; stroke width stays constant, arrowheads are positioned by CSS.
  const point = deg => { const a = deg * Math.PI / 180; return [(500 + 370 * Math.cos(a)).toFixed(1), (500 + 360 * Math.sin(a)).toFixed(1)]; };
  const [sx, sy] = point(205), [ex, ey] = point(245);
  const ring = `<svg class="cycle7-ring-art" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true" focusable="false"><ellipse cx="500" cy="500" rx="370" ry="360" fill="none" stroke="#efc88d" stroke-width="3" opacity=".6" vector-effect="non-scaling-stroke"/><path class="cycle7-restart-arc" d="M${sx} ${sy}A370 360 0 0 1 ${ex} ${ey}" fill="none" stroke="#ffd98f" stroke-width="9" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>`;
  const arrows = [306, 18, 90, 162].map(a => `<span class="cycle7-arrow" data-angle="${a}" aria-hidden="true"></span>`).join('') + '<span class="cycle7-arrow cycle7-arrow-restart" data-angle="245" aria-hidden="true"></span>';
  const inputIcons = ['<path d="M4 19V5M4 19h16M7 15l4-5 4 2 5-7"/>', '<path d="M4 5h11v8H9l-4 3v-3H4zM15 9h5v8h-1v3l-4-3h-4v-4"/>'];
  const inputIcon = i => `<svg class="cycle7-input-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${inputIcons[i]}</g></svg>`;
  const ringLabel = `Proposed cycle around the ${c.hub.title.toLowerCase()}: ${c.stages.map((stage,i)=>`${i+1}, ${stage.title}: ${stage.need}`).join('; ')}. A restart arrow leads from stage 5 back to stage 1, fed by ${c.restart.inputs.join(' and ').toLowerCase()}.`;
  return `<div class="composition cycle-slide"><div class="slide-copy"><header class="cycle7-header">${title}<p>${esc(c.subtitle)}</p></header><div class="cycle7-layout"><div class="cycle7-restart"><h3>${esc(c.restart.title)}</h3><ul>${c.restart.inputs.map((input,i)=>`<li>${inputIcon(i)}<span>${esc(input)}</span></li>`).join('')}</ul><span class="cycle7-restart-down" aria-hidden="true">↓</span><p class="cycle7-result">${esc(c.restart.result)}</p></div><div class="cycle7-ring" data-cycle-complete role="group" aria-label="${esc(ringLabel)}">${ring}${arrows}<span class="cycle7-restart-tag" aria-hidden="true">Restart ↻</span><div class="cycle7-hub">${databaseSymbol}<strong>${esc(c.hub.title)}</strong><span>${esc(c.hub.detail)}</span></div><ol class="cycle7-stages">${c.stages.map((stage,i)=>`<li data-stage="${i+1}"><h3><span class="cycle7-number" aria-hidden="true">${i+1}</span>${esc(stage.title)}</h3><p>${esc(stage.need)}</p></li>`).join('')}</ol></div></div><p class="cycle7-statement">${esc(c.statement)}</p><p class="cycle7-status">${esc(c.status)}</p></div></div>`;
 }
 if (slide.layout === 'closing') {
  const c = slide.closing;
  if (!c) throw new Error('Closing slide requires shared content');
  const photo = slide.images[0];
  const tick = '<svg class="closing-tick" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M7.5 12.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  return `<div class="composition closing-slide"><div class="slide-copy"><div class="closing-layout"><figure class="closing-photo"><img src="${esc(photo.path)}" alt="${esc(photo.alt)}"><figcaption><strong>${esc(photo.displayCredit.name)}</strong><span>${esc(photo.displayCredit.credit)} · <a href="${esc(photo.source)}" target="_blank" rel="noopener">${esc(photo.displayCredit.sourceLabel)}</a></span><span class="closing-photo-limit">Independent proposal · This photograph records Gufwan’s 2025 national recognition, not an endorsement of this proposal</span></figcaption></figure><div class="closing-copy">${title}<p class="closing-headline">${esc(c.headline)}</p><p class="closing-message">${esc(c.message)}</p><ul class="closing-together">${c.together.map(item=>`<li>${tick}<span>${esc(item)}</span></li>`).join('')}</ul><div class="closing-brand"><img class="closing-brand-art" src="/impact-mosaic-unity-haircuts.png" alt=""><div><p class="closing-wordmark">${esc(c.brand)}</p><p class="closing-tagline">${esc(c.tagline)}</p><p class="closing-creators">${c.creators.map(esc).join(' · ')}</p></div></div></div></div></div></div>`;
 }
 if (slide.layout === 'pathway') {
  const p = slide.pathway;
  if (!p) throw new Error('Pathway slide requires its shared diagram content');
  return `<div class="composition pathway illustrated-journey adaptive-cycle"><div class="slide-copy">${title}<div class="pathway-diagram" role="group" aria-label="Continuous adaptive recruitment and learning cycle"><div class="cycle-grid"><div class="pathway-foundation"><div class="foundation-copy"><span class="pathway-eyebrow">${esc(p.foundation.title)}</span><p>${esc(p.foundation.detail)}</p></div><div class="foundation-photos" role="group" aria-label="Documentary collage of community mobility support and inclusive-education discussion">${slide.images.map(image=>`<figure><img src="${esc(image.path)}" alt="${esc(image.alt)}"><figcaption>${esc(image.displayCredit?.name || image.caption)}</figcaption></figure>`).join('')}</div></div><div class="cycle-extension"><div class="extension-heading"><svg class="foundation-connection" viewBox="0 0 80 24" aria-hidden="true" focusable="false"><path d="M0 12H75M65 3L76 12L65 21" fill="none" stroke="currentColor" stroke-width="3"/></svg><h3>${esc(p.extensionLabel)}</h3><p class="extension-subtitle">${esc(p.extensionSubtitle)}</p><p class="extension-instruction">${esc(p.instruction)}</p></div><div class="cycle-area" data-continuous-cycle>${cycleRing}<div class="cycle-hub"><div class="pathway-database">${databaseSymbol}<h3><button type="button" class="explanation-trigger" data-explanation="database" aria-haspopup="dialog" aria-controls="explanation-dialog">${esc(p.database.title)}</button></h3><p class="database-role">Records inform every decision</p><ul>${p.database.records.map(record=>`<li>${esc(record)}</li>`).join('')}</ul></div></div><ol class="pathway-steps">${p.steps.map((step,i)=>`<li data-cycle-step="${i+1}"><div class="journey-scene">${journeySymbol(i)}<span class="pathway-number" aria-hidden="true">${String(i+1).padStart(2,'0')}</span></div><h3${i===0?' class="sampling-emphasis"':''}><button type="button" class="explanation-trigger" data-explanation="step-${i}" aria-haspopup="dialog" aria-controls="explanation-dialog">${esc(step.title)}</button></h3><p${i===0?' class="sampling-promise"':''}>${esc(step.summary || step.detail)}</p></li>`).join('')}</ol><p class="cycle-repeat">Update records → adapt → repeat</p></div></div></div><p class="cycle-insight">Recruitment builds the database. Records guide decisions. Progress updates the database.</p><p class="pathway-status">${esc(p.status)}</p></div></div></div>`;
 }
 const image = slide.images[0];
 const photo = `<img src="${esc(image.path)}" alt="${esc(image.alt)}">`;
 const credit = image.displayCredit;
 const visual = credit ? `<figure class="credited-photo">${photo}<figcaption class="photo-credit"><strong>${esc(credit.name)}</strong><span>${esc(credit.credit)} · <a href="${esc(image.source)}" target="_blank" rel="noopener">${esc(credit.sourceLabel)}</a></span></figcaption></figure>` : photo;
 return `<div class="composition split"><div class="slide-copy">${title}<div class="supporting">${lines}</div></div><div class="slide-visual${credit ? ' credited' : ''}">${visual}</div></div>`;
};
await writeFile('public/research/slides.json', JSON.stringify(slides));
await writeFile('presentation/before.html', top);
await writeFile('presentation/after.html', controls);
const qmd = `---
pagetitle: "Research proposal | Impact Mosaic"
format:
  revealjs:
    theme: simple
    title-slide: false
    menu: false
    preview-links: false
    html-math-method: plain
    controls: false
    progress: false
    transition: none
    navigation-mode: linear
    slide-level: 2
    center: false
    hash: false
    history: false
    overview: false
    touch: false
    keyboard: false
    disable-layout: true
    auto-stretch: false
    view-distance: 5
    css: ../public/research/deck.css
    include-before-body: before.html
    include-after-body: after.html
    self-contained: false
    output-file: index.html
---

${slides.map((slide, i) => `## ${slide.title.replaceAll('\n', ' ')} {#research-slide-${i + 1} .layout-${slide.layout}}

\x60\x60\x60{=html}
${composition(slide)}
\x60\x60\x60`).join('\n\n')}
`;
await writeFile('presentation/research.qmd', qmd);
execFileSync(process.platform === 'win32' ? 'C:/Program Files/Quarto/bin/quarto.exe' : 'quarto', ['render', 'presentation/research.qmd'], { stdio: 'inherit' });
await cp('presentation/research_files', 'public/research/research_files', { recursive: true });
let html = await readFile('presentation/index.html', 'utf8');
// These slides use our own controls/dialogs and native text equations, without speaker tools.
// Remove optional plugins, including Quarto's menu with inline event handlers.
html = html.replace(/<script src="[^"]*\/plugin\/[^\"]+"><\/script>/g, '');
html = html.replace(/plugins:\s*\[[\s\S]*?\]/, 'plugins: []');
for (const match of html.matchAll(/href="(research_files\/[^\"]*\/theme\/[^\"]+\.css)"/g)) {
 const file = `public/research/${match[1]}`;
 const css = await readFile(file, 'utf8');
 // The deck uses installed Segoe UI; no imported web fonts are needed.
 await writeFile(file, css.replace(/@import[^;]+;/g, ''));
}
// External scripts allow the deck to keep the site's script-src 'self' policy.
let serial = 0;
const scripts = [];
html = html.replace(/<script(\s[^>]*)?>([\s\S]*?)<\/script>/g, (full, attrs = '', body) => {
 if (/\bsrc=/.test(attrs) || /type=["'](?:application\/json|application\/ld\+json)["']/.test(attrs) || !body.trim()) return full;
 const name = `quarto-init-${++serial}.js`;
 scripts.push(writeFile(`public/research/${name}`, body));
 return `<script${attrs} src="${name}"></script>`;
});
html = html.replaceAll('../public/research/deck.css', 'deck.css');
html = html.replace(/<style[^>]*>([\s\S]*?)<\/style>/g, (_, css) => {
 const name = `quarto-style-${++serial}.css`;
 scripts.push(writeFile(`public/research/${name}`, css));
 return `<link rel="stylesheet" href="${name}">`;
});
html = html.replace('width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, minimal-ui', 'width=device-width, initial-scale=1');
html = html.replace(/<body([^>]*)>/, `<body$1><noscript><main class="linear-page"><h1>Impact Mosaic</h1><p><a href="reading.html">Read all ${slides.length} slides without JavaScript</a></p></main></noscript>`);
html = html.replace('</head>', '<link rel="icon" href="/impact-mosaic-unity-haircuts.png"></head>');
await Promise.all(scripts);
await writeFile('public/research/index.html', html);
await writeFile('public/research/reading.html', `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Research proposal — ${countWord} slides, reading edition</title><link rel="stylesheet" href="deck.css"></head><body><main class="linear-page"><a href="/?page=research">Return to the presentation</a> · <a href="/?page=research-reading#static-research">Detailed Research proposal</a><h1>Impact Mosaic</h1><p>${CountWord} opening slides · Independent proposal · Recruitment is not open.</p><a href="index.html">Open the presentation</a>${slides.map((s, i) => `<article id="research-slide-${i+1}"><h2>${i+1}. ${esc(s.title)}</h2>${s.layout === 'contents' ? contents(false) + `<p class="slide-note">${esc(s.note)}</p>` : points(s)}${s.images.map(image => figure(image, false)).join('')}</article>`).join('')}</main></body></html>`);
console.log(`Built ${countWord} Quarto/reveal.js slides and matching linear reading edition.`);
