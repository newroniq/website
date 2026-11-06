import { copy, site } from '../lib/content';
import { ContactForm } from '../components/common/ContactForm';

export function ContactPage() {
  return (
    <main id="main-content">
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
              {copy.contact.heading}
            </h1>
            <p className="text-lg leading-relaxed text-gray-600 mb-8">
              {copy.contact.intro}
            </p>
            <p className="text-sm font-bold mb-2">{copy.contact.email}</p>
            <a
              className="font-bold text-nq-red underline"
              href={`mailto:${site.email}`}
            >
              {site.email}
            </a>
          </div>
          <div
            id="contact-form-container"
            className="bg-gray-50 p-5 sm:p-8 border-t-4 border-nq-red shadow-lg"
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
