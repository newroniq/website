import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const baselineCSS = readFileSync('tests/fixtures/visual/styles.css', 'utf8');
const views = [
  ['home', '/'],
  ['services', '/services/'],
  ['products', '/products/'],
  ['doptimiser', '/doptimiser/'],
  ['about', '/about/'],
  ['academy', '/academy/'],
  ['privacy', '/privacy/'],
  ['stylepulse', '/stylepulse/'],
  ['iqpublish', '/iqpublish/'],
  ['contact', '/contact/'],
  ['whitepapers', '/whitepapers/'],
  ['paper_aec', '/whitepapers/paper-aec/'],
  ['paper_java', '/whitepapers/paper-java/'],
  ['paper_retail', '/whitepapers/paper-retail/'],
];

for (const [view, path] of views) {
  // These committed references are independent of the current build. Only the explicit
  // test:visual:update command changes them, so a normal test run cannot approve itself.
  const reference = readFileSync(`tests/fixtures/visual/${view}.html`, 'utf8');
  test(`visual regression: ${view}`, async ({ page }, testInfo) => {
    await page.route(
      /googletagmanager\.com|fonts\.googleapis\.com|fonts\.gstatic\.com/,
      (route) => route.abort(),
    );
    await page.route('**/__visual_baseline__/styles.css', (route) =>
      route.fulfill({ contentType: 'text/css', body: baselineCSS }),
    );
    await page.route('**/__visual_baseline__/page', (route) =>
      route.fulfill({ contentType: 'text/html', body: reference }),
    );
    const settle = async () => {
      await page.addStyleTag({
        content:
          'html{scroll-behavior:auto !important}*{transition:none !important}',
      });
      await page.evaluate(() => document.fonts.ready);
    };
    await page.goto('/__visual_baseline__/page');
    await settle();
    const before = await page.screenshot({
      path: testInfo.outputPath('reference.png'),
      fullPage: true,
      animations: 'disabled',
    });
    await testInfo.attach('reference', {
      body: before,
      contentType: 'image/png',
    });

    await page.goto(path);
    await settle();
    const after = await page.screenshot({
      path: testInfo.outputPath('actual.png'),
      fullPage: true,
      animations: 'disabled',
    });
    await testInfo.attach('actual', { body: after, contentType: 'image/png' });

    const a = PNG.sync.read(before);
    const b = PNG.sync.read(after);
    const width = Math.max(a.width, b.width);
    const height = Math.max(a.height, b.height);
    const pad = (source: PNG) => {
      const canvas = new PNG({ width, height });
      canvas.data.fill(255);
      PNG.bitblt(source, canvas, 0, 0, source.width, source.height, 0, 0);
      return canvas;
    };
    const diff = new PNG({ width, height });
    const changed = pixelmatch(
      pad(a).data,
      pad(b).data,
      diff.data,
      width,
      height,
      {
        threshold: 0.2,
      },
    );
    await testInfo.attach('diff', {
      body: PNG.sync.write(diff),
      contentType: 'image/png',
    });
    const ratio = changed / (width * height);
    await testInfo.attach('comparison', {
      body: JSON.stringify({
        ratio,
        referenceHeight: a.height,
        actualHeight: b.height,
      }),
      contentType: 'application/json',
    });
    expect(b.width, `${view}: page width changed`).toBe(a.width);
    expect(b.height, `${view}: page height changed`).toBe(a.height);
    expect(
      ratio,
      `${view} changed ${(ratio * 100).toFixed(3)}% of pixels`,
    ).toBeLessThan(0.002);
  });
}
