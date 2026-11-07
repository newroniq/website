import type { Capability } from '../../lib/content/home';
import { getInquiry } from '../../lib/content/inquiries';
import { contactHref } from '../../lib/contact';
export function Capabilities({ items }: { items: Capability[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
      {items.map((item) => (
        <article
          key={item.inquiryId}
          className="card-shadow bg-white p-6 md:p-8 rounded-sm flex flex-col"
        >
          <p className="eyebrow text-xs mb-3">{item.category}</p>
          <h3 className="text-2xl font-bold leading-snug">
            {getInquiry(item.inquiryId).label}
          </h3>
          <p className="text-gray-600 mt-4 leading-relaxed">
            {item.description}
          </p>
          <ul className="my-6 space-y-3 text-sm text-gray-600">
            {item.benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <span className="text-nq-red font-bold" aria-hidden="true">
                  ✓
                </span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
          <a
            href={contactHref(item.inquiryId)}
            className="text-link mt-auto self-start"
          >
            {item.actionLabel}
            <span aria-hidden="true"> →</span>
          </a>
        </article>
      ))}
    </div>
  );
}
