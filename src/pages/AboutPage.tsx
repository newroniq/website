import { copy } from '../lib/content';
import { ConsultationLink } from '../components/common/ConsultationLink';
export function AboutPage() {
  return (
    <main id="main-content">
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="section-shell max-w-4xl">
          <p className="eyebrow mb-4">About NEWRONIQ</p>
          <h1 className="hero-title mb-6">{copy.about.heading}</h1>
          <p className="text-xl text-gray-600 mb-8">{copy.about.intro}</p>
          <h2 className="section-title mb-6">Our approach</h2>
          <ol className="list-decimal pl-6 space-y-3 mb-8">
            {copy.about.approach.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="text-lg text-gray-600 mb-8">{copy.about.expertise}</p>
          <p className="mb-8">
            We are a UK-based specialist consultancy. Advisory engagements focus
            on business value, clear trade-offs and practical recommendations;
            engineering support can follow where appropriate.
          </p>
          <ConsultationLink location="about" />
        </div>
      </section>
    </main>
  );
}
