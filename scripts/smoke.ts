import { readFile, access } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { routes } from '../src/app/routes';
import { deploymentBase } from '../src/lib/urls';
for (const route of routes) {
  const html = await readFile(`dist${route.path}index.html`, 'utf8');
  assert.match(html, /<h1[ >]/, `${route.path}: missing prerendered h1`);
  assert.match(html, /<link rel="canonical"/);
  assert.match(html, /<meta name="description"/);
  assert.ok(!html.includes('<!--app-->'));
  for (const [, asset] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if (asset.startsWith(deploymentBase + 'assets/'))
      await access('dist/' + asset.slice(deploymentBase.length));
  }
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    if (!href.startsWith(deploymentBase) || href.startsWith('//')) continue;
    const [path, anchor] = href.slice(deploymentBase.length).split('#');
    if (/\.[a-z0-9]+$/.test(path)) {
      await access('dist/' + path);
      continue;
    }
    const target = await readFile(`dist/${path}index.html`, 'utf8');
    if (anchor)
      assert.ok(target.includes(`id="${anchor}"`), `Missing anchor ${href}`);
  }
}
for (const path of ['404.html', 'robots.txt', 'sitemap.xml', '.nojekyll'])
  await access(`dist/${path}`);
console.log(
  'Static HTML, all local links/anchors, metadata and fingerprinted assets verified.',
);

if (deploymentBase !== '/') await assert.rejects(access('dist/CNAME'));
