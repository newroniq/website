import './load-public-env';
import { structuredData } from '../src/lib/structured-data';
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { dirname } from 'node:path';
import { prerender } from 'react-dom/static';
import { App } from '../src/app/App';
import { routes } from '../src/app/routes';
import { site } from '../src/lib/content';
import { seo } from '../src/lib/content/seo';
import { deploymentBase, normalizeBase } from '../src/lib/urls';
import { escapeHtml, serializeJsonLd } from './html';

const base = normalizeBase(deploymentBase);
const siteURL = new URL(process.env.SITE_URL ?? site.url);
if (
  siteURL.protocol !== 'https:' ||
  !siteURL.pathname.endsWith('/') ||
  siteURL.pathname !== base
) {
  throw new Error(
    'SITE_URL must be HTTPS, end in /, and its pathname must equal SITE_BASE_PATH. Example: SITE_BASE_PATH=/website/ SITE_URL=https://newroniq.github.io/website/',
  );
}
const template = await readFile('dist/index.html', 'utf8');
const fallbackTitle = '<title>NEWRONIQ</title>';
if (!template.includes(fallbackTitle))
  throw new Error(
    'The HTML template must contain its NEWRONIQ fallback title.',
  );

type RenderRoute = Readonly<{ path: string; key: string; article?: boolean }>;
function pageMetadata(route: RenderRoute) {
  const found =
    route.key === 'notFound' ? undefined : seo[route.key as keyof typeof seo];
  const title = found?.title ?? site.notFound.title;
  const description = found?.description ?? site.notFound.description;
  const canonical = new URL(route.path.slice(1), siteURL).href;
  const jsonLD = serializeJsonLd(structuredData(route.path, siteURL, title));
  const openGraphType = route.article ? 'article' : 'website';
  const markup = [
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
    `<meta property="og:type" content="${openGraphType}" />`,
    `<meta property="og:site_name" content="${escapeHtml(site.name)}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
    '<meta name="twitter:card" content="summary" />',
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    found ? '' : '<meta name="robots" content="noindex" />',
    `<script type="application/ld+json">${jsonLD}</script>`,
  ].join('');
  return { title, markup };
}

async function renderPage(route: RenderRoute) {
  const metadata = pageMetadata(route);
  const { prelude } = await prerender(<App path={route.path} />);
  const markup = await new Response(prelude).text();
  const destination =
    route.path === '/404.html'
      ? 'dist/404.html'
      : `dist${route.path}index.html`;
  const document = template
    .replaceAll(
      fallbackTitle,
      '<title>' + escapeHtml(metadata.title) + '</title>',
    )
    .replaceAll('<!--metadata-->', metadata.markup)
    .replaceAll('<div id="root">', `<div id="root" data-path="${route.path}">`)
    .replaceAll('<!--app-->', markup);
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, document);
}

await Promise.all(
  [...routes, { path: '/404.html', key: 'notFound' }].map(renderPage),
);
const sitemapEntries = routes
  .map((route) => {
    const canonical = escapeHtml(new URL(route.path.slice(1), siteURL).href);
    return `<url><loc>${canonical}</loc></url>`;
  })
  .join('');
const sitemap =
  '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
  sitemapEntries +
  '</urlset>';
await Promise.all([
  writeFile('dist/sitemap.xml', sitemap),
  writeFile(
    'dist/robots.txt',
    `User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap.xml', siteURL).href}\n`,
  ),
  writeFile('dist/.nojekyll', ''),
]);
if (siteURL.hostname !== new URL(site.url).hostname || base !== '/')
  await rm('dist/CNAME', { force: true });
console.log(
  `Prerendered ${routes.length} public pages and 404 for ${siteURL.href}`,
);
