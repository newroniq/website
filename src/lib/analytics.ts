import type { PostHog } from 'posthog-js';
import { analyticsAvailable, posthogKey, posthogHost } from './config';
import { inquiryIdSchema, productIdSchema } from './content/schema';
import { deploymentBase } from './urls';

export type Consent = 'pending' | 'accepted' | 'rejected';
export const consentKey = 'newroniq.analytics.v1';
let consent: Consent = 'pending';
let client: PostHog | undefined;
let initializing: Promise<void> | undefined;
let generation = 0;
let pageviewSent = false;
const listeners = new Set<() => void>();
const readPreference = (): Consent => {
  try {
    const value = localStorage.getItem(consentKey);
    return value === 'accepted' || value === 'rejected' ? value : 'pending';
  } catch {
    return 'pending';
  }
};
export const getConsent = () => consent;
export const getServerConsent = (): Consent => 'pending';
export function subscribeConsent(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
export function pagePath(): string {
  const relative =
    '/' +
    window.location.pathname.slice(deploymentBase.length).replace(/^\//, '');
  // Never send arbitrary user-supplied paths, queries or fragments.
  return /^\/(?:services|products|doptimiser|iqpublish|stylepulse|whitepapers(?:\/paper-(?:aec|java|retail))?|about|academy|contact|privacy)?\/?$/.test(
    relative,
  )
    ? relative
    : '/404.html';
}
function safeProperties(
  properties: Record<string, unknown>,
): Record<string, string> {
  const result: Record<string, string> = { page_path: pagePath() };
  for (const key of ['cta_id', 'cta_location', 'form_id']) {
    const value = properties[key];
    if (typeof value === 'string' && /^[a-zA-Z0-9_-]{1,80}$/.test(value))
      result[key] = value;
  }
  for (const key of ['service', 'interest_context']) {
    const parsed = inquiryIdSchema.safeParse(properties[key]);
    if (parsed.success) result[key] = parsed.data;
  }
  const product = productIdSchema.safeParse(properties.product);
  if (product.success) result.product = product.data;
  return result;
}
export type AnalyticsEvent =
  | 'cta_clicked'
  | 'contact_started'
  | 'lead_form_submitted'
  | 'product_interest_clicked';
export function track(
  event: AnalyticsEvent,
  properties: Record<string, unknown> = {},
) {
  if (consent !== 'accepted' || !analyticsAvailable || !client) return;
  try {
    // Enquiry links navigate between static documents; send low-volume explicit events immediately.
    client.capture(event, safeProperties(properties), {
      send_instantly: true,
      transport: 'sendBeacon',
    });
  } catch {
    /* Analytics must never interrupt the visitor. */
  }
}
function capturePageview() {
  if (pageviewSent || !client || consent !== 'accepted') return;
  pageviewSent = true;
  try {
    client.capture('$pageview', { page_path: pagePath() });
  } catch {
    /* Optional analytics. */
  }
}
async function initialize() {
  if (!analyticsAvailable || consent !== 'accepted') return;
  if (client) {
    try {
      client.opt_in_capturing({ captureEventName: false });
      capturePageview();
    } catch {
      /* Optional analytics. */
    }
    return;
  }
  if (initializing) return initializing;
  const version = generation;
  initializing = (async () => {
    try {
      const { default: posthog } = await import('posthog-js');
      if (consent !== 'accepted' || version !== generation) return;
      posthog.init(posthogKey, {
        api_host: posthogHost,
        autocapture: false,
        capture_pageview: false,
        capture_pageleave: false,
        disable_session_recording: true,
        person_profiles: 'never',
        disable_surveys: true,
        disable_external_dependency_loading: true,
        advanced_disable_feature_flags: true,
        capture_exceptions: false,
        capture_performance: false,
        capture_dead_clicks: false,
        capture_heatmaps: false,
        rageclick: false,
        persistence: 'localStorage',
        respect_dnt: true,
        opt_out_capturing_by_default: true,
        // Automatic URL/referrer/browser properties can contain personal data.
        before_send: (event) => {
          if (consent !== 'accepted') return null;
          if (
            ![
              '$pageview',
              'cta_clicked',
              'contact_started',
              'lead_form_submitted',
              'product_interest_clicked',
            ].includes(event.event)
          )
            return null;
          const props = event.properties;
          const safe = safeProperties(props);
          const system: Record<string, unknown> = {};
          for (const key of [
            'token',
            'distinct_id',
            '$session_id',
            '$window_id',
            '$lib',
            '$lib_version',
          ]) {
            if (props[key] !== undefined) system[key] = props[key];
          }
          event.properties = {
            ...system,
            ...safe,
            $current_url:
              window.location.origin +
              deploymentBase.replace(/\/$/, '') +
              safe.page_path,
            $process_person_profile: false,
            $ip: null,
          };
          return event;
        },
      });
      client = posthog;
      if (consent === 'accepted' && version === generation) {
        client.opt_in_capturing({ captureEventName: false });
        capturePageview();
      } else client.opt_out_capturing();
    } catch {
      /* Blockers and failed requests must not affect the site. */
    }
  })().finally(() => {
    initializing = undefined;
    // A rejection followed by acceptance while the SDK downloads must not strand initialization.
    if (version !== generation && consent === 'accepted' && !client)
      void initialize();
  });
  return initializing;
}
export function setConsent(next: Exclude<Consent, 'pending'>) {
  consent = next;
  generation++;
  try {
    localStorage.setItem(consentKey, next);
  } catch {
    /* Keep the choice in memory. */
  }
  if (next === 'rejected') {
    try {
      client?.opt_out_capturing();
      client?.reset();
      client?.clear_opt_in_out_capturing();
    } catch {
      /* Capture is gated above even if storage is blocked. */
    }
  } else void initialize();
  listeners.forEach((listener) => listener());
}
export function startAnalytics() {
  consent = readPreference();
  listeners.forEach((listener) => listener());
  void initialize();
  const sync = (event: StorageEvent) => {
    if (event.key === consentKey || event.key === null) {
      const next = readPreference();
      if (next === 'pending') {
        consent = 'pending';
        generation++;
        client?.opt_out_capturing();
        listeners.forEach((listener) => listener());
      } else setConsent(next);
    }
  };
  window.addEventListener('storage', sync);
  const onClick = (event: MouseEvent) => {
    const element =
      event.target instanceof Element
        ? event.target.closest<HTMLAnchorElement>('a[data-cta-id]')
        : null;
    if (!element) return;
    const properties = {
      cta_id: element.dataset.ctaId,
      cta_location: element.dataset.ctaLocation,
      service: element.dataset.service,
    };
    track('cta_clicked', properties);
    if (element.dataset.product)
      track('product_interest_clicked', {
        product: element.dataset.product,
        cta_location: element.dataset.ctaLocation,
      });
    const destination = new URL(element.href, window.location.origin);
    if (
      (destination.origin === window.location.origin &&
        destination.pathname === deploymentBase + 'contact/') ||
      destination.origin === 'https://tally.so'
    )
      track('contact_started', properties);
  };
  document.addEventListener('click', onClick);
  return () => {
    window.removeEventListener('storage', sync);
    document.removeEventListener('click', onClick);
  };
}
