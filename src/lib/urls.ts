const configuredBase =
  typeof process !== 'undefined' ? process.env.SITE_BASE_PATH : undefined;
export const deploymentBase =
  configuredBase ?? import.meta.env?.BASE_URL ?? '/';
export function normalizeBase(base: string): string {
  if (!/^\/(?:[a-zA-Z0-9_-]+\/)*$/.test(base))
    throw new Error(
      'SITE_BASE_PATH must be / or a slash-delimited path such as /website/',
    );
  return base;
}
export function url(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('\\'))
    throw new Error('Expected a local absolute site path');
  return normalizeBase(deploymentBase) + path.replace(/^\//, '');
}
