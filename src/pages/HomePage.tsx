import { home } from '../lib/content/home';
import { advisory } from '../lib/content/advisory';
import { url } from '../lib/urls';
import { Capabilities } from '../components/sections/Capabilities';
import { InsightCards } from '../components/sections/InsightCards';
import { SectionHeading } from '../components/sections/SectionHeading';
import { Blueprint } from '../components/sections/Blueprint';
import { ProductCards } from '../components/sections/ProductCards';
import { ConsultationLink } from '../components/common/ConsultationLink';
export function HomePage() {
  return (
    <main id="main-content">
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-gray-50 border-b border-gray-100">
        <div className="section-shell">
          <div className="max-w-5xl">
            <p className="eyebrow mb-5">{home.hero.eyebrow}</p>
            <h1 className="hero-title">
              {home.hero.title}{' '}
              <span className="text-nq-red">{home.hero.highlight}</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mt-7 max-w-3xl leading-relaxed">
              {home.hero.description}
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <ConsultationLink location="home-hero" id="hero-consultation">
                {home.hero.primaryAction}
              </ConsultationLink>
              <a
                className="button-secondary"
                href={url(home.hero.secondaryAction.href)}
                data-cta-id="explore-advisory"
                data-cta-location="home-hero"
              >
                {home.hero.secondaryAction.label}
              </a>
            </div>
          </div>
        </div>
      </section>
      <section id="outcomes" className="section-space">
        <div className="section-shell">
          <SectionHeading {...home.challenge} />
          <div className="grid md:grid-cols-3 gap-8">
            {home.challenge.items.map((item) => (
              <div key={item.title} className="border-l-4 border-nq-red pl-5">
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section
        id="services"
        className="section-space bg-gray-50 border-y border-gray-100"
      >
        <div className="section-shell">
          <SectionHeading
            eyebrow="AI Advisory"
            title="Our Enterprise AI Advisory Services"
            description="Focused engagements that turn uncertainty into informed investment and architecture decisions."
          />
          <Capabilities />
        </div>
      </section>
      <Blueprint />
      <section id="about" className="section-space">
        <div className="section-shell">
          <SectionHeading {...home.strengths} />
          <div className="grid md:grid-cols-2 gap-8">
            {advisory.expertise.map((item) => (
              <div key={item.title}>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
          <a className="text-link inline-block mt-7" href={url('/about/')}>
            About NEWRONIQ
          </a>
        </div>
      </section>
      <section className="section-space bg-gray-50 border-y border-gray-100">
        <div className="section-shell">
          <SectionHeading
            title={home.audience.title}
            description={home.audience.description}
          />
          <ul className="grid md:grid-cols-2 gap-5">
            {home.audience.items.map((item) => (
              <li className="border-l-2 border-nq-red pl-5" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section id="insights" className="section-space">
        <div className="section-shell">
          <SectionHeading {...home.insights} />
          <InsightCards headingLevel={3} />
          <a
            className="text-link inline-block mt-8"
            href={url('/whitepapers/')}
          >
            {home.insights.allLabel}
          </a>
        </div>
      </section>
      <section
        id="products"
        className="py-12 md:py-16 bg-gray-50 border-y border-gray-100"
      >
        <div className="section-shell">
          <SectionHeading {...home.products} />
          <ProductCards />
          <a className="text-link inline-block mt-8" href={url('/products/')}>
            All product initiatives
          </a>
        </div>
      </section>
      <section className="section-space bg-nq-red text-white">
        <div className="section-shell">
          <div className="max-w-3xl">
            <h2 className="section-title">{home.finalAction.title}</h2>
            <p className="mt-5 mb-8 text-lg">{home.finalAction.description}</p>
            <ConsultationLink
              location="home-final"
              id="final-consultation"
              className="button-light"
            >
              {home.finalAction.action}
            </ConsultationLink>
          </div>
        </div>
      </section>
    </main>
  );
}
