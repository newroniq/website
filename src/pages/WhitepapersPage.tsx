import { research } from '../lib/content/research';
import { InsightCards } from '../components/sections/InsightCards';
export function WhitepapersPage() {
  return (
    <main id="main-content">
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-white">
        <div className="section-shell">
          <p className="eyebrow mb-4">{research.eyebrow}</p>
          <h1 className="hero-title max-w-4xl">{research.title}</h1>
        </div>
      </section>
      <section
        aria-label="Published insights"
        className="section-space bg-gray-50 border-y border-gray-100"
      >
        <div className="section-shell">
          <InsightCards />
        </div>
      </section>
    </main>
  );
}
