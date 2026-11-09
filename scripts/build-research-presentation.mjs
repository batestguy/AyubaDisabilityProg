import ts from 'typescript';
import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

await mkdir('public/research', { recursive: true });
const code = ts.transpileModule(await readFile('src/researchSlides.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { researchSlides: slides } = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
const esc = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const caption = image => `${esc(image.caption)} ${image.source ? `<a href="${esc(image.source)}">${esc(image.credit)}</a>` : esc(image.credit)}`;
const points = slide => `<ul>${slide.points.map(p => `<li>${esc(p)}</li>`).join('')}</ul><p class="slide-note">${esc(slide.note)}</p>${(slide.links || []).map(l => `<p><a href="${esc(l.url)}">${esc(l.label)}</a></p>`).join('')}`;
const figure = (image, interactive) => `<figure><a href="${esc(image.path)}"><img src="${esc(image.path)}" alt="${esc(image.alt)}" width="900" height="600"></a><figcaption>${caption(image)}</figcaption></figure>`;
const top = '';
const controls = `<button id="back" class="back-button" disabled><span aria-hidden="true">←</span> Back</button><button id="menu-trigger" class="menu-trigger" aria-haspopup="dialog" aria-controls="deck-menu">Menu</button><span id="slide-count" class="deck-count" role="status" aria-live="polite">1 / 5</span><button id="next" class="next-button">Next <span aria-hidden="true">→</span></button>
<dialog id="deck-menu" aria-labelledby="menu-title"><h2 id="menu-title">Presentation menu</h2><button data-close>Close menu</button><nav aria-label="Presentation options"><button id="previous">Previous slide</button><label>Choose a slide<select id="slide-selector">${slides.map((s, i) => `<option value="${i}">${i + 1}. ${esc(s.title)}</option>`).join('')}</select></label><button id="fullscreen">Full screen</button><a href="reading.html" target="_top">Reading edition / print</a><a href="/?page=research-reading" target="_top">Detailed Research proposal</a><button id="sources">Sources and full image</button><details><summary>Accessibility options</summary><button id="deck-large" aria-pressed="false">A+ Text</button><button id="deck-motion" aria-pressed="false">Reduce motion</button><button id="deck-read">Read current slide aloud</button><button id="deck-stop">Stop reading</button><span id="speech-status" role="status"></span></details><button id="exit">Exit presentation</button></nav></dialog>
<dialog id="sources-dialog" aria-labelledby="sources-title"><h2 id="sources-title">Sources and full image</h2><button data-close>Close sources</button><div id="source-content"></div></dialog><script src="deck.js"></script>`;
const composition = slide => {
 const title = `<h2>${esc(slide.title).replaceAll('\n', '<br>')}</h2>`;
 const lines = slide.points.map(p => `<p>${esc(p)}</p>`).join('');
 if (slide.layout === 'cover') return `<div class="composition cover"><img class="cover-art" src="${esc(slide.images[0].path)}" alt="${esc(slide.images[0].alt)}"><div class="cover-shade"></div><div class="slide-copy">${title}<p class="tagline">${esc(slide.points[0])}</p><div class="pilot-lines"><p>${esc(slide.points[1])}</p><p>${esc(slide.points[2])}</p></div><div class="creators"><p>${esc(slide.points[3])}</p><p>${esc(slide.points[4])}</p></div></div></div>`;
 if (slide.layout === 'contents') return `<div class="composition contents"><div class="mosaic-motif" aria-hidden="true"></div><div class="slide-copy">${title}<ol>${slide.points.map(p => `<li>${esc(p)}</li>`).join('')}</ol></div></div>`;
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
html = html.replace('</head>', '<link rel="icon" href="/impact-mosaic-unity-crutch.png"></head>');
await Promise.all(scripts);
await writeFile('public/research/index.html', html);
await writeFile('public/research/reading.html', `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Research proposal — five slides, reading edition</title><link rel="stylesheet" href="deck.css"></head><body><main class="linear-page"><a href="/?page=research">Return to the presentation</a> · <a href="/?page=research-reading#static-research">Detailed Research proposal</a><h1>Impact Mosaic</h1><p>Five opening slides · Independent proposal · Recruitment is not open.</p><a href="index.html">Open the presentation</a>${slides.map((s, i) => `<article><h2>${i+1}. ${esc(s.title)}</h2>${points(s)}${s.images.map(image => figure(image, false)).join('')}</article>`).join('')}</main></body></html>`);
console.log('Built five Quarto/reveal.js slides and matching linear reading edition.');
