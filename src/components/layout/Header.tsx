import { useState } from 'react';
import { site } from '../../lib/content';
import { url } from '../../lib/urls';
export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <a className="skip-link" href="#main-content">
        {site.skipLabel}
      </a>
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <a
              href={url('/')}
              className="text-2xl font-extrabold tracking-tighter text-nq-red"
            >
              {site.name}
            </a>
            <nav
              aria-label="Main"
              className="hidden md:flex space-x-10 text-sm uppercase tracking-wider"
            >
              {site.navigation.map((link) => (
                <a key={link.href} href={url(link.href)} className="nav-link">
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <button
                className="md:hidden text-sm font-bold"
                type="button"
                aria-expanded={open}
                aria-controls="mobile-navigation"
                onClick={() => setOpen(!open)}
              >
                {site.menuLabel}
              </button>
              <a
                href={url('/contact/')}
                className="border-2 border-nq-red text-nq-red px-6 py-2 rounded-sm text-xs font-bold uppercase contact-nav-link transition-colors"
              >
                {site.contactLabel}
              </a>
            </div>
          </div>
          <nav
            id="mobile-navigation"
            aria-label="Mobile"
            hidden={!open}
            className="md:hidden pb-5"
          >
            {site.navigation.map((link) => (
              <a
                key={link.href}
                href={url(link.href)}
                onClick={() => setOpen(false)}
                className="block py-3 nav-link"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}
