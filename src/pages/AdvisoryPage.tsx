import { advisory } from '../lib/content/advisory';
import { home } from '../lib/content/home';
import { Blueprint } from '../components/sections/Blueprint';
import { SectionHeading } from '../components/sections/SectionHeading';
import { ConsultationLink } from '../components/common/ConsultationLink';
export function AdvisoryPage() {
  return (
    <main id="main-content">
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-gray-50">
        <div className="section-shell">
          <p className="eyebrow mb-5">Independent enterprise AI advisory</p>
          <h1 className="hero-title max-w-5xl">{advisory.title}</h1>
          <p className="text-lg text-gray-600 mt-6 mb-8 max-w-3xl">
            {advisory.description}
          </p>
          <ConsultationLink location="advisory-hero" />
        </div>
      </section>
      <section className="section-space">
        <div className="section-shell">
          <SectionHeading
            title="Start with the decisions that matter"
            description={home.challenge.description}
          />
          <ul className="grid md:grid-cols-2 gap-5">
            {home.challenge.items.map((item) => (
              <li key={item.title}>
                <strong>{item.title}. </strong>
                {item.description}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <div className="bg-gray-50 border-y border-gray-100">
        {advisory.services.map((service) => (
          <section
            id={service.id}
            key={service.id}
            className="section-space border-b border-gray-200"
          >
            <div className="section-shell">
              <SectionHeading
                title={service.title}
                description={service.description}
              />
              <div className="grid lg:grid-cols-2 gap-10">
                <div className="space-y-5">
                  <p>
                    <strong>The problem. </strong>
                    {service.problem}
                  </p>
                  <p>
                    <strong>Who it helps. </strong>
                    {service.audience}
                  </p>
                  <p>
                    <strong>Our approach. </strong>
                    {service.approach}
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4">What you receive</h3>
                  <ul className="space-y-2 mb-7">
                    {service.outputs.map((output) => (
                      <li key={output}>{output}</li>
                    ))}
                  </ul>
                  <ConsultationLink
                    interest={service.id}
                    location="advisory-detail"
                    id={`advisory-${service.id}`}
                  />
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
      <Blueprint />
      <section className="section-space">
        <div className="section-shell">
          <SectionHeading
            title="Technology choices in enterprise context"
            description="Choose platforms and patterns for the business, data and operational environment they must serve."
          />
          <div className="grid md:grid-cols-2 gap-8">
            {advisory.expertise.map((item) => (
              <div key={item.title}>
                <h3 className="font-bold text-xl mb-3">{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section-space bg-gray-50">
        <div className="section-shell max-w-4xl">
          <SectionHeading
            title="How we engage"
            description={advisory.engagement}
          />
          <ConsultationLink
            interest="implementation"
            location="advisory-engagement"
            className="text-link"
          >
            Discuss follow-on implementation support
          </ConsultationLink>
        </div>
      </section>
      <section className="section-space">
        <div className="section-shell max-w-4xl">
          <SectionHeading title="Enterprise AI decisions, explained" />
          <div className="space-y-8">
            {advisory.faq.map((item) => (
              <section key={item.question}>
                <h3 className="font-bold text-xl mb-3">{item.question}</h3>
                <p className="text-gray-600">{item.answer}</p>
              </section>
            ))}
          </div>
          <div className="mt-10">
            <ConsultationLink location="advisory-final" />
          </div>
        </div>
      </section>
    </main>
  );
}
