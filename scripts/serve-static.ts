import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { deploymentBase, normalizeBase } from '../src/lib/urls';
const base = normalizeBase(deploymentBase);
const root = resolve('dist');
const types: Record<string, string> = {
  '.svg': 'image/svg+xml',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};
createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(
      new URL(request.url ?? '/', 'http://localhost').pathname,
    );
    if (!pathname.startsWith(base)) throw new Error('Outside deployment base');
    let path = resolve(root, pathname.slice(base.length));
    if (path !== root && !path.startsWith(root + '/'))
      throw new Error('Outside root');
    if ((await stat(path)).isDirectory()) {
      if (!pathname.endsWith('/')) {
        response.writeHead(301, { Location: pathname + '/' }).end();
        return;
      }
      path += '/index.html';
    }
    const body = await readFile(path);
    response
      .writeHead(200, {
        'Content-Type': types[extname(path)] ?? 'application/octet-stream',
      })
      .end(body);
  } catch {
    response
      .writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
      .end(await readFile(root + '/404.html'));
  }
}).listen(4173, '127.0.0.1', () =>
  console.log(`Static site: http://127.0.0.1:4173${base}`),
);
