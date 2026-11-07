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
  const mobile = (page.viewportSize()?.width ?? 1440) < 768;
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
  await nav.getByRole('link', { name: 'Services' }).click();
  await expect(page).toHaveURL(/#services$/);
  await page
    .getByRole('link', { name: 'Discuss your architecture priorities' })
    .click();
  await expect(page.getByRole('combobox')).toHaveValue('architecture');
  await page.goto('/');
  await page.getByRole('link', { name: 'Explore Our Services' }).click();
  await expect(page).toHaveURL(/#services$/);
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
for (const [id, name] of [
  ['stylepulse', 'StylePulse'],
  ['iqpublish', 'IQPublish'],
])
  test(`identifiable product interest: ${name}`, async ({ page }) => {
    await page.goto(`/${id}/`);
    await expect(
      page.getByRole('heading', { name: 'Exploring customer needs' }),
    ).toBeVisible();
    await page
      .getByRole('link', { name: `I’m Interested in ${name}` })
      .first()
      .click();
    await expect(page).toHaveURL(new RegExp(`/contact/\\?inquiry=${id}$`));
    await expect(page.getByRole('combobox')).toHaveValue(id);
    await expect(page.getByRole('note')).toContainText(`interest in ${name}`);
    await page.reload();
    await expect(page.getByRole('combobox')).toHaveValue(id);
    await page.getByRole('button', { name: 'Prepare email draft' }).click();
    expect(
      await page
        .locator('form')
        .evaluate((form: HTMLFormElement) => form.checkValidity()),
    ).toBe(false);
    await page.getByLabel('Name', { exact: true }).fill('Test Person');
    await page
      .getByLabel('Business email', { exact: true })
      .fill('test@example.com');
    await page
      .getByLabel('Organisation (optional)', { exact: true })
      .fill('Example & Co');
    await page
      .getByLabel('Short message (optional)', { exact: true })
      .fill('A practical pilot? & next steps');
    await page.getByRole('button', { name: 'Prepare email draft' }).click();
    await expect(page.getByRole('status')).toContainText(
      'not been registered or sent',
    );
    const draft = new URL(
      (await page
        .getByRole('link', { name: 'Open prepared email draft' })
        .getAttribute('href'))!,
    );
    expect(draft.pathname).toBe('info@newroniq.com');
    expect(draft.searchParams.get('subject')).toBe(
      `Product Interest — ${name}`,
    );
    expect(draft.searchParams.get('body')).toContain('Example & Co');
    expect(draft.searchParams.get('body')).toContain(
      'A practical pilot? & next steps',
    );
    expect(
      await page.evaluate(() => localStorage.length + sessionStorage.length),
    ).toBe(0);
    expect(page.url()).not.toContain('test@example.com');
  });
test('unknown inquiry input falls back safely and all seven choices remain available', async ({
  page,
}) => {
  await page.goto('/contact/?inquiry=%3Cscript%3Ealert(1)');
  await expect(page.getByRole('combobox')).toHaveValue('general');
  await expect(page.getByRole('option')).toHaveCount(7);
  await expect(page.getByRole('note')).toHaveCount(0);
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
  const wordmarks = page.getByRole('img', { name: 'NEWRONIQ', exact: true });
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
