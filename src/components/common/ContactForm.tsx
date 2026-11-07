import { useSyncExternalStore, useState, type FormEvent } from 'react';
import { site } from '../../lib/content';
import {
  inquiries,
  getInquiry,
  type InquiryId,
} from '../../lib/content/inquiries';
import { createInquiryEmail } from '../../lib/contact';
import { url } from '../../lib/urls';
function subscribeToNavigation(callback: () => void) {
  window.addEventListener('popstate', callback);
  return () => window.removeEventListener('popstate', callback);
}
export function ContactForm() {
  const search = useSyncExternalStore(
    subscribeToNavigation,
    () => window.location.search,
    () => '',
  );
  const [choice, setChoice] = useState<InquiryId | null>(null);
  const selected =
    choice ?? getInquiry(new URLSearchParams(search).get('inquiry')).id;
  const [draft, setDraft] = useState('');
  const inquiry = getInquiry(selected);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const mailto = createInquiryEmail({
      id: selected,
      name: String(data.get('name') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      organisation: String(data.get('organisation') ?? '').trim(),
      message: String(data.get('message') ?? '').trim(),
    });
    setDraft(mailto);
    window.location.href = mailto;
  }
  const fieldClass = 'form-field';
  return (
    <form
      className="space-y-5"
      action={`mailto:${site.email}`}
      method="post"
      encType="text/plain"
      onSubmit={submit}
      onChange={() => setDraft('')}
    >
      <p className="text-sm text-gray-600 leading-relaxed" id="form-notice">
        {site.form.notice}
      </p>
      {inquiry.kind === 'product' && (
        <p
          id="inquiry-context"
          role="note"
          className="border-l-4 border-nq-red bg-white p-4 text-sm leading-relaxed"
        >
          {site.form.productContext.replace('{product}', inquiry.productName!)}
        </p>
      )}
      <div>
        <label className="form-label" htmlFor="name">
          {site.form.name}
        </label>
        <input
          className={fieldClass}
          id="name"
          name="name"
          autoComplete="name"
          pattern={'.*\\S.*'}
          title={site.form.nameHint}
          required
          maxLength={200}
        />
      </div>
      <div>
        <label className="form-label" htmlFor="email">
          {site.form.email}
        </label>
        <input
          className={fieldClass}
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
        />
      </div>
      <div>
        <label className="form-label" htmlFor="organisation">
          {site.form.organisation}
        </label>
        <input
          className={fieldClass}
          id="organisation"
          name="organisation"
          autoComplete="organization"
          maxLength={200}
        />
      </div>
      <div>
        <label className="form-label" htmlFor="type">
          {site.form.type}
        </label>
        <select
          className={fieldClass}
          id="type"
          name="type"
          value={selected}
          onChange={(event) => {
            setChoice(getInquiry(event.target.value).id);
            setDraft('');
          }}
          aria-describedby={
            inquiry.kind === 'product' ? 'inquiry-context' : undefined
          }
        >
          {inquiries.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="form-label" htmlFor="message">
          {site.form.message}
        </label>
        <textarea
          className={fieldClass}
          id="message"
          name="message"
          rows={4}
          maxLength={2000}
        />
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">
        {site.form.sensitiveNotice}{' '}
        <a className="text-link" href={url(site.form.privacyHref)}>
          {site.form.privacyLabel}
        </a>
      </p>
      <button
        type="submit"
        aria-describedby="form-notice"
        className="button-primary w-full"
      >
        {site.form.submit}
      </button>
      {draft && (
        <div className="space-y-3">
          <p role="status" className="text-sm text-gray-600 leading-relaxed">
            {site.form.handoff}
          </p>
          <a className="text-link" href={draft}>
            {site.form.draftLink}
          </a>
        </div>
      )}
    </form>
  );
}
