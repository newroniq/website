import { site } from '../../lib/content';

export function Wordmark() {
  return (
    <span role="img" aria-label={site.name} className="whitespace-nowrap">
      <span aria-hidden="true" className="text-black">
        {site.wordmark.primary}
      </span>
      <span aria-hidden="true" className="text-nq-red">
        {site.wordmark.accent}
      </span>
    </span>
  );
}
