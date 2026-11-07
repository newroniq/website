import { getInquiry, type InquiryId } from './content/inquiries';
import { site } from './content';
import { url } from './urls';
export function contactHref(id: InquiryId) {
  return url(`/contact/?inquiry=${encodeURIComponent(id)}`);
}
export interface InquiryDetails {
  id: InquiryId;
  name: string;
  email: string;
  organisation: string;
  message: string;
}
export function createInquiryEmail(details: InquiryDetails) {
  const inquiry = getInquiry(details.id);
  const body = [
    `${site.form.name}: ${details.name}`,
    `${site.form.email}: ${details.email}`,
    `${site.form.type}: ${inquiry.label}`,
    ...(details.organisation
      ? [`${site.form.organisation}: ${details.organisation}`]
      : []),
    '',
    details.message.replace(/\r?\n/g, '\r\n'),
  ].join('\r\n');
  return `mailto:${site.email}?subject=${encodeURIComponent(inquiry.subject)}&body=${encodeURIComponent(body)}`;
}
