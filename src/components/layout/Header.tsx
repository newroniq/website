import { useEffect, useRef, useState } from 'react';
import { Wordmark } from '../common/Wordmark';
import { site } from '../../lib/content';
import { url } from '../../lib/urls';
export function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);
  return (
    <>
      <a className="skip-link" href="#main-content">
        {site.skipLabel}
      </a>
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="section-shell">
          <div className="flex justify-between h-20 items-center gap-3">
            <a
              href={url('/')}
              aria-label={site.name}
              className="text-xl sm:text-2xl font-extrabold tracking-tighter shrink-0"
            >
              <Wordmark />
            </a>
            <nav
              aria-label="Main"
              className="hidden lg:flex gap-5 lg:gap-8 text-sm font-medium"
            >
              {site.navigation.map((link) => (
                <a
                  key={link.href}
                  href={url(link.href)}
                  className="nav-link py-3"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                ref={toggle}
                className="lg:hidden menu-toggle"
                type="button"
                aria-expanded={open}
                aria-controls="mobile-navigation"
                onClick={() => setOpen(!open)}
              >
                {site.menuLabel}
              </button>
              <a
                href={url('/contact/')}
                className="button-secondary nav-contact"
                data-cta-id="header-contact"
                data-cta-location="header"
              >
                {site.contactLabel}
              </a>
            </div>
          </div>
          <nav
            id="mobile-navigation"
            aria-label="Mobile"
            hidden={!open}
            className="lg:hidden pb-5"
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
