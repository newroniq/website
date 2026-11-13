# NEWRONIQ transformation completion report

Date: 12 November 2026. Changes are local; nothing has been pushed or deployed.

## A. Changes made

The existing website now leads with **Enterprise AI Strategy, Architecture & Cloud Advisory** and **From AI Ambition to Enterprise Reality.** The homepage presents the enterprise AI challenge, four advisory engagements, the five-step Transformation Blueprint, technical judgement, target organisations, published insights, secondary product initiatives and consultation CTAs.

Added `/services/`, `/products/`, `/doptimiser/`, `/about/` and `/academy/`. The established `/whitepapers/`, three article URLs, IQPublish, StylePulse, Contact and Privacy routes remain. Existing homepage section anchors remain useful. Academy is a minimal, separate learning-enquiry page because no prior Academy source existed in this checkout; it makes no course or availability claims.

The wordmark, tagline, red/neutral identity, typography, shared components, self-hosted fonts and GitHub Pages architecture remain. DOptimiser is explicitly in development; the other products remain concepts/customer discovery. Article copy and references are preserved. No fabricated customers, outcomes, partnerships, dates, biographies, prices or delivery guarantees were added.

## B. Files changed

The inventory below includes created and modified files. Visual references are listed separately to keep the implementation inventory readable.

