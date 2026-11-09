// Local verification only. Applies the checked-in Pages _headers rules to dist.
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('dist');
const port = Number(process.env.PORT || 4175);
const raw = await readFile('dist/_headers', 'utf8');
const rules = [];
for (const line of raw.split(/\r?\n/)) {
 if (!line.trim()) continue;
 if (!/^\s/.test(line)) rules.push({ pattern: line.trim(), headers: [] });
 else rules.at(-1).headers.push(line.trim());
}
const types = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2', '.woff': 'font/woff', '.pdf': 'application/pdf' };
http.createServer(async (req, res) => {
 try {
  const url = new URL(req.url, 'http://localhost');
  const headers = {};
  for (const rule of rules) {
   if (!(rule.pattern.endsWith('*') ? url.pathname.startsWith(rule.pattern.slice(0, -1)) : url.pathname === rule.pattern)) continue;
   for (const entry of rule.headers) {
    if (entry.startsWith('! ')) { delete headers[entry.slice(2).toLowerCase()]; continue; }
    const colon = entry.indexOf(':'); headers[entry.slice(0, colon).toLowerCase()] = entry.slice(colon + 1).trim();
   }
  }
  let file = path.resolve(root, '.' + decodeURIComponent(url.pathname));
  if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403).end(); return; }
  try { if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html'); } catch { if (!path.extname(file)) file = path.join(root, 'index.html'); }
  const bytes = await readFile(file);
  res.writeHead(200, { ...headers, 'Content-Type': types[path.extname(file)] || 'application/octet-stream' }).end(bytes);
 } catch { res.writeHead(404).end('Not found'); }
}).listen(port, '127.0.0.1', () => console.log(`Local production verification: http://127.0.0.1:${port}`));
