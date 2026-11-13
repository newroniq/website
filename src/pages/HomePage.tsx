import { home } from '../lib/content/home';
import { url } from '../lib/urls';
import { Capabilities } from '../components/sections/Capabilities';
import { SectionHeading } from '../components/sections/SectionHeading';
import { ProductCards } from '../components/sections/ProductCards';
import { ConsultationLink } from '../components/common/ConsultationLink';
export function HomePage() {
  return (
    <main id="main-content" className="homepage">
      <section className="homepage-hero bg-white border-b border-gray-100">
        <div className="section-shell">
          <div className="homepage-hero-content">
            <p className="eyebrow">{home.hero.eyebrow}</p>
            <h1 className="hero-title homepage-hero-title">
              {home.hero.title}{' '}
              <span className="homepage-hero-highlight text-nq-red">
                {home.hero.highlight}
              </span>
            </h1>
            <p className="homepage-hero-description text-gray-600">
              {home.hero.description}
            </p>
            <div className="homepage-hero-actions">
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
      <section
        id="services"
        className="section-space bg-gray-50 border-y border-gray-100"
      >
        <div className="section-shell">
          <SectionHeading {...home.services} />
          <Capabilities />
          <a
            className="text-link inline-block mt-8"
            href={url('/services/')}
            data-cta-id="explore-advisory"
            data-cta-location="home-services"
          >
            Explore Our Advisory Services
          </a>
        </div>
      </section>
      <section id="approach" className="section-space">
        <div className="section-shell">
          <SectionHeading
            eyebrow={home.approach.eyebrow}
            title={home.approach.title}
          />
          <ol className="grid md:grid-cols-3 gap-8">
            {home.approach.steps.map((step) => (
              <li key={step.title} className="border-t-2 border-nq-red pt-5">
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 font-bold">{home.approach.outcome}</p>
        </div>
      </section>
      <section
        id="products"
        className="section-space bg-gray-50 border-y border-gray-100"
      >
        <div className="section-shell">
          <SectionHeading {...home.products} />
          <ProductCards />
        </div>
      </section>
      <section id="contact" className="section-space bg-nq-red text-white">
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
