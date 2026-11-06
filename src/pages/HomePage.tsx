import { links } from '../lib/content/links';
import { home } from '../lib/content/home';
import { FocusAreas, Capabilities } from '../components/sections/Capabilities';
import { copy } from '../lib/content';
import { url } from '../lib/urls';
export function HomePage() {
  return (
    <main id="main-content" className="">
      <section className="pt-40 pb-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl">
            <p className="text-sm md:text-base font-bold uppercase tracking-[0.22em] text-nq-red mb-4">
              {copy.home.think_bold_build_reality}
            </p>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              {copy.home.turning_complex_challenges_into}{' '}
              <span className="text-nq-red">
                {copy.home.powerful_technology}
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              {
                copy.home
                  .we_help_businesses_turn_ambitious_ideas_into_secure_scalable_solu
              }
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={url(links.home.contact)}
                className="inline-block bg-nq-red text-white px-8 py-4 font-bold uppercase text-sm rounded-sm hover:opacity-90 transition-all"
              >
                {copy.home.discuss_your_challenge}
              </a>
              <a
                href={url(links.home.services)}
                className="inline-block bg-white border border-gray-200 px-8 py-4 font-bold uppercase text-sm rounded-sm hover:border-nq-red transition-all"
              >
                {copy.home.explore_our_capabilities}
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <p className="text-nq-red font-bold uppercase tracking-widest text-sm mb-4">
                {copy.home.what_drives_us}
              </p>
              <h2 className="text-4xl font-extrabold">
                {copy.home.innovation_with_purpose}
                <br />
                <span className="text-nq-red">
                  {copy.home.engineering_with_precision}
                </span>
              </h2>
            </div>
          </div>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            {
              copy.home
                .we_believe_technology_should_create_measurable_business_value_not
            }
          </p>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            {copy.home.our_work_is_guided_by_these_principles}
          </p>
          <FocusAreas items={home.focus} />
        </div>
      </section>
      <section
        id="services"
        className="scroll-mt-24 py-24 bg-white border-t border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <p className="text-nq-red font-bold uppercase tracking-widest text-sm mb-4">
                {copy.home.what_we_do}
              </p>
              <h2 className="text-4xl font-extrabold">
                {copy.home.from_strategy_to_execution}
              </h2>
            </div>
          </div>
          <Capabilities items={home.capabilities} />
        </div>
      </section>
      <section className="py-24 bg-nq-red text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-extrabold mb-6 uppercase tracking-tight">
            {copy.home.let_s_build_something_that_matters}
          </h2>
          <p className="text-xl mb-10 opacity-90">
            {
              copy.home
                .have_a_complex_technology_challenge_a_product_idea_or_a_platform_
            }
          </p>
          <a
            href={url(links.home.contact)}
            className="inline-block bg-white text-nq-red px-10 py-4 font-bold uppercase text-sm rounded-sm hover:bg-gray-100 transition-all shadow-xl"
          >
            {copy.home.start_a_conversation}
          </a>
        </div>
      </section>
    </main>
  );
}
