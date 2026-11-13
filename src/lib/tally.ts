import { getInquiry } from './content/inquiries';
export function tallyUrl(formId: string, interest: unknown, embed = false) {
  const result = new URL(`https://tally.so/${embed ? 'embed' : 'r'}/${formId}`);
  const inquiry = getInquiry(interest);
  result.searchParams.set('interest_context', inquiry.id);
  result.searchParams.set('interest_label', inquiry.label);
  if (embed) {
    result.searchParams.set('alignLeft', '1');
    result.searchParams.set('hideTitle', '1');
    result.searchParams.set('transparentBackground', '1');
  }
  return result.href;
}
export function submissionId(
  event: MessageEvent,
  frame: Window | null,
  formId: string,
): string | undefined {
  if (
    !frame ||
    event.origin !== 'https://tally.so' ||
    event.source !== frame ||
    typeof event.data !== 'string'
  )
    return;
  try {
    const data: unknown = JSON.parse(event.data);
    if (
      !data ||
      typeof data !== 'object' ||
      !('event' in data) ||
      data.event !== 'Tally.FormSubmitted' ||
      !('payload' in data)
    )
      return;
    const payload = data.payload;
    if (
      !payload ||
      typeof payload !== 'object' ||
      !('formId' in payload) ||
      payload.formId !== formId ||
      !('id' in payload) ||
      typeof payload.id !== 'string' ||
      !payload.id ||
      payload.id.length > 200
    )
      return;
    return payload.id;
  } catch {
    return;
  }
}
