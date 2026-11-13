import { test, expect } from '@playwright/test';
const base = process.env.SITE_BASE_PATH ?? '/';
const paths = [
  '',
  'services/',
  'products/',
  'doptimiser/',
  'about/',
  'academy/',
  'contact/',
  'privacy/',
  'stylepulse/',
  'iqpublish/',
  'whitepapers/',
  'whitepapers/paper-aec/',
  'whitepapers/paper-java/',
  'whitepapers/paper-retail/',
];
test('configured deployment base supports every route, refresh, local link and asset', async ({
  page,
  request,
}) => {
  await page.route(
    /googletagmanager\.com|fonts\.googleapis\.com|fonts\.gstatic\.com/,
    (route) => route.abort(),
  );
  const broken: string[] = [];
  page.on('response', (response) => {
    if (
      ['assets/', 'fonts/'].some((directory) =>
        new URL(response.url()).pathname.startsWith(base + directory),
      ) &&
      !response.ok()
    )
      broken.push(response.url());
  });
  for (const path of paths) {
    const response = await page.goto(base + path);
    expect(response?.status()).toBe(200);
    await page.reload();
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute(
      'href',
      base + 'favicon.svg',
    );
    expect((await request.get(base + 'favicon.svg')).ok()).toBe(true);
    const hrefs = await page
      .locator('a[href^="/"]')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    expect(hrefs.every((href) => href?.startsWith(base))).toBe(true);
    expect(
      await page.locator('link[rel="canonical"]').getAttribute('href'),
    ).toBe((process.env.SITE_URL ?? 'https://www.newroniq.com/') + path);
  }
  await page.goto(base + 'stylepulse/');
  await page
    .getByRole('link', { name: 'Register Interest', exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(
    new RegExp(base + 'contact/\\?inquiry=stylepulse$'),
  );
  await expect(page.getByRole('note')).toContainText('StylePulse');
  const sitemap = await request.get(base + 'sitemap.xml');
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).toContain(
    (process.env.SITE_URL ?? 'https://www.newroniq.com/') +
      'whitepapers/paper-aec/',
  );
  const missing = await page.goto(base + 'unavailable/');
  expect(missing?.status()).toBe(404);
  await page.getByRole('link', { name: 'Back to Overview' }).click();
  await expect(page).toHaveURL(base);
  expect(broken).toEqual([]);
});
