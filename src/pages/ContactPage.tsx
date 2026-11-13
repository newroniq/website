import { copy, site } from '../lib/content';
import { ContactForm } from '../components/common/ContactForm';

export function ContactPage() {
  return (
    <main id="main-content">
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div>
            <h1 className="hero-title mb-6">{copy.contact.heading}</h1>
            <p className="text-lg leading-relaxed text-gray-600 mb-8">
              {copy.contact.intro}
            </p>
            <p className="text-sm font-bold mb-2">{copy.contact.email}</p>
            <a className="text-link break-words" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </div>
        </div>
      </section>
      <section className="section-space bg-gray-50 border-y border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div
            id="contact-form-container"
            className="bg-white p-5 sm:p-8 border-t-4 border-nq-red"
          >
            <h2 className="text-2xl font-bold mb-4">
              {copy.contact.form_heading}
            </h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
