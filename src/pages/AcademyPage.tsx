import { academy } from '../lib/content/academy';
import { ConsultationLink } from '../components/common/ConsultationLink';
import { SectionHeading } from '../components/sections/SectionHeading';
export function AcademyPage() {
  return (
    <main id="main-content">
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-white">
        <div className="section-shell">
          <p className="eyebrow mb-4">{academy.hero.eyebrow}</p>
          <h1 className="hero-title max-w-4xl mb-6">{academy.hero.title}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mb-8">
            {academy.hero.description}
          </p>
          <ConsultationLink
            interest="academy"
            location="academy-hero"
            id="academy-register"
          >
            {academy.hero.action}
          </ConsultationLink>
        </div>
      </section>
      <section className="section-space bg-gray-50 border-y border-gray-100">
        <div className="section-shell">
          <SectionHeading
            eyebrow={academy.values.eyebrow}
            title={academy.values.title}
          />
          <div className="max-w-3xl space-y-5 mb-10 text-gray-600">
            {academy.values.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {academy.values.items.map((item) => (
              <div key={item.title}>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section-space bg-white">
        <div className="section-shell">
          <SectionHeading title={academy.learning.title} />
          <div className="grid md:grid-cols-2 gap-8">
            {academy.learning.areas.map((area) => (
              <div key={area.title} className="border-l-2 border-nq-red pl-5">
                <h3 className="text-xl font-bold mb-4">{area.title}</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  {area.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section-space bg-gray-50 border-y border-gray-100">
        <div className="section-shell">
          <SectionHeading
            eyebrow={academy.method.eyebrow}
            title={academy.method.title}
          />
          <ol className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {academy.method.steps.map((step, index) => (
              <li key={step.title} className="border-t-2 border-nq-red pt-5">
                <h3 className="text-xl font-bold mb-3">
                  <span className="text-nq-red">
                    {String(index + 1).padStart(2, '0')} —{' '}
                  </span>
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="section-space bg-white">
        <div className="section-shell">
          <SectionHeading {...academy.experience} />
          <ul className="list-disc pl-5 space-y-3 text-gray-600 max-w-3xl">
            {academy.experience.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section-space bg-gray-50 border-y border-gray-100">
        <div className="section-shell">
          <SectionHeading
            eyebrow={academy.audience.eyebrow}
            title={academy.audience.title}
          />
          <div className="grid md:grid-cols-3 gap-8">
            {academy.audience.items.map((item) => (
              <div key={item.title}>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section-space bg-white">
        <div className="section-shell">
          <SectionHeading {...academy.objectives} />
          <ul className="list-disc pl-5 space-y-3 text-gray-600 max-w-3xl">
            {academy.objectives.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section-space bg-gray-50 border-y border-gray-100">
        <div className="section-shell">
          <SectionHeading {...academy.finalAction} />
          <ConsultationLink
            interest="academy"
            location="academy-final"
            id="academy-register-final"
          >
            {academy.finalAction.action}
          </ConsultationLink>
        </div>
      </section>
    </main>
  );
}
