import { products } from '../../lib/content/products';
import { url } from '../../lib/urls';
export function ProductCards({
  headingLevel = 3,
}: Readonly<{ headingLevel?: 2 | 3 }>) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <div className="grid md:grid-cols-3 gap-7">
      {products.products.map((product) => (
        <article key={product.id} className="border-l-2 border-gray-300 pl-5">
          <p className="eyebrow text-xs mb-3">{product.status}</p>
          <Heading className="text-xl font-bold mb-2">{product.name}</Heading>
          <p className="text-gray-600 mb-4">{product.summary}</p>
          <a className="text-link" href={url(`/${product.id}/`)}>
            Explore {product.name}
            <span aria-hidden="true"> →</span>
          </a>
        </article>
      ))}
    </div>
  );
}
