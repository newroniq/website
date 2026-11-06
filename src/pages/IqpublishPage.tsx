import { links } from '../lib/content/links';
import { copy } from '../lib/content';
import { url } from '../lib/urls';
export function IqpublishPage() {
  return (
    <main id="main-content" className="">
      <section className="pt-40 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <a
            href={url(links.iqpublish.home)}
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
            {copy.iqpublish.back_to_overview_2}
          </a>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <div className="order-2 lg:order-1 bg-gray-100 aspect-square rounded-sm flex items-center justify-center border border-gray-200">
              <span className="text-gray-400 font-bold uppercase tracking-tighter text-4xl">
                {copy.iqpublish.enterprise_portal}
              </span>
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-nq-red font-bold uppercase tracking-widest text-sm mb-4">
                {copy.iqpublish.enterprise_content_platform}
              </p>
              <h1 className="text-5xl font-extrabold mb-6">
                {copy.iqpublish.iqpublish}
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {
                  copy.iqpublish
                    .engineered_for_organizations_that_treat_content_as_critical_data_
                }
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 border-t-2 border-nq-red">
                  <span className="block font-bold text-nq-red italic">
                    {copy.iqpublish.cost_optimization}
                  </span>
                  <span className="text-[10px] uppercase text-gray-400">
                    {copy.iqpublish.streamlined_workflows}
                  </span>
                </div>
                <div className="p-4 bg-gray-50 border-t-2 border-nq-red">
                  <span className="block font-bold text-nq-red italic">
                    {copy.iqpublish.risk_mitigation}
                  </span>
                  <span className="text-[10px] uppercase text-gray-400">
                    {copy.iqpublish.audit_compliance}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-12 rounded-sm border border-gray-200">
            <h2 className="text-2xl font-bold mb-8">
              {copy.iqpublish.system_capabilities}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
              <div>
                <h3 className="font-bold mb-2">
                  {copy.iqpublish.content_hierarchy_management}
                </h3>
                <p className="text-sm text-gray-500">
                  {
                    copy.iqpublish
                      .advanced_nesting_and_categorization_modeled_after_financial_ratin
                  }
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">
                  {copy.iqpublish.automated_distribution}
                </h3>
                <p className="text-sm text-gray-500">
                  {
                    copy.iqpublish
                      .push_once_publish_anywhere_logic_ensuring_consistency_across_web_
                  }
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">
                  {copy.iqpublish.immutable_traceability}
                </h3>
                <p className="text-sm text-gray-500">
                  {
                    copy.iqpublish
                      .full_version_history_and_authorship_tracking_required_for_enterpr
                  }
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">
                  {copy.iqpublish.massive_scale_api}
                </h3>
                <p className="text-sm text-gray-500">
                  {
                    copy.iqpublish
                      .built_to_serve_millions_of_requests_with_sub_millisecond_latency_
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="mt-20 text-center">
            <h2 className="text-2xl font-bold mb-4">
              {copy.iqpublish.deploy_iqpublish_for_your_institution}
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              {
                copy.iqpublish
                  .ensure_your_content_supply_chain_is_compliant_resilient_and_optim
              }
            </p>
            <a
              href={url(links.iqpublish.contact)}
              className="inline-block bg-nq-red text-white px-8 py-3 font-bold uppercase text-xs rounded-sm hover:opacity-90 transition-all"
            >
              {copy.iqpublish.request_system_spec}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
