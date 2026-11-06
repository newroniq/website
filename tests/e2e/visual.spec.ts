import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
const original = readFileSync('docs/baseline/index.html', 'utf8');
const css = await postcss([
  tailwindcss({
    content: [{ raw: original, extension: 'html' }],
    corePlugins: { preflight: true },
  }),
]).process(
  '@tailwind base;@tailwind components;@tailwind utilities;' +
    original.match(/<style>([\s\S]*?)<\/style>/)![1],
  { from: undefined },
);
const views = [
  ['home', '/'],
  ['stylepulse', '/stylepulse/'],
  ['iqpublish', '/iqpublish/'],
  ['contact', '/contact/'],
  ['whitepapers', '/whitepapers/'],
  ['paper-aec', '/whitepapers/paper-aec/'],
  ['paper-java', '/whitepapers/paper-java/'],
  ['paper-retail', '/whitepapers/paper-retail/'],
];
for (const [view, path] of views)
  test(`original layout comparison: ${view}`, async ({ page }, testInfo) => {
    await page.route(
      /googletagmanager\.com|fonts\.googleapis\.com|fonts\.gstatic\.com/,
      (route) => route.abort(),
    );
    await page.route('https://cdn.tailwindcss.com/', (route) =>
      route.fulfill({
        contentType: 'application/javascript',
        body: `const s=document.createElement('style');s.textContent=${JSON.stringify(css.css)};document.head.appendChild(s);`,
      }),
    );
    await page.route('**/__baseline__', (route) =>
      route.fulfill({ contentType: 'text/html', body: original }),
    );
    await page.goto('/__baseline__');
    await page.evaluate((view) => {
      if (view.startsWith('paper-'))
        (window as unknown as { openPaper: (id: string) => void }).openPaper(
          view,
        );
      else
        (window as unknown as { showView: (id: string) => void }).showView(
          view,
        );
    }, view);
    await page.addStyleTag({
      content:
        'html{scroll-behavior:auto !important}*{transition:none !important}',
    });
    // Form delivery notice and mobile navigation are deliberate changes, compared separately in behavior tests.
    const masks =
      view === 'contact' ? [page.locator('#contact-form-container')] : [];
    const before = await page.screenshot({
      path: testInfo.outputPath('original.png'),
      fullPage: true,
      animations: 'disabled',
      mask: masks,
    });
    await testInfo.attach('original', {
      body: before,
      contentType: 'image/png',
    });
    await page.goto(path);
    await page.addStyleTag({
      content:
        'html{scroll-behavior:auto !important}*{transition:none !important}',
    });
    if (view === 'contact')
      await page.addStyleTag({
        content:
          '#form-notice{display:none}form>div:first-of-type{margin-top:0}',
      });
    const after = await page.screenshot({
      path: testInfo.outputPath('migrated.png'),
      fullPage: true,
      animations: 'disabled',
      mask: view === 'contact' ? [page.locator('#contact-form-container')] : [],
    });
    await testInfo.attach('migrated', {
      body: after,
      contentType: 'image/png',
    });
    const a = PNG.sync.read(before),
      b = PNG.sync.read(after);
    // Compare common canvas with white padding, retaining height regressions in the diff.
    const width = Math.max(a.width, b.width),
      height = Math.max(a.height, b.height);
    const pad = (source: PNG) => {
      const out = new PNG({ width, height });
      out.data.fill(255);
      PNG.bitblt(source, out, 0, 0, source.width, source.height, 0, 0);
      return out;
    };
    const diff = new PNG({ width, height });
    const changed = pixelmatch(
      pad(a).data,
      pad(b).data,
      diff.data,
      width,
      height,
      { threshold: 0.2 },
    );
    await testInfo.attach('diff', {
      body: PNG.sync.write(diff),
      contentType: 'image/png',
    });
    const ratio = changed / (width * height);
    await testInfo.attach('comparison', {
      body: JSON.stringify({
        ratio,
        baselineHeight: a.height,
        migratedHeight: b.height,
      }),
      contentType: 'application/json',
    });
    expect(
      ratio,
      `${view} changed ${(ratio * 100).toFixed(2)}% of pixels`,
    ).toBeLessThan(0.02);
  });
