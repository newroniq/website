import { research } from '../../lib/content/research';
import { url } from '../../lib/urls';
export function InsightCards({ headingLevel = 2 }: { headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {research.papers.map((paper) => (
        <article
          key={paper.id}
          className="card-shadow bg-white p-6 md:p-7 rounded-sm flex flex-col"
        >
          <p className="eyebrow text-xs mb-4">{paper.category}</p>
          <Heading className="text-xl font-bold leading-snug">
            <a
              className="hover:text-nq-red"
              href={url(`/whitepapers/${paper.id}/`)}
            >
              {paper.title}
            </a>
          </Heading>
          {(paper.author || paper.publishedOn) && (
            <p className="text-sm text-gray-500 mt-3">
              {paper.author}
              {paper.author && paper.publishedOn ? ' · ' : ''}
              {paper.publishedOn && (
                <time dateTime={paper.publishedOn}>{paper.publishedOn}</time>
              )}
            </p>
          )}
          <p className="text-sm text-gray-600 leading-relaxed mt-4 mb-6">
            {paper.description}
          </p>
          <a
            href={url(`/whitepapers/${paper.id}/`)}
            className="text-link mt-auto self-start"
            aria-label={`${research.readLabel}: ${paper.title}`}
          >
            {research.readLabel}
            <span aria-hidden="true"> →</span>
          </a>
        </article>
      ))}
    </div>
  );
}