| File                                                | Change   | Purpose                                                                               |
| --------------------------------------------------- | -------- | ------------------------------------------------------------------------------------- |
| `.env.example`                                      | Created  | Public integration settings; no secrets or invented form ID.                          |
| `.github/workflows/ci.yml`                          | Modified | Isolated integration checks with all third-party traffic intercepted.                 |
| `.github/workflows/deploy.yml`                      | Modified | Pass public repository variables to the existing Pages build.                         |
| `README.md`                                         | Modified | Current development, architecture, validation and publishing instructions.            |
| `docs/COMMERCIAL-READINESS.md`                      | Modified | Identify prior-version reports and link current guidance.                             |
| `docs/INTEGRATIONS.md`                              | Created  | Exact Tally, notification, consent, dashboard and test setup.                         |
| `docs/TRANSFORMATION.md`                            | Created  | Completion report and file inventory.                                                 |
| `docs/VERIFICATION.md`                              | Modified | Identify prior-version reports and link current guidance.                             |
| `index.html`                                        | Modified | Remove obsolete analytics injection marker.                                           |
| `package-lock.json`                                 | Modified | Official PostHog browser SDK and locked dependency graph.                             |
| `package.json`                                      | Modified | Official PostHog browser SDK and locked dependency graph.                             |
| `scripts/load-public-env.ts`                        | Created  | Match production Vite environment loading during Node prerendering.                   |
| `scripts/prerender.tsx`                             | Modified | Preserve static rendering; generate route-specific structured data.                   |
| `scripts/smoke.ts`                                  | Modified | Verify static links, assets, unique metadata, indexability and JSON-LD.               |
| `scripts/validate-content.ts`                       | Modified | Validate the new advisory/content registry.                                           |
| `src/app/routes.ts`                                 | Modified | Register five additional static public pages.                                         |
| `src/components/analytics/AnalyticsPreferences.tsx` | Created  | Accessible preferences, persistent choices and hydration-safe display.                |
| `src/components/common/ConsultationLink.tsx`        | Created  | Shared consultation links and explicit analytics metadata.                            |
| `src/components/common/ContactForm.tsx`             | Modified | Official Tally iframe, direct fallback and verified success handling.                 |
| `src/components/common/ResearchMetadata.tsx`        | Created  | Reuse optional editorial attribution markup.                                          |
| `src/components/layout/Footer.tsx`                  | Modified | Updated navigation/footer, brand preservation and preference access.                  |
| `src/components/layout/Header.tsx`                  | Modified | Updated navigation/footer, brand preservation and preference access.                  |
| `src/components/sections/Blueprint.tsx`             | Created  | Reuse service, Blueprint, product and research presentation.                          |
| `src/components/sections/Capabilities.tsx`          | Modified | Reuse service, Blueprint, product and research presentation.                          |
| `src/components/sections/InsightCards.tsx`          | Modified | Reuse service, Blueprint, product and research presentation.                          |
| `src/components/sections/ProductCards.tsx`          | Created  | Reuse service, Blueprint, product and research presentation.                          |
| `src/components/sections/ProductPage.tsx`           | Modified | Reuse service, Blueprint, product and research presentation.                          |
| `src/components/sections/ResearchArticle.tsx`       | Modified | Reuse service, Blueprint, product and research presentation.                          |
| `src/components/sections/SectionHeading.tsx`        | Modified | Reuse service, Blueprint, product and research presentation.                          |
| `src/content/advisory.json`                         | Created  | Maintain advisory positioning, product status, enquiries or site copy.                |
| `src/content/home.json`                             | Modified | Maintain advisory positioning, product status, enquiries or site copy.                |
| `src/content/inquiries.json`                        | Modified | Maintain advisory positioning, product status, enquiries or site copy.                |
| `src/content/pages.json`                            | Modified | Maintain advisory positioning, product status, enquiries or site copy.                |
| `src/content/privacy.json`                          | Modified | Maintain advisory positioning, product status, enquiries or site copy.                |
| `src/content/products.json`                         | Modified | Maintain advisory positioning, product status, enquiries or site copy.                |
| `src/content/seo.json`                              | Modified | Maintain advisory positioning, product status, enquiries or site copy.                |
| `src/content/site.json`                             | Modified | Maintain advisory positioning, product status, enquiries or site copy.                |
| `src/lib/analytics.ts`                              | Created  | Central consent-gated SDK, safe event properties and navigation-safe transport.       |
| `src/lib/config.ts`                                 | Created  | Validate public Tally/PostHog configuration and EU host.                              |
| `src/lib/contact.ts`                                | Modified | Keep enquiry links; remove email-draft generation.                                    |
| `src/lib/content/advisory.ts`                       | Created  | Validate the updated content contracts and identifiers.                               |
| `src/lib/content/home.ts`                           | Modified | Validate the updated content contracts and identifiers.                               |
| `src/lib/content/index.ts`                          | Modified | Validate the updated content contracts and identifiers.                               |
| `src/lib/content/inquiries.ts`                      | Modified | Validate the updated content contracts and identifiers.                               |
| `src/lib/content/products.ts`                       | Modified | Validate the updated content contracts and identifiers.                               |
| `src/lib/content/research.ts`                       | Modified | Validate the updated content contracts and identifiers.                               |
| `src/lib/content/schema.ts`                         | Modified | Validate the updated content contracts and identifiers.                               |
| `src/lib/content/seo.ts`                            | Modified | Validate the updated content contracts and identifiers.                               |
| `src/lib/structured-data.ts`                        | Created  | Visible-fact Organization, Service, Article and BreadcrumbList graphs.                |
| `src/lib/tally.ts`                                  | Created  | Allowlisted context links and strict successful-message validation.                   |
| `src/pages/AboutPage.tsx`                           | Created  | Compose advisory, company, Academy, product or enquiry page content.                  |
| `src/pages/AcademyPage.tsx`                         | Created  | Compose advisory, company, Academy, product or enquiry page content.                  |
| `src/pages/AdvisoryPage.tsx`                        | Created  | Compose advisory, company, Academy, product or enquiry page content.                  |
| `src/pages/ContactPage.tsx`                         | Modified | Compose advisory, company, Academy, product or enquiry page content.                  |
| `src/pages/DoptimiserPage.tsx`                      | Created  | Compose advisory, company, Academy, product or enquiry page content.                  |
| `src/pages/HomePage.tsx`                            | Modified | Compose advisory, company, Academy, product or enquiry page content.                  |
| `src/pages/ProductsPage.tsx`                        | Created  | Compose advisory, company, Academy, product or enquiry page content.                  |
| `src/styles/site.css`                               | Modified | Responsive embed, consent panel and consistent focus treatment.                       |
| `src/tests/analytics.test.ts`                       | Created  | Content, metadata, consent, hydration, payload privacy or Tally-boundary regressions. |
| `src/tests/components.test.tsx`                     | Modified | Content, metadata, consent, hydration, payload privacy or Tally-boundary regressions. |
| `src/tests/consent-hydration.test.tsx`              | Created  | Content, metadata, consent, hydration, payload privacy or Tally-boundary regressions. |
| `src/tests/content.test.ts`                         | Modified | Content, metadata, consent, hydration, payload privacy or Tally-boundary regressions. |
| `src/tests/tally.test.tsx`                          | Created  | Content, metadata, consent, hydration, payload privacy or Tally-boundary regressions. |
| `tests/e2e/integrations.spec.ts`                    | Created  | Responsive/accessibility, provider, routing or visual acceptance checks.              |
| `tests/e2e/project-path.spec.ts`                    | Modified | Responsive/accessibility, provider, routing or visual acceptance checks.              |
| `tests/e2e/site.spec.ts`                            | Modified | Responsive/accessibility, provider, routing or visual acceptance checks.              |
| `tests/e2e/visual.spec.ts`                          | Modified | Responsive/accessibility, provider, routing or visual acceptance checks.              |

