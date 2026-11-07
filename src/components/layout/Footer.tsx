import { url } from '../../lib/urls';
import { site } from '../../lib/content';
export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12 md:py-16">
      <div className="section-shell">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 pb-10">
          <div>
            <p className="text-2xl font-extrabold tracking-tighter text-nq-red mb-4">
              {site.legalName}
            </p>
            <h2 className="font-bold mb-3">{site.footer.aboutHeading}</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {site.footer.about}
            </p>
          </div>
          <nav aria-label="Footer">
            <h2 className="font-bold mb-4">{site.footer.navigationLabel}</h2>
            <ul className="grid grid-cols-2 gap-x-5 gap-y-3 text-sm">
              {site.footer.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={url(link.href)}
                    className="nav-link inline-block py-1"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 className="font-bold mb-4">{site.footer.contactHeading}</h2>
            <a className="text-link break-words" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <p className="text-sm text-gray-600 leading-relaxed mt-5">
              {site.tagline}
            </p>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-7 text-sm text-gray-600 leading-relaxed space-y-2">
          <p>
            {site.legalName}. {site.company.registrationLabel}{' '}
            {site.company.registeredIn}. {site.company.numberLabel}:{' '}
            {site.company.number}.
          </p>
          <p>
            {site.company.officeLabel}: {site.company.registeredOffice}.
          </p>
          <a className="text-link inline-block" href={site.company.registryUrl}>
            {site.company.registryLabel}
          </a>
          <p className="pt-4">{site.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
