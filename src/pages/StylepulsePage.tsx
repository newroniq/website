import { links } from '../lib/content/links';
import { copy } from '../lib/content';
import { url } from '../lib/urls';
export function StylepulsePage() {
  return (
    <main id="main-content" className="">
      <section className="pt-40 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <a
            href={url(links.stylepulse.home)}
            className="inline-block text-gray-400 hover:text-nq-red flex items-center gap-2 mb-12 uppercase text-xs font-bold tracking-widest"
          >
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              className="w-4 h-4"
              aria-hidden="true"
              focusable="false"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            {copy.stylepulse.back_to_overview}
          </a>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <p className="text-nq-red font-bold uppercase tracking-widest text-sm mb-4">
                {copy.stylepulse.product_deep_dive}
              </p>
              <h1 className="text-5xl font-extrabold mb-6">
                {copy.stylepulse.stylepulse}
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {
                  copy.stylepulse
                    .the_definitive_trend_insight_engine_for_the_fashion_industry_styl
                }
              </p>
              <div className="flex items-center gap-6 p-6 bg-gray-50 border-l-4 border-nq-red">
                <div>
                  <span className="block text-2xl font-bold text-nq-red">
                    {copy.stylepulse.revenue_boost}
                  </span>
                  <span className="text-xs uppercase font-bold text-gray-400">
                    {copy.stylepulse.primary_outcome}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {
                    copy.stylepulse
                      .reduces_markdown_frequency_by_aligning_production_cycles_with_val
                  }
                </p>
              </div>
            </div>
            <div className="bg-gray-100 aspect-video rounded-sm flex items-center justify-center border border-gray-200 relative overflow-hidden">
              <div
                style={{
                  backgroundImage:
                    'radial-gradient(\n                    #a12027 1px,\n                    transparent 1px\n                  )',
                  backgroundSize: '20px 20px',
                }}
                className="absolute inset-0 opacity-10"
              ></div>
              <span className="text-gray-400 font-bold uppercase tracking-tighter text-4xl">
                {copy.stylepulse.visual_dashboard}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border border-gray-100 rounded-sm">
              <h2 className="font-bold text-lg mb-4 text-nq-red">
                {copy.stylepulse.predictive_inventory}
              </h2>
              <p className="text-sm text-gray-500">
                {
                  copy.stylepulse
                    .ai_driven_forecasting_that_suggests_optimal_stock_levels_per_sku_
                }
              </p>
            </div>
            <div className="p-8 border border-gray-100 rounded-sm">
              <h2 className="font-bold text-lg mb-4 text-nq-red">
                {copy.stylepulse.sentiment_mapping}
              </h2>
              <p className="text-sm text-gray-500">
                {
                  copy.stylepulse
                    .real_time_processing_of_social_signals_and_runway_data_to_identif
                }
              </p>
            </div>
            <div className="p-8 border border-gray-100 rounded-sm">
              <h2 className="font-bold text-lg mb-4 text-nq-red">
                {copy.stylepulse.trend_velocity}
              </h2>
              <p className="text-sm text-gray-500">
                {
                  copy.stylepulse
                    .mathematical_modeling_of_how_fast_a_trend_is_growing_and_where_it
                }
              </p>
            </div>
          </div>
          <div className="mt-20 p-12 bg-gray-50 border-t border-gray-200 text-center">
            <h2 className="text-2xl font-bold mb-4">
              {copy.stylepulse.request_a_stylepulse_demo}
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              {
                copy.stylepulse
                  .see_how_predictive_trend_insights_can_transform_your_fashion_reta
              }
            </p>
            <a
              href={url(links.stylepulse.contact)}
              className="inline-block bg-nq-red text-white px-8 py-3 font-bold uppercase text-xs rounded-sm hover:opacity-90 transition-all"
            >
              {copy.stylepulse.schedule_consultation}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
