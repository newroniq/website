import { research } from '../../lib/content/research';
import { url } from '../../lib/urls';

type PaperId = (typeof research.papers)[number]['id'];

export function ResearchArticle({ id }: { id: PaperId }) {
  const paper = research.papers.find((entry) => entry.id === id);
  if (!paper) throw new Error(`Missing research paper: ${id}`);

  return (
    <div className="max-w-3xl">
      <p className="text-sm font-bold uppercase tracking-widest text-nq-red mb-4">
        {paper.category}
      </p>
      <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
        {paper.title}
      </h1>
      <p className="text-xl text-gray-600 leading-relaxed mb-8">
        {paper.description}
      </p>
      {(paper.author || paper.publishedOn) && (
        <p className="text-sm text-gray-500 mb-6">
          {paper.author}
          {paper.author && paper.publishedOn ? ' · ' : ''}
          {paper.publishedOn && (
            <time dateTime={paper.publishedOn}>{paper.publishedOn}</time>
          )}
        </p>
      )}
      <p className="leading-relaxed text-gray-600">{paper.intro}</p>
      {paper.sections.map(({ heading, body }) => (
        <section key={heading} className="mt-9">
          <h2 className="text-2xl font-bold mb-3">{heading}</h2>
          <p className="leading-relaxed">{body}</p>
        </section>
      ))}
      <section className="mt-10 border-t border-gray-200 pt-6">
        <h2 className="text-xl font-bold mb-4">{research.referencesHeading}</h2>
        <ul className="space-y-3">
          {paper.references.map((reference) => (
            <li key={reference.href}>
              <a className="text-link" href={reference.href}>
                {reference.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
      <a
        href={url('/contact/')}
        className="inline-block mt-10 text-nq-red font-bold underline"
      >
        {research.cta}
      </a>
    </div>
  );
}
