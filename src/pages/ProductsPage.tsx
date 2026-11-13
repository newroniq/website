import { home } from '../lib/content/home';
import { ProductCards } from '../components/sections/ProductCards';
export function ProductsPage() {
  return (
    <main id="main-content">
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-white">
        <div className="section-shell">
          <p className="eyebrow mb-4">Secondary to our advisory work</p>
          <h1 className="hero-title mb-6">Product Initiatives</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            {home.products.description} These initiatives are not generally
            available products.
          </p>
        </div>
      </section>
      <section
        aria-label="Product initiatives"
        className="section-space bg-gray-50 border-y border-gray-100"
      >
        <div className="section-shell">
          <ProductCards headingLevel={2} />
        </div>
      </section>
    </main>
  );
}