Visual references updated/created under `tests/fixtures/visual/`: `about.html`, `academy.html`, `contact.html`, `doptimiser.html`, `home.html`, `iqpublish.html`, `paper_aec.html`, `paper_java.html`, `paper_retail.html`, `privacy.html`, `products.html`, `services.html`, `stylepulse.html`, `styles.css`, `whitepapers.html`. Reviewed desktop and mobile screenshots before accepting intentional reference changes; existing tolerances remain unchanged.

## C. Tally

The old email-draft submission workflow is removed. A configured standard Tally iframe and persistent direct form link replace it. `info@newroniq.com` remains visible. The embed receives only allowlisted context and a matching label; arbitrary page parameters and form answers are not forwarded by the host application.

Set `VITE_PUBLIC_TALLY_FORM_ID` to a real published ID and rebuild. Without it, the page honestly offers email instead of a fake form. The exact five fields, nine dropdown options, hidden-field prefill, privacy guidance, confirmation text and notification steps are in [INTEGRATIONS.md](INTEGRATIONS.md).

Success requires the documented submitted event from the configured iframe and form. Invalid origins, unrelated windows, wrong forms, malformed messages and repeated submission IDs are rejected. The host never reads answer fields for analytics. Free self-notifications must be enabled in the real Tally account; the default recipient is the form creator.

Verified locally: context mapping, fallback rendering, sender validation, simulated confirmed success independent of analytics, false-success rejection and deduplication. **Real submissions reaching Tally and notification email delivery remain untested without the live form/account.**

## D. PostHog

Public settings are `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com`. The official SDK is lazy-loaded only in configured production builds after acceptance. Autocapture, recordings, automatic pageviews/pageleave, identified profiles and unrelated optional features are disabled. No identify call is made. An anonymous consented browser identifier is still personal data for privacy considerations.

The footer preferences control supports acceptance, rejection, withdrawal and cross-tab changes. Versioned preference storage tolerates failure. Rejection prevents optional events and leaves Tally usable. Pageviews are emitted once per document. Explicit conversion events use immediate beacon transport so navigation does not discard them. Payload filtering removes answers, names, emails, organisations, arbitrary properties, query strings and referrers.

Events: `$pageview`, `cta_clicked`, `contact_started`, `product_interest_clicked`, `lead_form_submitted`. `contact_started` measures deliberate enquiry-link activation, not Contact page loading or inferred typing. Submission interest is entry context, not the final dropdown answer. Rejected or pre-consent submissions are not replayed. Tally is authoritative for all enquiries.

Verified the actual SDK with fake public identifiers and intercepted provider requests, including product CTA events across real document navigation. **No live PostHog project was configured or sent events.** Dashboard and funnel setup is documented in [INTEGRATIONS.md](INTEGRATIONS.md); it is not claimed as created.

## E. SEO / GEO / AEO

