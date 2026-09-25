import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve(process.argv[2] || '.');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let file = resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
    if (!file.startsWith(root + sep)) { res.writeHead(403).end(); return; }
    if (root === resolve('.') && ['/favicon.svg', '/CNAME'].includes(pathname)) file = resolve('public', pathname.slice(1));
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'text/plain' });
    res.end(data);
  } catch { res.writeHead(404).end('Not found'); }
}).listen(5173, '0.0.0.0', () => console.log('http://localhost:5173'));
