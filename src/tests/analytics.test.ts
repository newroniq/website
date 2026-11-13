import type { CaptureResult, PostHogConfig } from 'posthog-js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const sdk = vi.hoisted(() => ({
  init: vi.fn(),
  capture: vi.fn(),
  opt_in_capturing: vi.fn(),
  opt_out_capturing: vi.fn(),
  reset: vi.fn(),
  clear_opt_in_out_capturing: vi.fn(),
}));
vi.mock('posthog-js', () => ({ default: sdk }));
let dispose: (() => void) | undefined;
beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  const storage = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => {
      storage.set(key, value);
    },
    removeItem: (key: string) => {
      storage.delete(key);
    },
    clear: () => storage.clear(),
  });
  window.history.replaceState({}, '', '/');
  vi.stubEnv('VITE_PUBLIC_POSTHOG_KEY', 'phc_test_public');
  vi.stubEnv('VITE_PUBLIC_POSTHOG_HOST', 'https://eu.i.posthog.com');
  vi.stubEnv('PROD', true);
  vi.stubEnv('MODE', 'production');
});
afterEach(() => {
  dispose?.();
  dispose = undefined;
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  document.body.innerHTML = '';
});
function beforeSend(config: PostHogConfig) {
  if (typeof config.before_send !== 'function')
    throw new Error('Expected a single privacy filter');
  return config.before_send;
}
async function accepted() {
  const analytics = await import('../lib/analytics');
  dispose = analytics.startAnalytics();
  analytics.setConsent('accepted');
  await vi.waitFor(() => expect(sdk.init).toHaveBeenCalledTimes(1));
  return analytics;
}
describe('consented explicit analytics', () => {
  it('does not initialize or capture before consent or after rejection', async () => {
    const analytics = await import('../lib/analytics');
    dispose = analytics.startAnalytics();
    analytics.track('cta_clicked');
    analytics.setConsent('rejected');
    analytics.track('lead_form_submitted');
    expect(sdk.init).not.toHaveBeenCalled();
    expect(sdk.capture).not.toHaveBeenCalled();
    expect(localStorage.getItem(analytics.consentKey)).toBe('rejected');
  });
  it('disables real analytics in development and test environments', async () => {
    vi.stubEnv('PROD', false);
    const analytics = await import('../lib/analytics');
    dispose = analytics.startAnalytics();
    analytics.setConsent('accepted');
    expect(sdk.init).not.toHaveBeenCalled();
    expect(sdk.capture).not.toHaveBeenCalled();
  });
  it('initializes once, explicitly captures one pageview and disables intrusive features', async () => {
    const analytics = await accepted();
    analytics.setConsent('accepted');
    expect(sdk.init).toHaveBeenCalledTimes(1);
    expect(
      sdk.capture.mock.calls.filter((call) => call[0] === '$pageview'),
    ).toHaveLength(1);
    expect(sdk.init.mock.calls[0][1]).toMatchObject({
      api_host: 'https://eu.i.posthog.com',
      autocapture: false,
      capture_pageview: false,
      capture_pageleave: false,
      disable_session_recording: true,
      person_profiles: 'never',
      disable_external_dependency_loading: true,
      capture_heatmaps: false,
    });
  });
  it('strips personal data, arbitrary properties, query strings and referrers', async () => {
    window.history.replaceState(
      {},
      '',
      '/contact/?email=private@example.com#sensitive',
    );
    const analytics = await accepted();
    analytics.track('lead_form_submitted', {
      form_id: 'testForm',
      interest_context: 'doptimiser',
      email: 'private@example.com',
      fields: ['private'],
    });
    expect(sdk.capture).toHaveBeenLastCalledWith(
      'lead_form_submitted',
      {
        page_path: '/contact/',
        form_id: 'testForm',
        interest_context: 'doptimiser',
      },
      { send_instantly: true, transport: 'sendBeacon' },
    );
    const config = sdk.init.mock.calls[0][1] as PostHogConfig;
    const sanitized = beforeSend(config)({
      uuid: 'test-id',
      event: 'cta_clicked',
      properties: {
        distinct_id: 'anonymous-id',
        email: 'private@example.com',
        $current_url: window.location.href,
        $referrer: 'https://example.com/?secret=value',
        $set: { email: 'private@example.com' },
        cta_id: 'hero',
      },
    } as CaptureResult);
    expect(sanitized).toMatchObject({
      properties: {
        page_path: '/contact/',
        cta_id: 'hero',
        $process_person_profile: false,
        $ip: null,
      },
    });
    expect(JSON.stringify(sanitized)).not.toMatch(
      /private|sensitive|secret|referrer|\$set/,
    );
    expect(
      beforeSend(config)({
        uuid: 'test-id',
        event: '$autocapture',
        properties: {},
      } as CaptureResult),
    ).toBeNull();
  });
  it('withdraws consent immediately and drops any later queued SDK events', async () => {
    const analytics = await accepted();
    const count = sdk.capture.mock.calls.length;
    analytics.setConsent('rejected');
    analytics.track('cta_clicked');
    expect(sdk.capture).toHaveBeenCalledTimes(count);
    expect(sdk.opt_out_capturing).toHaveBeenCalled();
    expect(sdk.reset).toHaveBeenCalled();
    const config = sdk.init.mock.calls[0][1] as PostHogConfig;
    expect(
      beforeSend(config)({
        uuid: 'test-id',
        event: 'cta_clicked',
        properties: {},
      } as CaptureResult),
    ).toBeNull();
  });
  it('does not mistake a contact pageview for starting an enquiry and tracks deliberate product clicks', async () => {
    window.history.replaceState({}, '', '/contact/');
    await accepted();
    expect(
      sdk.capture.mock.calls.some((call) => call[0] === 'contact_started'),
    ).toBe(false);
    const link = document.createElement('a');
    link.href = '/contact/?inquiry=iqpublish';
    link.dataset.ctaId = 'product-register';
    link.dataset.ctaLocation = 'product-hero';
    link.dataset.product = 'iqpublish';
    link.dataset.service = 'iqpublish';
    link.addEventListener('click', (event) => event.preventDefault());
    document.body.append(link);
    link.click();
    expect(sdk.capture).toHaveBeenCalledWith(
      'product_interest_clicked',
      {
        product: 'iqpublish',
        cta_location: 'product-hero',
        page_path: '/contact/',
      },
      { send_instantly: true, transport: 'sendBeacon' },
    );
    expect(sdk.capture).toHaveBeenCalledWith(
      'contact_started',
      expect.objectContaining({ cta_id: 'product-register' }),
      { send_instantly: true, transport: 'sendBeacon' },
    );
  });
  it('keeps the site usable when SDK initialization fails', async () => {
    sdk.init.mockImplementationOnce(() => {
      throw new Error('SDK unavailable');
    });
    const analytics = await accepted();
    expect(() => analytics.track('cta_clicked')).not.toThrow();
    expect(sdk.capture).not.toHaveBeenCalled();
  });
  it('honours saved rejection and survives unavailable preference storage', async () => {
    localStorage.setItem('newroniq.analytics.v1', 'rejected');
    const analytics = await import('../lib/analytics');
    dispose = analytics.startAnalytics();
    expect(analytics.getConsent()).toBe('rejected');
    expect(sdk.init).not.toHaveBeenCalled();
    const spy = vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new Error('storage blocked');
    });
    expect(() => analytics.setConsent('rejected')).not.toThrow();
    spy.mockRestore();
  });
  it('honours cross-tab withdrawal', async () => {
    const analytics = await accepted();
    localStorage.setItem(analytics.consentKey, 'rejected');
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: analytics.consentKey,
        newValue: 'rejected',
      }),
    );
    expect(analytics.getConsent()).toBe('rejected');
    expect(sdk.opt_out_capturing).toHaveBeenCalled();
  });
  it('recovers when consent changes during SDK loading', async () => {
    const analytics = await import('../lib/analytics');
    dispose = analytics.startAnalytics();
    analytics.setConsent('accepted');
    analytics.setConsent('rejected');
    analytics.setConsent('accepted');
    await vi.waitFor(() => expect(sdk.init).toHaveBeenCalledTimes(1));
    expect(
      sdk.capture.mock.calls.filter((call) => call[0] === '$pageview'),
    ).toHaveLength(1);
  });
});
