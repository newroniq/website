import { advisory } from '../../lib/content/advisory';
import { SectionHeading } from './SectionHeading';
import { ConsultationLink } from '../common/ConsultationLink';
export function Blueprint() {
  const blueprint = advisory.blueprint;
  return (
    <section
      id="approach"
      className="section-space bg-gray-50 border-y border-gray-100"
    >
      <div className="section-shell">
        <SectionHeading
          eyebrow="Our flagship engagement"
          title={blueprint.title}
          description={blueprint.description}
        />
        <ol className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          {blueprint.steps.map((step, index) => (
            <li key={step.title} className="border-t-2 border-nq-red pt-5">
              <span className="eyebrow text-xs" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="text-xl font-bold mt-2 mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </li>
          ))}
        </ol>
        <h3 className="text-xl font-bold mt-10 mb-4">What you receive</h3>
        <ul className="grid md:grid-cols-2 gap-3 mb-8">
          {blueprint.deliverables.map((output) => (
            <li key={output}>{output}</li>
          ))}
        </ul>
        <ConsultationLink location="blueprint" id="blueprint-consultation" />
      </div>
    </section>
  );
}
