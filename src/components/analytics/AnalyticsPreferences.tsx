import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import {
  getConsent,
  getServerConsent,
  setConsent,
  startAnalytics,
  subscribeConsent,
} from '../../lib/analytics';
import { analyticsAvailable } from '../../lib/config';
const subscribeAvailability = () => () => {};
export function AnalyticsPreferences() {
  // Prerendering never initializes browser analytics. Reveal its controls after hydration.
  const enabled = useSyncExternalStore(
    subscribeAvailability,
    () => analyticsAvailable,
    () => false,
  );
  const consent = useSyncExternalStore(
    subscribeConsent,
    getConsent,
    getServerConsent,
  );
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  useEffect(startAnalytics, []);
  useEffect(() => {
    if (!open) return;
    panel.current?.focus();
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener('keydown', dismiss);
    return () => document.removeEventListener('keydown', dismiss);
  }, [open]);
  const visible = open || (enabled && consent === 'pending');
  const choose = (value: 'accepted' | 'rejected') => {
    setConsent(value);
    setOpen(false);
    trigger.current?.focus();
  };
  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="text-link text-sm mt-5"
        aria-expanded={visible}
        aria-controls="analytics-preferences"
        onClick={() => setOpen(!open)}
      >
        Analytics Preferences
      </button>
      {visible && (
        <section
          id="analytics-preferences"
          ref={panel}
          tabIndex={-1}
          aria-labelledby="analytics-title"
          className="consent-panel"
        >
          <h2 id="analytics-title" className="font-bold text-lg">
            Optional analytics
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            May we use PostHog to understand page visits and enquiry
            interactions? We do not record sessions or send form answers.
            Rejecting analytics keeps the enquiry form available.
            {!enabled && ' Analytics is not enabled in this environment.'}
          </p>
          <p className="text-sm mt-2">
            Current preference: {consent === 'pending' ? 'not chosen' : consent}
            .
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <button
              type="button"
              className="button-secondary"
              onClick={() => choose('rejected')}
            >
              Reject analytics
            </button>
            <button
              type="button"
              className="button-primary"
              onClick={() => choose('accepted')}
            >
              Accept analytics
            </button>
          </div>
        </section>
      )}
    </>
  );
}