All 14 legitimate public pages and the 404 are built as static HTML. Route-specific titles, descriptions, canonical URLs, Open Graph and social metadata are available without JavaScript. Sitemap and robots output follow the deployment base; public pages remain indexable and the 404 remains noindex.

JSON-LD now includes the existing verified Organization facts, four visible advisory Services, published Articles and meaningful BreadcrumbLists. Optional author/date fields are omitted when unapproved. Local checks parse every emitted JSON-LD graph, verify expected types and test visible content alignment; no external rich-result certification is claimed.

Advisory content explains problems, intended audiences, approach, outputs, trade-offs, engagement and practical answers to six decision questions. The company specialisation and UK positioning are consistent. No book announcement, invented authority signals, duplicate Insights route, speculative `llms.txt` or FAQ visibility promise was introduced.

## F. Quality checks

| Check                                              | Result                                                                          |
| -------------------------------------------------- | ------------------------------------------------------------------------------- |
| ESLint                                             | Passed                                                                          |
| TypeScript                                         | Passed                                                                          |
| Prettier check                                     | Passed                                                                          |
| Zod content validation                             | Passed: 4 advisory services, 3 products, 9 enquiry categories, 3 articles       |
| Unit/component tests                               | 31 passed across 5 files                                                        |
| Root production build and static smoke             | Passed: 14 public routes and 404                                                |
| Browser suite                                      | 195 passed across 320, 375, 390, 768 and 1440px; includes 70 visual comparisons |
| Isolated real-SDK/provider-boundary browser checks | 3 passed; all third-party requests intercepted; no live submissions             |
| Project Pages `/website/` build and smoke          | Passed                                                                          |
| Project Pages browser checks                       | 5 passed across all viewports                                                   |
| GitHub Actions actionlint                          | Passed                                                                          |
| Whitespace/diff checks                             | Passed                                                                          |

The normal suite skips the separate integration fixture tests unless `TEST_INTEGRATIONS=1`; CI explicitly builds a fake fixture and runs those checks with intercepted traffic. Browser checks cover static refresh/404s, navigation, product context, no unexpected requests, keyboard operation, JavaScript-disabled content and axe WCAG A/AA rules. They supplement human accessibility review and do not certify all accessibility requirements.

Lighthouse 13.6.0 mobile lab audits against the local production build:

| Page        | Performance | Accessibility | Best Practices | SEO |
| ----------- | ----------: | ------------: | -------------: | --: |
| Home        |         100 |           100 |            100 | 100 |
| AI Advisory |         100 |           100 |            100 | 100 |
| Contact     |         100 |           100 |            100 | 100 |

These are actual local lab results with live integrations unconfigured, not deployed-site scores or field Core Web Vitals. Configuring Tally and accepting analytics changes third-party loading and must be reviewed on the live configuration. Raw audit JSON is retained locally under `.cache/transformation-lighthouse-{home,services,contact}.json`.

## G. Remaining manual actions

1. Create/publish or supply the real Tally form; configure fields, prefill, confirmation and free self-notifications. Verify actual submission storage and notification receipt, then delete test data.
2. Supply the PostHog EU public project key; review IP discard, retention and access settings, then create the documented dashboard and verify accepted/rejected/withdrawn consent against the real project.
3. Confirm processor/email account ownership, recipient access, international-processing arrangements, retention criteria and the deletion workflow. Review the privacy notice against those actual arrangements and the configured embed's real network/storage behaviour.
4. Add the public repository build variables, review the change and publish when ready. No secret credentials belong in the repository or browser settings.

No live enquiry, email-notification or dashboard delivery is claimed before those account steps are completed.

## H. Deployment

Keep the existing custom domain and Pages workflow. Set the three public repository Actions variables, finish the manual integration checks and review the local changes. With owner approval, merge to `master`; the existing workflow validates, builds and publishes `dist/` through official Pages actions. Do not publish the repository root. Confirm HTTPS, routes, metadata and the real enquiry/consent journeys after publication. Detailed commands are in [README.md](../README.md).

The workspace is restored to the normal custom-domain production build, without fake integration identifiers. No push, merge or deployment was performed.
