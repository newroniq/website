import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const paths = [
  '/',
  '/services/',
  '/products/',
  '/doptimiser/',
  '/about/',
  '/academy/',
  '/stylepulse/',
  '/iqpublish/',
  '/contact/',
  '/whitepapers/',
  '/whitepapers/paper-aec/',
  '/whitepapers/paper-java/',
  '/whitepapers/paper-retail/',
  '/privacy/',
];
for (const path of paths)
  test(`static access, accessibility and responsive layout ${path}`, async ({
    page,
  }, testInfo) => {
    const errors: string[] = [];
    const broken: string[] = [];
    const external: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('response', (response) => {
      if (response.url().startsWith('http://127.0.0.1:4173/') && !response.ok())
        broken.push(response.url());
    });
    page.on('request', (request) => {
      if (
        !request.url().startsWith('http://127.0.0.1:4173/') &&
        !request.url().startsWith('data:')
      )
        external.push(request.url());
    });
    await page.goto(path);
    await expect(page.locator('h1')).toHaveCount(1);
    await page.reload();
    await expect(page.locator('h1')).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze()
      ).violations,
    ).toEqual([]);
    expect(errors).toEqual([]);
    expect(broken).toEqual([]);
    expect(external).toEqual([]);
    await page.screenshot({
      path: testInfo.outputPath('layout.png'),
      fullPage: true,
      animations: 'disabled',
    });
  });
test('navigation, service context, insights and keyboard menu work', async ({
  page,
}) => {
  await page.goto('/');
  const mobile = (page.viewportSize()?.width ?? 1440) < 1024;
  if (mobile) {
    const menu = page.getByRole('button', { name: 'Menu' });
    await menu.click();
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(menu).toBeFocused();
    await menu.click();
  }
  const nav = page.getByRole('navigation', {
    name: mobile ? 'Mobile' : 'Main',
    exact: true,
  });
  await nav.getByRole('link', { name: 'AI Advisory' }).click();
  await expect(page).toHaveURL(/\/services\/$/);
  await page
    .locator('#architecture')
    .getByRole('link', { name: 'Request an AI Advisory Consultation' })
    .click();
  await expect(page.getByRole('note')).toContainText(
    'Enterprise AI Architecture Advisory',
  );
  await page.goto('/');
  await page
    .getByRole('link', { name: 'Explore Our Advisory Services' })
    .click();
  await expect(page).toHaveURL(/\/services\/$/);
  await page.goto('/');
  await page
    .locator('#insights')
    .getByRole('link', { name: /Read the insight: Modernise/ })
    .click();
  await expect(page.locator('h1')).toHaveText(
    'Modernise the Enterprise One Business Journey at a Time',
  );
  await page.getByRole('link', { name: /All Insights/ }).click();
  await expect(page).toHaveURL(/\/whitepapers\/$/);
});
for (const [id, name, status] of [
  ['doptimiser', 'DOptimiser', 'In Development'],
  ['stylepulse', 'StylePulse', 'Concept / Customer Discovery'],
  ['iqpublish', 'IQPublish', 'Concept / Customer Discovery'],
])
  test(`identifiable product interest: ${name}`, async ({ page }) => {
    await page.goto(`/${id}/`);
    await expect(
      page.getByRole('heading', { name: status, exact: true }),
    ).toBeVisible();
    await page
      .getByRole('link', { name: 'Register Interest', exact: true })
      .first()
      .click();
    await expect(page).toHaveURL(new RegExp(`/contact/\\?inquiry=${id}$`));
    await expect(page.getByRole('note')).toContainText(name);
    await page.reload();
    await expect(page.getByRole('note')).toContainText(name);
    await expect(
      page.getByText('Our enquiry form is not available here yet.', {
        exact: false,
      }),
    ).toBeVisible();
    await expect(page.getByRole('status')).toBeEmpty();
    await expect(
      page.getByRole('button', { name: 'Prepare email draft' }),
    ).toHaveCount(0);
  });
