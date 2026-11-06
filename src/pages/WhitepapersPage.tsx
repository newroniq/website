import { research } from '../lib/content/research';
import { url } from '../lib/urls';
export function WhitepapersPage() {
  return (
    <main id="main-content">
      <section className="pt-40 pb-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-nq-red font-bold uppercase tracking-widest text-sm mb-4">
            {research.eyebrow}
          </p>
          <h1 className="text-4xl font-extrabold mb-12">{research.title}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {research.papers.map((paper) => (
              <a
                key={paper.id}
                href={url(`/whitepapers/${paper.id}/`)}
                className="bg-white p-8 card-shadow cursor-pointer group"
              >
                <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-2 block">
                  {paper.category}
                </span>
                <h2 className="text-xl font-bold mb-4 group-hover:text-nq-red transition-colors">
                  {paper.title}
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  {paper.description}
                </p>
                <span className="text-nq-red font-bold text-xs uppercase border-b border-nq-red pb-1">
                  {research.readLabel}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
