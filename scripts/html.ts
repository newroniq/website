/** Escape text for HTML attributes or text content, with ampersands handled first. */
export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/** Prevent a JSON-LD value from terminating its containing script element. */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replaceAll('<', String.raw`\u003c`);
}

/** Extract a generated element without an unbounded, backtracking body regex. */
export function elementContent(
  html: string,
  opening: RegExp,
  closing: string,
): string | undefined {
  const start = opening.exec(html);
  if (!start) return undefined;
  const from = start.index + start[0].length;
  const end = html.indexOf(closing, from);
  return end === -1 ? undefined : html.slice(from, end);
}

export function textContent(markup: string): string {
  // Excluding both angle brackets prevents repeated scans of nested opening brackets.
  return markup.replaceAll(/<[^<>]*>/g, '');
}