test('unknown inquiry input falls back safely', async ({ page }) => {
  await page.goto('/contact/?inquiry=%3Cscript%3Ealert(1)');
  await expect(page.getByRole('note')).toHaveCount(0);
  await expect(page.locator('h1')).toHaveText(
    "Let's Discuss Your AI Initiative",
  );
});
test('analytics preferences remain accessible and rejection sends no external requests', async ({
  page,
}) => {
  const external: string[] = [];
  page.on('request', (request) => {
    if (!request.url().startsWith('http://127.0.0.1:4173/'))
      external.push(request.url());
  });
  await page.goto('/');
  await page
    .getByRole('button', { name: 'Analytics Preferences', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Optional analytics' }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Reject analytics', exact: true })
    .click();
  expect(
    await page.evaluate(() => localStorage.getItem('newroniq.analytics.v1')),
  ).toBe('rejected');
  await page.reload();
  await page
    .getByRole('button', { name: 'Analytics Preferences', exact: true })
    .click();
  await expect(page.getByText('Current preference: rejected.')).toBeVisible();
  expect(external).toEqual([]);
});
test('preferences retain keyboard dismissal and reduced motion needs no overrides', async ({
  page,
}) => {
  await page.goto('/');
  const trigger = page.getByRole('button', {
    name: 'Analytics Preferences',
    exact: true,
  });
  await trigger.click();
  await expect(
    page.getByRole('region', { name: 'Optional analytics' }),
  ).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(
    page.getByRole('region', { name: 'Optional analytics' }),
  ).toHaveCount(0);
  await expect(trigger).toBeFocused();
  const action = page.locator('.button-primary').first();
  await expect(action).toHaveCSS('transition-duration', '0s');
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(action).toHaveCSS('transition-duration', '0.2s, 0.2s');
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'smooth');
});
test('privacy and verified disclosures are accessible', async ({ page }) => {
  await page.goto('/');
  const footer = page.locator('footer');
  await expect(footer).toContainText('Company number: 17181252');
  await expect(
    footer.getByRole('link', { name: 'info@newroniq.com' }),
  ).toHaveAttribute('href', 'mailto:info@newroniq.com');
  await footer.getByRole('link', { name: 'Privacy Policy' }).click();
  await expect(page.locator('h1')).toHaveText('Privacy Policy');
  await expect(
    page.getByRole('heading', { name: 'Cookies, fonts and analytics' }),
  ).toBeVisible();
  expect(
    (await page.context().cookies()).filter((cookie) =>
      cookie.name.startsWith('_ga'),
    ),
  ).toEqual([]);
});
test('primary content and document links work without JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const path of paths) {
    await page.goto(baseURL + path);
    await expect(page.locator('h1')).toBeVisible();
  }
  await context.close();
});
test('unsupported routes return a real 404 and offer a recovery link', async ({
  page,
}) => {
  const response = await page.goto('/missing-page/');
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText('Page not found');
  await page.getByRole('link', { name: 'Back to Overview' }).click();
  await expect(page).toHaveURL('/');
});

test('brand wordmarks and favicon retain accessible identity and brand colours', async ({
  page,
  request,
}) => {
  await page.goto('/');
  const wordmarks = page
    .locator('header, footer')
    .getByText('NEWRONIQ', { exact: true });
  await expect(wordmarks).toHaveCount(2);
  for (const wordmark of await wordmarks.all()) {
    await expect(wordmark.locator('span').nth(0)).toHaveText('NEWRON');
    await expect(wordmark.locator('span').nth(0)).toHaveCSS(
      'color',
      'rgb(0, 0, 0)',
    );
    await expect(wordmark.locator('span').nth(1)).toHaveText('IQ');
    await expect(wordmark.locator('span').nth(1)).toHaveCSS(
      'color',
      'rgb(161, 32, 39)',
    );
  }
  await expect(
    page.locator('header').getByRole('link', { name: 'NEWRONIQ', exact: true }),
  ).toHaveAttribute('href', '/');
  const footer = page.getByRole('contentinfo');
  await expect(
    footer.getByText('Think Bold. Build Reality.', { exact: true }),
  ).toHaveCount(1);
  await expect(
    footer
      .getByText('NEWRONIQ', { exact: true })
      .locator('xpath=parent::p/following-sibling::*[1]'),
  ).toHaveText('Think Bold. Build Reality.');
  await expect(page.locator('h1')).toHaveText(
    'From AI Ambition to Enterprise Reality.',
  );
  await expect(footer).not.toContainText(
    'From AI Ambition to Enterprise Reality.',
  );
  const icons = page.locator('link[rel="icon"]');
  await expect(icons).toHaveCount(1);
  const icon = await request.get((await icons.getAttribute('href'))!);
  expect(icon.ok()).toBe(true);
  expect(icon.headers()['content-type']).toContain('image/svg+xml');
  const svg = await icon.text();
  expect(svg).toContain('#A12027');
  expect(svg).toContain('fill="#fff"');
  expect(svg).not.toContain('<text');
});
