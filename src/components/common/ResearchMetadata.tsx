import type { Paper } from '../../lib/content/research';
export function ResearchMetadata({
  author,
  publishedOn,
  className,
}: Pick<Paper, 'author' | 'publishedOn'> & { className?: string }) {
  if (!author && !publishedOn) return null;
  return (
    <p className={className}>
      {author}
      {author && publishedOn ? ' · ' : ''}
      {publishedOn && <time dateTime={publishedOn}>{publishedOn}</time>}
    </p>
  );
}
