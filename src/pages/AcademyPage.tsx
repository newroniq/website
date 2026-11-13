import { copy } from '../lib/content';
import { ConsultationLink } from '../components/common/ConsultationLink';
export function AcademyPage() {
  return (
    <main id="main-content">
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="section-shell max-w-4xl">
          <p className="eyebrow mb-4">Learning enquiries</p>
          <h1 className="hero-title mb-6">{copy.academy.heading}</h1>
          <p className="text-xl text-gray-600 mb-5">{copy.academy.intro}</p>
          <p className="mb-8">{copy.academy.description}</p>
          <ConsultationLink location="academy">
            Discuss learning requirements
          </ConsultationLink>
        </div>
      </section>
    </main>
  );
}
