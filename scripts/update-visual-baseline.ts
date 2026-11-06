import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { routes } from '../src/app/routes';
import { deploymentBase } from '../src/lib/urls';

if (process.env.CI) {
  throw new Error(
    'Visual references must be updated and reviewed locally, never in CI.',
  );
}
if (deploymentBase !== '/') {
  throw new Error(
    'Generate visual references from the default root-base build.',
  );
}

const destination = 'tests/fixtures/visual';
const manifest = JSON.parse(
  await readFile('dist/.vite/manifest.json', 'utf8'),
) as Record<string, { isEntry?: boolean; css?: string[] }>;
const entry = Object.values(manifest).find((asset) => asset.isEntry);
if (!entry?.css?.length)
  throw new Error('Build the production site before updating references.');
const css = await Promise.all(
  entry.css.map((path) => readFile(`dist/${path}`, 'utf8')),
);
await mkdir(destination, { recursive: true });
await writeFile(`${destination}/styles.css`, css.join('\n'));

for (const route of routes) {
  const html = await readFile(`dist${route.path}index.html`, 'utf8');
  if (!html.includes(`data-path="${route.path}"`)) {
    throw new Error(`Missing prerendered page: ${route.path}`);
  }
  // Freeze rendered markup and CSS, not running application code or remote integrations.
  const reference = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, '')
    .replace(/<link\b[^>]*rel="modulepreload"[^>]*>/gi, '')
    .replace(
      /<link\b[^>]*rel="stylesheet"[^>]*href="\/assets\/[^"]+"[^>]*>/gi,
      '<link rel="stylesheet" href="/__visual_baseline__/styles.css" />',
    );
  if (!reference.includes('href="/__visual_baseline__/styles.css"')) {
    throw new Error(`Expected root-base production stylesheet: ${route.path}`);
  }
  await writeFile(`${destination}/${route.key}.html`, reference);
}
console.log(
  `Updated ${routes.length} visual reference documents. Review the diffs and screenshots before committing.`,
);
