import ts from 'typescript';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { readFile, writeFile } from 'node:fs/promises';
// Build a readable no-JavaScript story from the same records as the React view.
const compile = text => ts.transpileModule(text,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const moduleUrl = text => 'data:text/javascript;base64,'+Buffer.from(text).toString('base64');
const proposalCode = ts.transpileModule(await readFile('src/PilotProposal.tsx', 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText.replaceAll('"react/jsx-runtime"', JSON.stringify(import.meta.resolve('react/jsx-runtime')));
const proposalUrl = moduleUrl(proposalCode);
const slideUrl = moduleUrl(compile(await readFile('src/researchSlides.ts', 'utf8')));
const presentationCode = ts.transpileModule(await readFile('src/ResearchPresentation.tsx', 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX } }).outputText.replaceAll('"react/jsx-runtime"', JSON.stringify(import.meta.resolve('react/jsx-runtime'))).replaceAll("'./researchSlides'", JSON.stringify(slideUrl));
const presentationUrl = moduleUrl(presentationCode);
const { HomeProposal, PilotBrief } = await import(proposalUrl);
const staticProposal = renderToStaticMarkup(createElement(HomeProposal));
// Render the same illustration markup in both JavaScript-free entry screens.
const remoteSource = ts.transpileModule(await readFile('src/RemoteLearningArtwork.tsx', 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText.replaceAll('"react/jsx-runtime"', JSON.stringify(import.meta.resolve('react/jsx-runtime'))).replaceAll("'react'", JSON.stringify(import.meta.resolve('react')));
const { RemoteLearningArtwork } = await import(moduleUrl(remoteSource));
let artworkSerial = 0;
const storySource = ts.transpileModule(await readFile('src/SandboxStory.tsx', 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText.replaceAll('"react/jsx-runtime"', JSON.stringify(import.meta.resolve('react/jsx-runtime')));
const { SandboxStory } = await import(moduleUrl(storySource));
const remoteArtwork = () => renderToStaticMarkup(createElement(SandboxStory)) + '<div class="sandbox-community">' + renderToStaticMarkup(createElement(RemoteLearningArtwork), { identifierPrefix: `static-artwork-${++artworkSerial}-` }) + '</div>';
const staticPage = async (path, name) => {
 const code = ts.transpileModule(await readFile(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText.replaceAll('"react/jsx-runtime"', JSON.stringify(import.meta.resolve('react/jsx-runtime')));
 const exports = await import(moduleUrl(code.replaceAll("'./PilotProposal'", JSON.stringify(proposalUrl)).replaceAll("'./ResearchPresentation'", JSON.stringify(presentationUrl))));
 return renderToStaticMarkup(createElement(exports[name])).replaceAll('<h1>', '<h2>').replaceAll('</h1>', '</h2>')
  .replace(/<iframe[^>]*id="research-deck"[^>]*><\/iframe>/, '')
  .replace('<details class="research-linear">', '<details class="research-linear" open="">');
};
const [staticAbout, staticResearch] = await Promise.all([
 staticPage('src/AboutPage.tsx', 'AboutPage'),
 staticPage('src/ResearchDataCollectionPage.tsx', 'ResearchDataCollectionPage'),
]);

const evidenceUrl=moduleUrl(compile(await readFile('src/evidence.ts','utf8')));
const source=compile(await readFile('src/showcase.ts','utf8')).replace("'./evidence'",JSON.stringify(evidenceUrl));
const {achievements,photos,milestones,sourceFor,sourceRegister,leadershipReading}=await import(moduleUrl(source));
const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link=(id,label='Read source')=>`<a href="${esc(sourceFor(id).url)}">${esc(label)}</a>`;
const picture=p=>`<figure><a href="${esc(p.path)}"><img src="${esc(p.path)}" alt="${esc(p.alt)}" width="${p.width}" height="${p.height}" loading="lazy"></a><figcaption>${esc(p.caption)}<p>${esc(p.location)} · Report: ${esc(p.date)} · ${link(p.source,p.credit)}</p></figcaption></figure>`;
const leader=photos.find(p=>p.id==='leadership');
const html=`<link rel="stylesheet" href="/static-story.css"><main class="static-story">
<nav aria-label="Main navigation"><a href="#static-home">Home – Tribute to Gufwan</a> &middot; <span>Possible Projects: <a href="#static-research">Research &amp; Data Collection</a> &middot; <a href="#static-explore">Learning Sandbox</a></span> &middot; <a href="#static-about">About</a></nav><section id="static-home"><p>IMPACT MOSAIC / DISABILITY INCLUSION</p><h1>Building a more inclusive Nigeria.</h1>
<p>Chief Ayuba Gufwan, Executive Secretary of the National Commission for Persons with Disabilities (NCPWD).</p>
<p>An independent, source-linked showcase. The learning sandbox requires JavaScript; the documented story and downloads remain available below.</p>
${staticProposal}${picture(photos[0])}<h2>Chief Ayuba Gufwan.</h2><p>Appointed on 6 August 2024, Gufwan brings a background in law and disability advocacy. FMINO's leadership profile describes more than three decades of advocacy and an approach built on development partnerships.</p>${link('leadership','Read the leadership profile')}<h3>More of his story.</h3><ul>${leadershipReading.map(story=>`<li>${link(story.id,story.title)}<p>${esc(story.summary)}</p></li>`).join('')}</ul>${picture(leader)}
<h2>Participation, in practice.</h2>${achievements.map((a,i)=>`<article id="static-${esc(a.id)}"><h3>${i+1}. ${esc(a.title)}</h3><p>${esc(a.status)} · ${esc(a.location)} · Report: ${esc(a.date)}</p>${photos.filter(p=>a.photos.includes(p.id)||(a.id==='institutions'&&p.id==='leadership')).map(picture).join('')}<p>${esc(a.account)}</p><p><b>Gufwan / NCPWD's role:</b> ${esc(a.role)}</p><p><b>Partner credit:</b> ${esc(a.partners)}</p><p><b>Evidence and activity status:</b> ${esc(a.evidence)}</p>${link(a.source)}${a.id==='institutions'?`<p>${link('cbm','CBM report')} · ${link('data','NDMIS report')}</p>`:''}${a.id==='livelihoods'?`<p>${link('partnership','Skills partnership report')}</p>`:''}</article>`).join('')}
<h2>Milestones during his tenure.</h2>${milestones.map(m=>`<details><summary>${esc(m.date)} &middot; ${esc(m.title)}</summary><p>${esc(m.status)}</p><p>${esc(m.text)}</p>${photos.find(p=>p.source===m.source)?picture(photos.find(p=>p.source===m.source)):""}${link(m.source)}<p>Evidence caveat: ${esc(achievements.find(a=>a.source===m.source)?.evidence||sourceFor(m.source).summary)}</p></details>`).join('')}
<h2>Sources you can check.</h2><p>Reviewed 4 October 2026. Historical reports are not open application calls. No currently verified live opportunity is listed.</p>${sourceRegister.map(s=>`<article><h3>${link(s.id,s.title)}</h3><p>${esc(s.date)} · ${esc(s.summary)}</p></article>`).join('')}</section><section id="static-explore"><div class="site-page-heading"><div><h2>Learning Sandbox.</h2><p>Build practical skills with guidance and support. The learner, facilitator and Administration screens require JavaScript.</p></div></div>${remoteArtwork()}</section>
<section id="static-research">${staticResearch}</section>

<section id="static-about">${staticAbout}</section><footer><a href="https://deerflow.tech" target="_blank" rel="noreferrer">Created By Deerflow</a></footer></main>`;
let index=await readFile('index.html','utf8');
index=index.replace(/\s*<!-- static-story:start -->[\s\S]*?<!-- static-story:end -->/,'');
index=index.replace('<div id="root"></div>',`<div id="root"></div>\n    <!-- static-story:start --><noscript>${html}</noscript><!-- static-story:end -->`);
await writeFile('index.html',index);
await writeFile('public/downloads/plateau-pilot-discussion-brief.html', `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Plateau Pilot Discussion Brief | Impact Mosaic</title><link rel="stylesheet" href="/pilot-brief.css"></head><body><a class="skip-link" href="#brief-main">Skip to brief</a>${renderToStaticMarkup(createElement(PilotBrief))}</body></html>\n`);
await writeFile('docs/documentary-photo-manifest.json',JSON.stringify(photos.map(p=>({...p,sourceUrl:sourceFor(p.source).url})),null,2)+'\n');
console.log('Generated no-JavaScript story: eight chapters, ten photos, timeline, planned sampling framework and sources.');
