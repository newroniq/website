import { research } from '../lib/content/research';
import { InsightCards } from '../components/sections/InsightCards';
export function WhitepapersPage() {
  return (
    <main id="main-content">
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-gray-50">
        <div className="section-shell">
          <p className="eyebrow mb-4">{research.eyebrow}</p>
          <h1 className="hero-title max-w-4xl mb-12">{research.title}</h1>
          <InsightCards />
        </div>
      </section>
    </main>
  );
}
