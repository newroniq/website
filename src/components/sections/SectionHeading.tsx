interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
}
export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="max-w-3xl mb-10 md:mb-12">
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h2 className="section-title">{title}</h2>
      {description && (
        <p className="mt-5 text-lg text-gray-600 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
