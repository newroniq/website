import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { prerender } from 'react-dom/static';
import { App } from '../src/app/App';
import { routes } from '../src/app/routes';
import { site } from '../src/lib/content';
import { seo } from '../src/lib/content/seo';
import { url, deploymentBase, normalizeBase } from '../src/lib/urls';
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
const escape = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ]!,
  );
const analytics = site.analyticsEnabled
  ? `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${site.gtmId}');</script><noscript><iframe title="Google Tag Manager" src="https://www.googletagmanager.com/ns.html?id=${site.gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`
  : '';
for (const route of [...routes, { path: '/404.html', key: 'notFound' }]) {
  const found =
    route.key === 'notFound' ? undefined : seo[route.key as keyof typeof seo];
  const title = found?.title ?? site.notFound.title;
  const description = found?.description ?? site.notFound.description;
  const canonical = new URL(route.path.slice(1), siteURL).href;
  const { prelude } = await prerender(<App path={route.path} />);
  const markup = await new Response(prelude).text();
  const jsonLD = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.legalName,
    alternateName: site.name,
    identifier: site.company.number,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.company.registeredOffice,
    },
    sameAs: [site.company.registryUrl],
    url: siteURL.href,
    email: site.email,
  }).replace(/</g, '\\u003c');
  const meta = `<link rel="icon" type="image/svg+xml" href="${escape(url(site.favicon))}" /><title>${escape(title)}</title><meta name="description" content="${escape(description)}" /><link rel="canonical" href="${escape(canonical)}" /><meta property="og:type" content="${'article' in route ? 'article' : 'website'}" /><meta property="og:site_name" content="${escape(site.name)}" /><meta property="og:title" content="${escape(title)}" /><meta property="og:description" content="${escape(description)}" /><meta property="og:url" content="${escape(canonical)}" /><meta name="twitter:card" content="summary" /><meta name="twitter:title" content="${escape(title)}" /><meta name="twitter:description" content="${escape(description)}" />${found ? '' : '<meta name="robots" content="noindex" />'}<script type="application/ld+json">${jsonLD}</script>`;
  const destination =
    route.path === '/404.html'
      ? 'dist/404.html'
      : `dist${route.path}index.html`;
  await mkdir(destination.slice(0, destination.lastIndexOf('/')), {
    recursive: true,
  });
  await writeFile(
    destination,
    template
      .replace('<!--metadata-->', meta)
      .replace('<!--analytics-->', analytics)
      .replace('<div id="root">', `<div id="root" data-path="${route.path}">`)
      .replace('<!--app-->', markup),
  );
}
await writeFile(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map((route) => `<url><loc>${escape(new URL(route.path.slice(1), siteURL).href)}</loc></url>`).join('')}</urlset>`,
);
await writeFile(
  'dist/robots.txt',
  `User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap.xml', siteURL).href}\n`,
);
await writeFile('dist/.nojekyll', '');
if (siteURL.hostname !== new URL(site.url).hostname || base !== '/')
  await rm('dist/CNAME', { force: true });
console.log(
  `Prerendered ${routes.length} public pages and 404 for ${siteURL.href}`,
);
