import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { tallyFormId } from '../../lib/config';
import { site } from '../../lib/content';
import { getInquiry } from '../../lib/content/inquiries';
import { tallyUrl, submissionId } from '../../lib/tally';
import { track } from '../../lib/analytics';
import { url } from '../../lib/urls';
const subscribe = (callback: () => void) => {
  window.addEventListener('popstate', callback);
  return () => window.removeEventListener('popstate', callback);
};
const getInterest = () =>
  getInquiry(new URLSearchParams(window.location.search).get('inquiry')).id;
export function ContactForm() {
  const interest = useSyncExternalStore(
    subscribe,
    getInterest,
    () => 'general',
  );
  const frame = useRef<HTMLIFrameElement>(null);
  const observed = useRef(new Set<string>());
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    if (!tallyFormId) return;
    const receive = (event: MessageEvent) => {
      if (event.origin !== 'https://tally.so') return;
      const id = submissionId(
        event,
        frame.current?.contentWindow ?? null,
        tallyFormId,
      );
      if (!id || observed.current.has(id)) return;
      observed.current.add(id);
      setSubmitted(true);
      track('lead_form_submitted', {
        form_id: tallyFormId,
        interest_context: interest,
      });
    };
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, [interest]);
  return (
    <div>
      {interest !== 'general' && (
        <p role="note" className="text-sm mb-5">
          Enquiry context: {getInquiry(interest).label}. Please confirm your
          area of interest in the form.
        </p>
      )}
      <p className="text-sm text-gray-600 mb-4">{site.form.sensitiveNotice}</p>
      {tallyFormId ? (
        <>
          {/* Use the official iframe URL directly. The optional helper forwards arbitrary page queries; a fixed-height iframe avoids that disclosure. */}
          <iframe
            ref={frame}
            src={tallyUrl(tallyFormId, interest, true)}
            title="NEWRONIQ consultation enquiry"
            className="tally-frame"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <a
            className="text-link block mt-4"
            href={tallyUrl(tallyFormId, interest)}
            data-cta-id="tally-fallback"
            data-cta-location="contact"
          >
            {site.form.fallbackLabel}
          </a>
        </>
      ) : (
        <p className="mb-5">
          {site.form.unavailable}{' '}
          <a className="text-link" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </p>
      )}
      <output aria-live="polite" className="block font-semibold mt-4">
        {submitted ? site.form.success : ''}
      </output>
      <a
        className="text-link text-sm inline-block mt-4"
        href={url(site.form.privacyHref)}
      >
        {site.form.privacyLabel}
      </a>
    </div>
  );
}
