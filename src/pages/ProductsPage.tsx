import { home } from '../lib/content/home';
import { ProductCards } from '../components/sections/ProductCards';
export function ProductsPage() {
  return (
    <main id="main-content">
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="section-shell">
          <p className="eyebrow mb-4">Secondary to our advisory work</p>
          <h1 className="hero-title mb-6">NEWRONIQ Product Initiatives</h1>
          <p className="text-lg text-gray-600 max-w-3xl mb-12">
            {home.products.description} These initiatives are not generally
            available products.
          </p>
          <ProductCards headingLevel={2} />
        </div>
      </section>
    </main>
  );
}
