import type { ReactNode } from 'react';
import { contactHref } from '../../lib/contact';
import type { InquiryId } from '../../lib/content/inquiries';
import { productIdSchema } from '../../lib/content/schema';
export function ConsultationLink({
  interest = 'general',
  location,
  id = 'consultation',
  children = 'Request an AI Advisory Consultation',
  className = 'button-primary',
}: Readonly<{
  interest?: InquiryId;
  location: string;
  id?: string;
  children?: ReactNode;
  className?: string;
}>) {
  return (
    <a
      href={contactHref(interest)}
      className={className}
      data-cta-id={id}
      data-cta-location={location}
      data-service={interest}
      data-product={
        productIdSchema.safeParse(interest).success ? interest : undefined
      }
    >
      {children}
    </a>
  );
}
