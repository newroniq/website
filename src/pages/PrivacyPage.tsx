import { privacy } from '../lib/content/privacy';
import { site } from '../lib/content';
export function PrivacyPage() {
  return (
    <main id="main-content">
      <div className="section-shell pt-32 pb-16 md:pt-40 md:pb-24">
        <article className="max-w-3xl">
          <h1 className="hero-title">{privacy.title}</h1>
          <p className="text-sm text-gray-500 mt-4 mb-6">
            {privacy.updatedLabel}:{' '}
            <time dateTime={privacy.updatedOn}>{privacy.updatedOn}</time>
          </p>
          <p className="text-lg leading-relaxed text-gray-600">
            {privacy.intro}
          </p>
          <a
            className="text-link inline-block mt-4"
            href={`mailto:${site.email}`}
          >
            {site.email}
          </a>
          {privacy.sections.map((section) => (
            <section key={section.heading} className="mt-10">
              <h2 className="text-2xl font-bold mb-4">{section.heading}</h2>
              <div className="space-y-4 leading-relaxed text-gray-600">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {section.links && (
                <ul className="mt-4 space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <a className="text-link" href={link.href}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>
      </div>
    </main>
  );
}
