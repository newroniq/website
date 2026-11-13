import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { submissionId } from '../lib/tally';
import { ContactForm } from '../components/common/ContactForm';
import { track } from '../lib/analytics';
vi.mock('../lib/config', () => ({ tallyFormId: 'testForm' }));
vi.mock('../lib/analytics', () => ({ track: vi.fn() }));
afterEach(() => {
  window.history.replaceState({}, '', '/');
  vi.clearAllMocks();
});
const body = (id = 'submission-1', formId = 'testForm') =>
  JSON.stringify({
    event: 'Tally.FormSubmitted',
    payload: {
      id,
      formId,
      fields: [{ title: 'Email', answer: { value: 'private@example.com' } }],
    },
  });
describe('Tally message boundary', () => {
  it('validates origin, iframe, event, form and submission ID without reading answers', () => {
    const frame = document.createElement('iframe');
    document.body.append(frame);
    const source = frame.contentWindow!;
    const event = (
      data: unknown,
      origin = 'https://tally.so',
      sender: Window = source,
    ) => new MessageEvent('message', { data, origin, source: sender });
    expect(submissionId(event(body()), source, 'testForm')).toBe(
      'submission-1',
    );
    expect(
      submissionId(event(body(), 'https://evil.test'), source, 'testForm'),
    ).toBeUndefined();
    expect(
      submissionId(
        event(body(), 'https://tally.so', window),
        source,
        'testForm',
      ),
    ).toBeUndefined();
    expect(
      submissionId(event(body('id', 'anotherForm')), source, 'testForm'),
    ).toBeUndefined();
    expect(submissionId(event(body('')), source, 'testForm')).toBeUndefined();
    for (const data of [
      'bad JSON',
      null,
      '{}',
      '[]',
      JSON.stringify({
        event: 'Tally.FormLoaded',
        payload: { formId: 'testForm' },
      }),
      { event: 'Tally.FormSubmitted' },
    ])
      expect(submissionId(event(data), source, 'testForm')).toBeUndefined();
    expect(submissionId(event(body()), null, 'testForm')).toBeUndefined();
    frame.remove();
  });
  it('preserves context, rejects false success and deduplicates genuine submission messages', () => {
    window.history.replaceState(
      {},
      '',
      '/contact/?inquiry=doptimiser&email=private@example.com',
    );
    render(<ContactForm />);
    const frame = screen.getByTitle(
      'NEWRONIQ consultation enquiry',
    ) as HTMLIFrameElement;
    const src = new URL(frame.src);
    expect(src.searchParams.get('interest_context')).toBe('doptimiser');
    expect(src.searchParams.get('interest_label')).toBe('DOptimiser');
    expect(src.searchParams.has('email')).toBe(false);
    expect(
      screen.getByRole('link', { name: /Open the enquiry form/ }),
    ).toHaveAttribute(
      'href',
      'https://tally.so/r/testForm?interest_context=doptimiser&interest_label=DOptimiser',
    );
    const send = (data: string, origin = 'https://tally.so') =>
      act(() => {
        window.dispatchEvent(
          new MessageEvent('message', {
            data,
            origin,
            source: frame.contentWindow,
          }),
        );
      });
    send(body(), 'https://evil.test');
    send(
      JSON.stringify({
        event: 'Tally.FormPageView',
        payload: { formId: 'testForm' },
      }),
    );
    expect(screen.getByRole('status').tagName).toBe('OUTPUT');
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    expect(track).not.toHaveBeenCalled();
    send(body());
    send(body());
    expect(screen.getByRole('status')).toHaveTextContent(
      'Your enquiry has been received.',
    );
    expect(track).toHaveBeenCalledExactlyOnceWith('lead_form_submitted', {
      form_id: 'testForm',
      interest_context: 'doptimiser',
    });
    expect(JSON.stringify(vi.mocked(track).mock.calls)).not.toContain(
      'private@example.com',
    );
  });
});
