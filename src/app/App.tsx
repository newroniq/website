import { routes } from './routes';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { site } from '../lib/content';
import { url } from '../lib/urls';
export function App({ path }: { path: string }) {
  const route = routes.find((route) => route.path === path);
  return (
    <>
      <Header />
      {route ? (
        route.article ? (
          <main id="main-content">
            <section className="pt-40 pb-24">
              <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <a
                  href={url('/whitepapers/')}
                  className="text-gray-400 hover:text-nq-red flex items-center gap-2 mb-12 uppercase text-xs font-bold tracking-widest"
                >
                  ← {site.backToPapers}
                </a>
                <article className="prose prose-lg max-w-none">
                  <route.Component />
                </article>
              </div>
            </section>
          </main>
        ) : (
          <route.Component />
        )
      ) : (
        <main id="main-content" className="pt-40 pb-24 max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6">{site.notFound.title}</h1>
          <p>{site.notFound.description}</p>
          <a href={url('/')} className="text-nq-red underline">
            {site.notFound.homeLabel}
          </a>
        </main>
      )}
      <Footer />
    </>
  );
}
