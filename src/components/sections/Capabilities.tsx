import { advisory, type AdvisoryService } from '../../lib/content/advisory';
import { url } from '../../lib/urls';
import { ConsultationLink } from '../common/ConsultationLink';
export function Capabilities({
  items = advisory.services,
}: Readonly<{
  items?: readonly AdvisoryService[];
}>) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
      {items.map((item) => (
        <article
          key={item.id}
          className="card-shadow bg-white p-6 md:p-8 rounded-sm flex flex-col"
        >
          <h3 className="text-2xl font-bold leading-snug">
            <a
              className="hover:text-nq-red"
              href={url(`/services/#${item.id}`)}
            >
              {item.title}
            </a>
          </h3>
          <p className="text-gray-600 mt-4 leading-relaxed">
            {item.description}
          </p>
          <ul className="my-6 space-y-2 text-sm text-gray-600">
            {item.outputs.map((output) => (
              <li key={output}>{output}</li>
            ))}
          </ul>
          <ConsultationLink
            interest={item.id}
            location="service-card"
            id={`service-${item.id}`}
            className="text-link mt-auto self-start"
          >
            Discuss this advisory service
          </ConsultationLink>
        </article>
      ))}
    </div>
  );
}
