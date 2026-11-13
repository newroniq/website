import { act } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { expect, it, vi } from 'vitest';
import { AnalyticsPreferences } from '../components/analytics/AnalyticsPreferences';
vi.mock('../lib/config', () => ({ analyticsAvailable: true }));
vi.mock('../lib/analytics', () => ({
  getConsent: () => 'pending',
  getServerConsent: () => 'pending',
  setConsent: vi.fn(),
  startAnalytics: () => () => {},
  subscribeConsent: () => () => {},
}));
it('hydrates a configured production consent panel without mismatching the static HTML', async () => {
  const container = document.createElement('div');
  container.innerHTML = renderToString(<AnalyticsPreferences />);
  expect(container.querySelector('#analytics-preferences')).toBeNull();
  document.body.append(container);
  const errors: unknown[] = [];
  let root: ReturnType<typeof hydrateRoot>;
  await act(async () => {
    root = hydrateRoot(container, <AnalyticsPreferences />, {
      onRecoverableError: (error) => errors.push(error),
    });
  });
  expect(container.querySelector('#analytics-preferences')).not.toBeNull();
  expect(errors).toEqual([]);
  act(() => root.unmount());
  container.remove();
});
