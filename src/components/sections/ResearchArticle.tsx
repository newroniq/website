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
      <p className="leading-relaxed">{paper.intro}</p>
      {paper.sections.map(({ heading, body }) => (
        <section key={heading} className="mt-9">
          <h2 className="text-2xl font-bold mb-3">{heading}</h2>
          <p className="leading-relaxed">{body}</p>
        </section>
      ))}
      <a
        href={url('/contact/')}
        className="inline-block mt-10 text-nq-red font-bold underline"
      >
        Discuss your project with NEWRONIQ
      </a>
    </div>
  );
}
