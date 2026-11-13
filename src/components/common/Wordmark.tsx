import { site } from '../../lib/content';

export function Wordmark() {
  return (
    <span className="whitespace-nowrap">
      <span className="text-black">{site.wordmark.primary}</span>
      <span className="text-nq-red">{site.wordmark.accent}</span>
    </span>
  );
}
