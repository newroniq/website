import { readFile, access } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { routes } from '../src/app/routes';
import { deploymentBase } from '../src/lib/urls';
import { elementContent, textContent } from './html';

const documents = new Map<string, Promise<string>>();
function readDocument(path: string): Promise<string> {
  let document = documents.get(path);
  if (!document) {
    document = readFile(path, 'utf8');
    documents.set(path, document);
  }
  return document;
}
const pages = await Promise.all(
  routes.map(async (route) => ({
    route,
    html: await readDocument(`dist${route.path}index.html`),
  })),
);
const titles = new Set<string>();
const canonicals = new Set<string>();

function validateStructuredData(html: string, route: (typeof routes)[number]) {
  const json = elementContent(
    html,
    /<script type="application\/ld\+json">/,
    '</script>',
  );
  assert.ok(json, `${route.path}: missing structured data`);
  const structured = JSON.parse(json) as {
    '@context': string;
    '@graph': Record<string, unknown>[];
  };
  assert.equal(structured['@context'], 'https://schema.org');
  assert.ok(
    structured['@graph'].some((item) => item['@type'] === 'Organization'),
  );
  if ('article' in route)
    assert.ok(structured['@graph'].some((item) => item['@type'] === 'Article'));
  if (route.path === '/services/')
    assert.equal(
      structured['@graph'].filter((item) => item['@type'] === 'Service').length,
      6,
    );
}

function validatePage({ route, html }: (typeof pages)[number]) {
  assert.equal(
    [...html.matchAll(/<h1[ >]/g)].length,
    1,
    `${route.path}: expected one prerendered h1`,
  );
  const footer = elementContent(html, /<footer\b[^<>]*>/, '</footer>');
  assert.ok(footer, `${route.path}: missing footer`);
  assert.equal(
    footer.split('Think Bold. Build Reality.').length - 1,
    1,
    `${route.path}: expected the exact brand tagline once`,
  );
  assert.ok(
    !footer.includes('From AI Ambition to'),
    `${route.path}: homepage headline must not replace the tagline`,
  );
  if (route.path === '/') {
    const heading = elementContent(html, /<h1\b[^<>]*>/, '</h1>');
    assert.ok(heading, 'Homepage heading is missing');
    assert.equal(
      textContent(heading),
      'Enterprise AI Strategy &amp; Architecture',
    );
  }
  assert.equal(
    [...html.matchAll(/<title>/g)].length,
    1,
    `${route.path}: expected one title`,
  );
  const title = /<title>([^<]*)<\/title>/.exec(html)?.[1];
  const canonical = /rel="canonical" href="([^"]+)"/.exec(html)?.[1];
  assert.ok(
    title && !titles.has(title),
    `${route.path}: missing or duplicate title`,
  );
  assert.ok(
    canonical && !canonicals.has(canonical),
    `${route.path}: missing or duplicate canonical`,
  );
  titles.add(title);
  canonicals.add(canonical);
  assert.ok(
    !html.includes('content="noindex"'),
    `${route.path}: public page must be indexable`,
  );
  assert.ok(/<meta name="description"/.test(html));
  assert.ok(!html.includes('<!--app-->'));
  assert.ok(
    !html.includes('googletagmanager.com'),
    'Unaudited tracking must remain disabled',
  );
  assert.ok(
    !html.includes('fonts.googleapis.com'),
    'Fonts must be self hosted',
  );
  assert.ok(
    !/(?:hello|outcomes)@newroniq\.com/.test(html),
    'Outdated public email',
  );
  validateStructuredData(html, route);
}
pages.forEach(validatePage);

async function checkLocalLink(href: string) {
  const parsed = new URL(href, 'https://static.test');
  const path = parsed.pathname.slice(deploymentBase.length);
  const anchor = parsed.hash.slice(1);
  if (/\.[a-z0-9]+$/.test(path)) return access('dist/' + path);
  const target = await readDocument(`dist/${path}index.html`);
  if (anchor)
    assert.ok(target.includes(`id="${anchor}"`), `Missing anchor ${href}`);
}
const assets = new Set(
  pages.flatMap(({ html }) =>
    Array.from(
      html.matchAll(/(?:src|href)="([^"]+)"/g),
      (match) => match[1],
    ).filter((asset) => asset.startsWith(deploymentBase + 'assets/')),
  ),
);
const links = new Set(
  pages.flatMap(({ html }) =>
    Array.from(html.matchAll(/href="([^"]+)"/g), (match) => match[1]).filter(
      (href) => href.startsWith(deploymentBase) && !href.startsWith('//'),
    ),
  ),
);
await Promise.all([
  ...Array.from(assets, (asset) =>
    access('dist/' + asset.slice(deploymentBase.length)),
  ),
  ...Array.from(links, checkLocalLink),
  ...['404.html', 'robots.txt', 'sitemap.xml', '.nojekyll'].map((path) =>
    access(`dist/${path}`),
  ),
]);
if (deploymentBase !== '/') await assert.rejects(access('dist/CNAME'));
console.log(
  'Static HTML, all local links/anchors, metadata and fingerprinted assets verified.',
);
