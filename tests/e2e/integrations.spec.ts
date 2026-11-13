import { test, expect, type BrowserContext } from '@playwright/test';
import { gunzipSync } from 'node:zlib';

// Opt-in fixture build only. Every third-party request is intercepted locally.
// These tests verify our integration boundary, not a real Tally account or email delivery.
test.use({
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36',
});
// These tests require the fake production form/project settings and intercepted HTTPS.
// Ordinary builds intentionally skip them; CI runs them in its dedicated fixture step.
test.skip(
  !process.env.TEST_INTEGRATIONS,
  'Requires TEST_INTEGRATIONS=1 and the fake configured build; CI runs this suite separately with intercepted provider requests',
);
async function mockProviders(context: BrowserContext) {
  // Simulate a human browser only inside this fully intercepted fixture test.
  // Production keeps the SDK's bot filtering enabled.
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
    Object.defineProperty(navigator, 'userAgentData', { get: () => undefined });
  });
  const analytics: string[] = [];
  const unexpected: string[] = [];
  await context.route('https://**/*', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.origin === 'https://tally.so') {
      await route.fulfill({
        contentType: 'text/html',
        body: `<!doctype html><html lang="en"><title>Tally event test fixture</title><button id="success">Simulate confirmed submission</button><button id="failure">Simulate failed attempt</button><script>
      const send = (event) => parent.postMessage(JSON.stringify({event,payload:{formId:'newroniqTestForm',id:'test-submission',fields:[{answer:{value:'private@example.com'}}]}}),'*');
      document.querySelector('#success').onclick = () => { send('Tally.FormSubmitted'); send('Tally.FormSubmitted'); };
      document.querySelector('#failure').onclick = () => send('Tally.FormPageView');
      </script></html>`,
      });
    } else if (url.origin === 'https://eu-assets.i.posthog.com') {
      await route.fulfill({
        contentType: 'application/json',
        body: '{}',
        headers: { 'access-control-allow-origin': '*' },
      });
    } else if (url.origin === 'https://eu.i.posthog.com') {
      const raw = request.postDataBuffer();
      if (raw) {
        let body: string;
        try {
          body = gunzipSync(raw).toString();
        } catch {
          body = raw.toString();
        }
        const encoded = new URLSearchParams(body).get('data');
        if (encoded) body = Buffer.from(encoded, 'base64').toString();
        analytics.push(body);
      }
      await route.fulfill({
        contentType: 'application/json',
        body: '{"status":1}',
        headers: { 'access-control-allow-origin': '*' },
      });
    } else {
      unexpected.push(url.origin);
      await route.abort();
    }
  });
  return { analytics, unexpected };
}
test('Tally success is independent of rejection and ignores failed attempts', async ({
  page,
  context,
}) => {
  const { analytics, unexpected } = await mockProviders(context);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('/contact/?inquiry=doptimiser&email=private@example.com');
  await page
    .getByRole('button', { name: 'Reject analytics', exact: true })
    .click();
  const frame = page.frameLocator(
    'iframe[title="NEWRONIQ consultation enquiry"]',
  );
  await expect(page.locator('iframe')).toHaveAttribute(
    'src',
    /newroniqTestForm/,
  );
  await expect(page.locator('iframe')).not.toHaveAttribute(
    'src',
    /private|email=/,
  );
  await frame.getByRole('button', { name: 'Simulate failed attempt' }).click();
  await expect(page.getByRole('status')).toBeEmpty();
  await frame
    .getByRole('button', { name: 'Simulate confirmed submission' })
    .click();
  await expect(page.getByRole('status')).toContainText(
    'Your enquiry has been received.',
  );
  expect(analytics).toEqual([]);
  expect(unexpected).toEqual([]);
  expect(errors).toEqual([]);
});
test('real SDK emits sanitized consented events, deduplicates submissions and honours withdrawal', async ({
  page,
  context,
}) => {
  const { analytics, unexpected } = await mockProviders(context);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('/contact/?inquiry=iqpublish&email=private@example.com');
  expect(analytics).toEqual([]);
  await page
    .getByRole('button', { name: 'Accept analytics', exact: true })
    .click();
  await expect.poll(() => analytics.join('\n')).toContain('$pageview');
  const frame = page.frameLocator(
    'iframe[title="NEWRONIQ consultation enquiry"]',
  );
  await frame.getByRole('button', { name: 'Simulate failed attempt' }).click();
  expect(analytics.join('\n')).not.toContain('lead_form_submitted');
  await frame
    .getByRole('button', { name: 'Simulate confirmed submission' })
    .click();
  await expect
    .poll(() => analytics.join('\n'))
    .toContain('lead_form_submitted');
  const payload = analytics.join('\n');
  expect(payload.match(/lead_form_submitted/g)).toHaveLength(1);
  expect(payload).toContain('iqpublish');
  expect(payload).not.toContain('private@example.com');
  expect(payload).not.toContain('fields');
  await page
    .getByRole('button', { name: 'Analytics Preferences', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Reject analytics', exact: true })
    .click();
  const count = analytics.length;
  await page
    .getByRole('link', { name: 'Contact', exact: true })
    .first()
    .click();
  await expect(page.locator('h1')).toHaveText(
    "Let's Discuss Your AI Initiative",
  );
  expect(analytics).toHaveLength(count);
  expect(unexpected).toEqual([]);
  expect(errors).toEqual([]);
});

test('product CTAs emit their context across real document navigation', async ({
  page,
  context,
}) => {
  const { analytics, unexpected } = await mockProviders(context);
  await page.goto('/doptimiser/');
  await page
    .getByRole('button', { name: 'Accept analytics', exact: true })
    .click();
  await expect.poll(() => analytics.join('\n')).toContain('$pageview');
  await page
    .getByRole('link', { name: 'Register Interest', exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/\/contact\/\?inquiry=doptimiser$/);
  await expect(page.getByRole('note')).toContainText('DOptimiser');
  await expect
    .poll(() => analytics.join('\n'))
    .toContain('product_interest_clicked');
  expect(analytics.join('\n')).toContain('cta_clicked');
  expect(analytics.join('\n')).toContain('contact_started');
  expect(analytics.join('\n')).toContain('doptimiser');
  expect(unexpected).toEqual([]);
});
