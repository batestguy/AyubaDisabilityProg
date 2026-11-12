import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

// Serve the generated deck directly so capture never depends on a running dev server.
const root = resolve('public');
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2'};
const server = createServer(async (req, res) => {
 try {
  const path = resolve(root, '.' + decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(!path.startsWith(root + sep)) { res.writeHead(403).end(); return; }
  const body = await readFile(path);
  res.writeHead(200, {'Content-Type':types[extname(path)] || 'application/octet-stream'}).end(body);
 } catch { res.writeHead(404).end(); }
});
await new Promise(r => server.listen(0,'127.0.0.1',r));
let browser;
try {
 await mkdir('public/research/mobile',{recursive:true});
 browser = await chromium.launch({channel:'chrome',headless:true});
 const page = await browser.newPage({viewport:{width:1600,height:1000},deviceScaleFactor:2,reducedMotion:'reduce'});
 await page.goto(`http://127.0.0.1:${server.address().port}/research/index.html`);
 await page.locator('#slide-count').filter({hasText:'1 / 8'}).waitFor();
 await page.evaluate(() => document.fonts.ready);
 await page.addStyleTag({content:'body>button,body>.deck-count{visibility:hidden!important}.entering{animation:none!important}'});
 const captures=[];
 for(let index=2;index<8;index++) {
  await page.evaluate(i=>window.Reveal.slide(i),index);
  const composition=page.locator('.slides>section.present>.composition');
  await composition.locator('img').evaluateAll(nodes=>Promise.all(nodes.map(n=>n.decode())));
  const clipped = await composition.evaluate(el => {
   const section=el.parentElement, bounds=section.getBoundingClientRect();
   const issues=[];
   if(section.scrollHeight>section.clientHeight+2 || section.scrollWidth>section.clientWidth+2) issues.push('slide scrolls');
   for(const node of el.querySelectorAll('p,h2,h3,figcaption,li,button,img')) {
    if(!node.getClientRects().length)continue;
    const r=node.getBoundingClientRect();
    if(r.left<bounds.left-2||r.top<bounds.top-2||r.right>bounds.right+2||r.bottom>bounds.bottom+2) issues.push(node.textContent?.slice(0,70)||node.tagName);
   }
   return issues;
  });
  assert.deepEqual(clipped,[],`Slide ${index+1} capture must include all content`);
  const filename=`mobile/slide-${index+1}.png`;
  await composition.screenshot({path:`public/research/${filename}`,animations:'disabled'});
  captures.push({slide:index+1,file:filename,width:3200,height:2000});
 }
 const hash=createHash('sha256');
 for(const path of ['src/researchSlides.ts','scripts/build-research-presentation.mjs','public/research/deck.css','public/research/deck.js','scripts/capture-research-slides.mjs']) hash.update(await readFile(path));
 await writeFile('public/research/mobile/manifest.json',JSON.stringify({sourceHash:hash.digest('hex'),captures},null,2)+'\n');
 console.log('Captured six 3200 × 2000 desktop slide images; clipping checks passed.');
} finally { await browser?.close(); await new Promise(r=>server.close(r)); }
