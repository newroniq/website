import { advisory } from '../lib/content/advisory';
import { Blueprint } from '../components/sections/Blueprint';
import { SectionHeading } from '../components/sections/SectionHeading';
export function AdvisoryPage() {
  return (
    <main id="main-content">
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-white">
        <div className="section-shell">
          <h1 className="hero-title max-w-5xl">{advisory.title}</h1>
          <p className="text-lg text-gray-600 mt-6 max-w-3xl">
            {advisory.description}
          </p>
        </div>
      </section>
      <div className="border-y border-gray-100">
        {advisory.services.map((service, index) => (
          <section
            id={service.id}
            key={service.id}
            className={`section-space border-b border-gray-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
          >
            <div className="section-shell">
              {service.id === 'strategy' && <span id="roadmap" />}
              <SectionHeading
                title={service.title}
                description={service.description}
              />
              <div className="grid lg:grid-cols-2 gap-10">
                <div>
                  <h3 className="text-xl font-bold mb-4">What we do</h3>
                  <p className="text-gray-600">{service.whatWeDo}</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4">What you receive</h3>
                  <p className="text-gray-600">{service.whatYouReceive}</p>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
      <Blueprint />
    </main>
  );
}
