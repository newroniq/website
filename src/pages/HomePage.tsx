import { home } from '../lib/content/home';
import { site } from '../lib/content';
import { products } from '../lib/content/products';
import { url } from '../lib/urls';
import { Capabilities } from '../components/sections/Capabilities';
import { InsightCards } from '../components/sections/InsightCards';
import { SectionHeading } from '../components/sections/SectionHeading';
export function HomePage() {
  return (
    <main id="main-content">
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-gray-50 border-b border-gray-100">
        <div className="section-shell">
          <div className="max-w-5xl">
            <p className="eyebrow mb-5">{site.tagline}</p>
            <h1 className="hero-title">
              {home.hero.title}{' '}
              <span className="text-nq-red">{home.hero.highlight}</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mt-7 max-w-3xl leading-relaxed">
              {home.hero.description}
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <a
                className="button-primary"
                href={url(home.hero.primaryAction.href)}
              >
                {home.hero.primaryAction.label}
              </a>
              <a
                className="button-secondary"
                href={url(home.hero.secondaryAction.href)}
              >
                {home.hero.secondaryAction.label}
              </a>
            </div>
          </div>
        </div>
      </section>
      <section id="outcomes" className="section-space">
        <div className="section-shell">
          <SectionHeading {...home.outcomes} />
          <div className="grid md:grid-cols-3 gap-8">
            {home.outcomes.items.map((item) => (
              <div key={item.title} className="border-l-4 border-nq-red pl-5">
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <ul className="space-y-3 text-gray-600 leading-relaxed">
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
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
          <SectionHeading {...home.services} />
          <Capabilities items={home.capabilities} />
        </div>
      </section>
      <section id="about" className="section-space">
        <div className="section-shell">
          <SectionHeading
            eyebrow={home.about.eyebrow}
            title={home.about.title}
          />
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-20">
            <div className="space-y-5 text-lg text-gray-600 leading-relaxed">
              <p>{home.about.description}</p>
              <p>{home.about.philosophy}</p>
            </div>
            <div className="space-y-7">
              {home.about.principles.map((item) => (
                <div key={item.title}>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section
        id="approach"
        className="section-space bg-gray-50 border-y border-gray-100"
      >
        <div className="section-shell">
          <SectionHeading
            eyebrow={home.approach.eyebrow}
            title={home.approach.title}
          />
          <ol className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {home.approach.steps.map((step, index) => (
              <li key={step.title} className="border-t-2 border-nq-red pt-5">
                <span className="eyebrow text-xs" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="text-xl font-bold mt-2 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.activity}</p>
                <p className="mt-4 text-sm leading-relaxed">
                  <strong>{home.approach.outputLabel}: </strong>
                  {step.output}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section id="insights" className="section-space">
        <div className="section-shell">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
            <SectionHeading {...home.insights} />
            <a
              className="text-link lg:mt-10 shrink-0 mb-7"
              href={url('/whitepapers/')}
            >
              {home.insights.allLabel}
              <span aria-hidden="true"> →</span>
            </a>
          </div>
          <InsightCards headingLevel={3} />
        </div>
      </section>
      <section
        id="products"
        className="py-12 md:py-16 bg-gray-50 border-y border-gray-100"
      >
        <div className="section-shell">
          <SectionHeading {...home.products} />
          <div className="grid md:grid-cols-2 gap-6">
            {products.products.map((product) => (
              <article
                key={product.id}
                className="border-l-2 border-gray-300 pl-5"
              >
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-gray-600 leading-relaxed mb-3">
                  {product.summary}
                </p>
                <a className="text-link" href={url(`/${product.id}/`)}>
                  {home.products.actionLabel}: {product.name}
                  <span aria-hidden="true"> →</span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section-space bg-nq-red text-white">
        <div className="section-shell">
          <div className="max-w-3xl">
            <h2 className="section-title">{home.finalAction.title}</h2>
            <p className="mt-5 mb-8 text-lg leading-relaxed text-white">
              {home.finalAction.description}
            </p>
            <a
              className="button-light"
              href={url(home.finalAction.action.href)}
            >
              {home.finalAction.action.label}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
