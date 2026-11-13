import { describe, expect, it } from 'vitest';
import {
  elementContent,
  escapeHtml,
  serializeJsonLd,
  textContent,
} from '../../scripts/html';

describe('static HTML handling', () => {
  it('escapes attribute delimiters without double-escaping newly introduced entities', () => {
    expect(escapeHtml(`A & B < "quoted" > 'value'`)).toBe(
      'A &amp; B &lt; &quot;quoted&quot; &gt; &#39;value&#39;',
    );
  });
  it('round-trips JSON-LD with script-closing content without exposing an HTML delimiter', () => {
    const value = {
      headline: '</script><script>alert("example")</script>',
      note: String.raw`C:\documents`,
    };
    const json = serializeJsonLd(value);
    expect(json).not.toContain('<');
    expect(json).toContain(String.raw`\u003c/script>`);
    expect(JSON.parse(json)).toEqual(value);
  });
  it('extracts complete generated elements and rejects missing delimiters', () => {
    expect(
      elementContent(
        '<footer class="x"><p>Brand</p></footer>',
        /<footer\b[^<>]*>/,
        '</footer>',
      ),
    ).toBe('<p>Brand</p>');
    expect(
      elementContent('<footer>missing end', /<footer>/, '</footer>'),
    ).toBeUndefined();
    expect(
      elementContent('no element', /<footer>/, '</footer>'),
    ).toBeUndefined();
  });
  it('extracts visible heading text including React comment boundaries', () => {
    expect(
      textContent(
        'From AI Ambition to<!-- --> <span class="red">Enterprise Reality.</span>',
      ),
    ).toBe('From AI Ambition to Enterprise Reality.');
  });
  it('handles long malformed tag sequences without matching across nested openings', () => {
    const input = '<'.repeat(100000) + '<span>Visible</span>';
    expect(textContent(input)).toBe('<'.repeat(100000) + 'Visible');
  });
});
