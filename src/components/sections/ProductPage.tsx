import { products, type ProductId } from '../../lib/content/products';
import { contactHref } from '../../lib/contact';
import { url } from '../../lib/urls';
export function ProductPage({ id }: { id: ProductId }) {
  const product = products.products.find((item) => item.id === id)!;
  return (
    <main id="main-content">
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="section-shell">
          <a href={url('/#products')} className="text-link inline-block mb-10">
            ← {products.backLabel}
          </a>
          <div className="grid lg:grid-cols-3 gap-10 lg:gap-16">
            <div className="lg:col-span-2">
              <p className="eyebrow mb-4">{products.eyebrow}</p>
              <h1 className="hero-title">{product.name}</h1>
              <p className="text-2xl font-semibold leading-snug mt-6 mb-5">
                {product.summary}
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                {product.description}
              </p>
              <a className="button-primary mt-7" href={contactHref(product.id)}>
                {product.interestAction}
              </a>
            </div>
            <aside className="bg-gray-50 p-6 border-t-4 border-nq-red self-start">
              <h2 className="text-xl font-bold mb-4">{products.status}</h2>
              <p className="text-gray-600 leading-relaxed text-sm">
                {products.statusDescription}
              </p>
            </aside>
          </div>
          <div className="max-w-3xl mt-14">
            <h2 className="section-title text-2xl">{products.problemLabel}</h2>
            <p className="text-lg text-gray-600 leading-relaxed mt-4">
              {product.problem}
            </p>
          </div>
        </div>
      </section>
      <section className="section-space bg-gray-50 border-y border-gray-100">
        <div className="section-shell">
          <h2 className="section-title mb-10">{products.directionLabel}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {product.directions.map((item) => (
              <div key={item.title}>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section-space">
        <div className="section-shell">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            <div>
              <h2 className="section-title">{product.interestTitle}</h2>
              <p className="text-lg text-gray-600 leading-relaxed mt-5 mb-7">
                {product.interestDescription}
              </p>
              <a className="button-primary" href={contactHref(product.id)}>
                {product.interestAction}
              </a>
            </div>
            <div className="border-l-2 border-gray-200 pl-6">
              <h2 className="text-xl font-bold mb-3">
                {products.boundaryTitle}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {products.boundaryDescription}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
