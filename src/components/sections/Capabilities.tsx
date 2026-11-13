import { advisory, type AdvisoryService } from '../../lib/content/advisory';
import { url } from '../../lib/urls';
export function Capabilities({
  items = advisory.services,
}: Readonly<{
  items?: readonly AdvisoryService[];
}>) {
  return (
    <div className="service-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {items.map((item, index) => (
        <article
          key={item.id}
          className="service-card card-shadow bg-white p-6 md:p-8 rounded-sm flex flex-col"
        >
          <p className="service-card-number eyebrow mb-3" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </p>
          <h3 className="service-card-title text-2xl font-bold leading-snug">
            <a
              className="hover:text-nq-red"
              href={url(`/services/#${item.id}`)}
            >
              {item.title}
            </a>
          </h3>
          <p className="service-card-description text-gray-600 mt-4 mb-6 leading-relaxed">
            {item.cardDescription}
          </p>
          <ul className="service-card-capabilities mt-auto space-y-2 text-sm text-gray-600">
            {item.capabilities.map((output) => (
              <li key={output}>{output}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
