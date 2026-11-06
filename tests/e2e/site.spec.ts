import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const paths = [
  '/',
  '/stylepulse/',
  '/iqpublish/',
  '/contact/',
  '/whitepapers/',
  '/whitepapers/paper-aec/',
  '/whitepapers/paper-java/',
  '/whitepapers/paper-retail/',
];
test.beforeEach(async ({ page }) => {
  // Deterministic functional checks: analytics and remote fonts are preserved, but are not test dependencies.
  await page.route(
    /googletagmanager\.com|fonts\.googleapis\.com|fonts\.gstatic\.com/,
    (route) => route.abort(),
  );
});
for (const path of paths)
  test(`direct access, refresh, assets and accessibility ${path}`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (
        message.type() === 'error' &&
        !message.text().includes('Failed to load resource')
      )
        errors.push(message.text());
    });
    const broken: string[] = [];
    page.on('response', (response) => {
      if (
        response.url().startsWith('http://127.0.0.1:4173/assets/') &&
        !response.ok()
      )
        broken.push(response.url());
    });
    await page.goto(path);
    await expect(page.locator('h1')).toHaveCount(1);
    await page.reload();
    await expect(page.locator('h1')).toBeVisible();
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
  });
test('all navigation, anchors, capabilities and articles remain reachable', async ({
  page,
  isMobile,
}, testInfo) => {
  await page.goto('/');
  if (testInfo.project.name === 'mobile')
    await page.getByRole('button', { name: 'Menu' }).click();
  const nav = page.getByRole('navigation', {
    name: testInfo.project.name === 'mobile' ? 'Mobile' : 'Main',
    exact: true,
  });
  await nav.getByRole('link', { name: 'Services' }).click();
  await expect(page).toHaveURL(/#services$/);
  await page.goto('/stylepulse/');
  await expect(page).toHaveURL(/\/stylepulse\/$/);
  await page.getByRole('link', { name: 'Schedule Consultation' }).click();
  await expect(page).toHaveURL(/\/contact\/$/);
  await page.goto('/');
  await page.getByRole('link', { name: 'Explore Our Capabilities' }).click();
  await expect(page).toHaveURL(/#services$/);
  await page.getByRole('link', { name: 'White Papers', exact: true }).click();
  await page
    .getByRole('link', { name: /Enterprise Architecture & Advisory/ })
    .click();
  await expect(page.locator('h1')).toHaveText(
    'Modernise the Enterprise One Business Journey at a Time',
  );
  await page.getByRole('link', { name: /All White Papers/ }).click();
  await expect(page).toHaveURL(/\/whitepapers\/$/);
  void isMobile;
});
test('contact validates and opens an email draft without pretending to send', async ({
  page,
}) => {
  await page.goto('/contact/');
  await page.getByRole('button', { name: 'Open email draft' }).click();
  expect(
    await page
      .locator('form')
      .evaluate((form: HTMLFormElement) => form.checkValidity()),
  ).toBe(false);
  await page.getByLabel('Full Name').fill('Test Person');
  await page.getByLabel('Business Email').fill('test@example.com');
  await page
    .getByLabel('Message', { exact: true })
    .fill('A test inquiry & details');
  await page.evaluate(() => {
    window.addEventListener('beforeunload', (event) => event.preventDefault());
  });
  await page.getByRole('button', { name: 'Open email draft' }).click();
  await expect(page.getByRole('status')).toContainText('has not been sent');
});
test('primary content is present without JavaScript', async ({
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

test('unsupported routes return the static 404 document', async ({ page }) => {
  const response = await page.goto('/missing-page/');
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText('Page not found');
  await page.getByRole('link', { name: 'Back to Overview' }).click();
  await expect(page).toHaveURL('/');
});
