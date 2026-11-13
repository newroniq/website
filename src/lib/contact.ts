import type { InquiryId } from './content/inquiries';
import { url } from './urls';
export function contactHref(id: InquiryId) {
  return url(`/contact/?inquiry=${encodeURIComponent(id)}`);
}
