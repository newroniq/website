import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it, vi } from 'vitest';
import { AnalyticsPreferences } from '../components/analytics/AnalyticsPreferences';
import { setConsent } from '../lib/analytics';
vi.mock('../lib/config', () => ({ analyticsAvailable: false }));
vi.mock('../lib/analytics', () => ({
  getConsent: () => 'rejected',
  getServerConsent: () => 'pending',
  setConsent: vi.fn(),
  startAnalytics: () => () => {},
  subscribeConsent: () => () => {},
}));
beforeEach(() => vi.clearAllMocks());
it('dismisses open preferences with Escape and restores focus without a section key handler', async () => {
  const user = userEvent.setup();
  render(<AnalyticsPreferences />);
  const trigger = screen.getByRole('button', { name: 'Analytics Preferences' });
  await user.click(trigger);
  const panel = screen.getByRole('region', { name: 'Optional analytics' });
  expect(panel).toHaveFocus();
  await user.keyboard('{Escape}');
  expect(
    screen.queryByRole('region', { name: 'Optional analytics' }),
  ).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(setConsent).not.toHaveBeenCalled();
});
it.each([
  ['Accept analytics', 'accepted'],
  ['Reject analytics', 'rejected'],
] as const)('retains the %s action', async (label, value) => {
  const user = userEvent.setup();
  render(<AnalyticsPreferences />);
  const trigger = screen.getByRole('button', { name: 'Analytics Preferences' });
  await user.click(trigger);
  await user.click(screen.getByRole('button', { name: label }));
  expect(setConsent).toHaveBeenCalledExactlyOnceWith(value);
  expect(trigger).toHaveFocus();
  expect(
    screen.queryByRole('region', { name: 'Optional analytics' }),
  ).not.toBeInTheDocument();
});
