import type { Capability, FocusArea } from '../../lib/content/home';
import { url } from '../../lib/urls';
export function FocusAreas({ items }: { items: FocusArea[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
      {items.map((item) => (
        <div key={item.title} className="border-l-4 border-nq-red pl-6">
          <p className="text-nq-red font-bold uppercase text-xs mb-2">
            {item.label}
          </p>
          <h3 className="text-xl font-bold mb-3">{item.title}</h3>
          <p className="text-gray-500 text-sm">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
export function Capabilities({ items }: { items: Capability[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {items.map((item) => (
        <article
          key={item.title}
          className="card-shadow bg-white p-10 rounded-sm"
        >
          <div className="mb-6 flex justify-between items-start">
            <h3 className="text-2xl font-bold">{item.title}</h3>
            <span className="bg-gray-100 text-[10px] font-bold px-3 py-1 uppercase tracking-tighter">
              {item.category}
            </span>
          </div>
          <p className="text-gray-600 mb-8 leading-relaxed">
            {item.description}
          </p>
          <ul className="space-y-3 mb-8 text-sm text-gray-500">
            {item.benefits.map((benefit) => (
              <li key={benefit} className="flex items-center">
                <svg
                  aria-hidden="true"
                  className="w-4 h-4 mr-2 text-nq-red"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                </svg>
                {benefit}
              </li>
            ))}
          </ul>
          <a
            href={url(item.action.href)}
            className="inline-block text-nq-red font-bold text-xs uppercase border-b-2 border-nq-red pb-1"
          >
            {item.action.label}
          </a>
        </article>
      ))}
    </div>
  );
}
