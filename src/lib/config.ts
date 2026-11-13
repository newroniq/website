// Vite replaces import.meta.env in the browser; prerendering reads the same public build variables.
const env = import.meta.env ?? {};
const publicValue = (key: string): string =>
  String(
    env[key] ?? (typeof process !== 'undefined' ? process.env[key] : '') ?? '',
  ).trim();
export const tallyFormId = publicValue('VITE_PUBLIC_TALLY_FORM_ID');
if (tallyFormId && !/^[a-zA-Z0-9]+$/.test(tallyFormId))
  throw new Error(
    'VITE_PUBLIC_TALLY_FORM_ID must be a Tally form ID, not a URL',
  );
export const posthogKey = publicValue('VITE_PUBLIC_POSTHOG_KEY');
export const posthogHost =
  publicValue('VITE_PUBLIC_POSTHOG_HOST') || 'https://eu.i.posthog.com';
if (
  posthogKey &&
  (!posthogKey.startsWith('phc_') || posthogHost !== 'https://eu.i.posthog.com')
)
  throw new Error('Use a public PostHog project key and the EU ingestion host');
export const analyticsAvailable =
  Boolean(posthogKey) && env.PROD === true && env.MODE !== 'test';
