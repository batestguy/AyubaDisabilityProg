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
const controls = `<button id="back" class="back-button" disabled><span aria-hidden="true">←</span> Back</button><button id="exit-presentation" class="exit-presentation-button">Exit presentation</button><button id="contents" class="contents-button">Contents</button><button id="menu-trigger" class="menu-trigger" aria-haspopup="dialog" aria-controls="deck-menu">Menu</button><span id="slide-count" class="deck-count" role="status" aria-live="polite">1 / 5</span><button id="next" class="next-button">Next <span aria-hidden="true">→</span></button>
<dialog id="deck-menu" aria-labelledby="menu-title"><h2 id="menu-title">Presentation menu</h2><button data-close>Close menu</button><nav aria-label="Presentation options"><button id="previous">Previous slide</button><label>Choose a slide<select id="slide-selector">${slides.map((s, i) => `<option value="${i}">${i + 1}. ${esc(s.title)}</option>`).join('')}</select></label><button id="fullscreen">Full screen</button><a href="reading.html" target="_top">Reading edition / print</a><a href="/?page=research-reading" target="_top">Detailed Research proposal</a><button id="sources">Sources and full image</button><details><summary>Accessibility options</summary><button id="deck-large" aria-pressed="false">A+ Text</button><button id="deck-motion" aria-pressed="false">Reduce motion</button><button id="deck-read">Read current slide aloud</button><button id="deck-stop">Stop reading</button><span id="speech-status" role="status"></span></details><button id="exit">Exit presentation</button></nav></dialog>
<dialog id="explanation-dialog" aria-labelledby="explanation-title" aria-describedby="explanation-text"><div class="thought-content"><h2 id="explanation-title"></h2><p id="explanation-text"></p><button data-close autofocus>Close</button></div></dialog>
<dialog id="sources-dialog" aria-labelledby="sources-title"><h2 id="sources-title">Sources and full image</h2><button data-close>Close sources</button><div id="source-content"></div></dialog><script src="deck.js"></script>`;
const composition = slide => {
 const title = `<h2>${esc(slide.title).replaceAll('\n', '<br>')}</h2>`;
 const lines = slide.points.map(p => `<p>${esc(p)}</p>`).join('');
 if (slide.layout === 'cover') return `<div class="composition cover"><img class="cover-art" src="${esc(slide.images[0].path)}" alt="${esc(slide.images[0].alt)}"><div class="cover-shade"></div><div class="slide-copy">${title}<p class="tagline">${esc(slide.points[0])}</p><div class="pilot-lines"><p>${esc(slide.points[1])}</p><p>${esc(slide.points[2])}</p></div><div class="creators"><p>${esc(slide.points[3])}</p><p>${esc(slide.points[4])}</p></div></div></div>`;
 if (slide.layout === 'contents') return `<div class="composition contents"><div class="mosaic-motif" aria-hidden="true"></div><div class="slide-copy">${title}${contents(true)}</div></div>`;
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
// These five slides use our own controls/dialogs and no equations or speaker tools.
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
html = html.replace(/<body([^>]*)>/, '<body$1><noscript><main class="linear-page"><h1>Impact Mosaic</h1><p><a href="reading.html">Read all five slides without JavaScript</a></p></main></noscript>');
html = html.replace('</head>', '<link rel="icon" href="/impact-mosaic-unity-haircuts.png"></head>');
await Promise.all(scripts);
await writeFile('public/research/index.html', html);
await writeFile('public/research/reading.html', `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Research proposal — five slides, reading edition</title><link rel="stylesheet" href="deck.css"></head><body><main class="linear-page"><a href="/?page=research">Return to the presentation</a> · <a href="/?page=research-reading#static-research">Detailed Research proposal</a><h1>Impact Mosaic</h1><p>Five opening slides · Independent proposal · Recruitment is not open.</p><a href="index.html">Open the presentation</a>${slides.map((s, i) => `<article id="research-slide-${i+1}"><h2>${i+1}. ${esc(s.title)}</h2>${s.layout === 'contents' ? contents(false) + `<p class="slide-note">${esc(s.note)}</p>` : points(s)}${s.images.map(image => figure(image, false)).join('')}</article>`).join('')}</main></body></html>`);
console.log('Built five Quarto/reveal.js slides and matching linear reading edition.');
