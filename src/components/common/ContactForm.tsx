import { useState, type FormEvent } from 'react';
import { home } from '../../lib/content/home';
import { site } from '../../lib/content';
export function ContactForm() {
  const [requested, setRequested] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = `${site.form.name}: ${String(data.get('name'))}\n${site.form.email}: ${String(data.get('email'))}\n\n${String(data.get('message'))}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(String(data.get('type')))}&body=${encodeURIComponent(body)}`;
    setRequested(true);
  }
  const fieldClass =
    'w-full p-3 border border-gray-200 rounded-sm focus:outline-none focus:border-nq-red transition-colors';
  const labelClass = 'block text-[10px] font-bold uppercase text-gray-500 mb-1';
  return (
    <form
      className="space-y-4"
      action={`mailto:${site.email}`}
      method="post"
      encType="text/plain"
      onSubmit={submit}
    >
      <p className="text-sm text-gray-600" id="form-notice">
        {site.form.notice}
      </p>
      <div>
        <label className={labelClass} htmlFor="name">
          {site.form.name}
        </label>
        <input
          className={fieldClass}
          id="name"
          name="name"
          autoComplete="name"
          required
          maxLength={200}
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="email">
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
        <label className={labelClass} htmlFor="type">
          {site.form.type}
        </label>
        <select className={fieldClass} id="type" name="type">
          {home.capabilities.map(({ title }) => (
            <option key={title}>{title}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelClass} htmlFor="message">
          {site.form.message}
        </label>
        <textarea
          className={fieldClass}
          id="message"
          name="message"
          rows={4}
          maxLength={5000}
        />
      </div>
      <button
        type="submit"
        aria-describedby="form-notice"
        className="w-full bg-nq-red text-white py-4 font-bold uppercase text-xs tracking-widest hover:opacity-90 transition-all"
      >
        {site.form.submit}
      </button>
      {requested && (
        <p role="status" className="text-sm text-gray-600">
          {site.form.handoff}
        </p>
      )}
    </form>
  );
}
