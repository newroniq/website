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
          eyebrow="Flagship engagement"
          title={blueprint.title}
          description={blueprint.description}
        />
        <h3 className="text-xl font-bold mt-10 mb-4">Typical outputs</h3>
        <ul className="grid md:grid-cols-2 gap-3 mb-8">
          {blueprint.deliverables.map((output) => (
            <li key={output}>{output}</li>
          ))}
        </ul>
        <ConsultationLink location="blueprint" id="blueprint-consultation">
          Discuss Your Requirements
        </ConsultationLink>
      </div>
    </section>
  );
}
