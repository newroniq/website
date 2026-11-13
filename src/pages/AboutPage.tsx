import { copy } from '../lib/content';
import { ConsultationLink } from '../components/common/ConsultationLink';
export function AboutPage() {
  return (
    <main id="main-content">
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-white">
        <div className="section-shell max-w-4xl">
          <h1 className="hero-title mb-6">{copy.about.heading}</h1>
          <p className="text-xl text-gray-600 mb-8">{copy.about.intro}</p>
          <p className="text-lg text-gray-600 mb-6">
            {copy.about.expertiseIntro}
          </p>
          <p className="text-lg text-gray-600">{copy.about.description}</p>
        </div>
      </section>
      <section className="section-space bg-gray-50 border-y border-gray-100">
        <div className="section-shell max-w-4xl">
          <h2 className="section-title mb-6">Our Approach</h2>
          <div className="space-y-6">
            {copy.about.approach.map((step, index) => (
              <div key={step}>
                <h3 className="font-bold mb-2">
                  {copy.about.principles[index]}
                </h3>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section-space bg-white">
        <div className="section-shell max-w-4xl">
          <h2 className="section-title mb-6">Our Expertise</h2>
          <p className="text-lg text-gray-600 mb-8">{copy.about.expertise}</p>
          <ConsultationLink location="about">
            Discuss Your AI Initiative
          </ConsultationLink>
        </div>
      </section>
    </main>
  );
}
