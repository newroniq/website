import { url } from '../../lib/urls';
import { site } from '../../lib/content';
export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-100 pb-12 mb-12">
          <div className="max-w-xl text-center md:text-left">
            <span className="text-2xl font-black tracking-tighter text-nq-red">
              {site.name}
            </span>
            <h2 className="mt-3 text-sm font-bold">{site.footer.aboutHeading}</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              {site.footer.about}
            </p>
          </div>
          <div className="flex space-x-8 text-xs font-bold uppercase tracking-widest text-gray-400">
            {site.footer.links.map((link) => (
              <a
                key={link.label}
                href={link.href.startsWith('/') ? url(link.href) : link.href}
                className="hover:text-nq-red transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div className="text-center md:text-left text-[10px] text-gray-400 uppercase tracking-widest">
          {site.footer.copyright}
        </div>
      </div>
    </footer>
  );
}
