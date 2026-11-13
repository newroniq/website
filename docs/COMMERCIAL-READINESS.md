> Historical report for the previous website. For current integration setup and verification, see [INTEGRATIONS.md](INTEGRATIONS.md) and [TRANSFORMATION.md](TRANSFORMATION.md).

# Commercial readiness and verification

Reviewed locally on 6 November 2026. This report covers the consultancy-focused refinement, rather than the original HTML migration. Changes remain in the workspace; nothing has been pushed, merged or deployed.

## What changed

The homepage now explains the consultancy offering first: a concise business-value proposition, three business outcomes, four service areas, Why NEWRONIQ, Discover → Architect → Deliver → Optimise, selected insights and a final contact invitation. Product initiatives remain discoverable but secondary. Deep red, Inter, the text wordmark and the existing public product/article URLs are retained.

StylePulse and IQPublish describe intended problems and value without claiming validated accuracy, guaranteed performance, live deployments or generally available products. Each has prominent interest links that carry its inquiry category into contact. The explicit seven-choice inquiry registry includes services, both products and General Inquiry.

Contact uses the central `info@newroniq.com` value. Name and business email are required; organisation and message are optional. The form prepares an encoded email draft with the selected subject and identifiable details. Visitors must send it themselves. There is no server submission, false success confirmation, browser-storage capture or personal information in contact-page query parameters.

The footer includes verified company details and a new privacy page. GTM is disabled and schema validation prevents accidental activation. Inter is self-hosted, avoiding runtime font requests to Google. Existing articles retain their URLs and gain practical trade-offs, authoritative references and a business contact invitation. Unverified authors and publication dates are omitted.

## Architecture and repository changes

- **Content and validation:** updated site, home, contact, research and SEO JSON; added product, inquiry and privacy JSON with strict Zod schemas. Removed the unused legacy link registry. Business copy remains separate from React presentation.
- **Presentation and behaviour:** updated shared navigation/footer, service cards, contact form and page compositions; added shared section headings, insight cards, product template and privacy page. Contextual URL and RFC 6068 draft generation live in `src/lib/contact.ts`.
- **Static delivery:** registered the ninth public route, retained build-time HTML rendering, enhanced Organization metadata and disabled tracking output. Static serving supports WOFF2; smoke checks understand inquiry query strings and inspect links, anchors, assets and metadata.
- **Quality and documentation:** expanded component/content and browser tests, added 320px and 375px projects, reviewed intentional visual changes and updated fixed reference fixtures. Updated README and this report. Aligned Node engine requirements with locked tooling; no new runtime dependency was added.
- **Preserved configuration:** GitHub Actions workflows, root/public CNAME and historical Jekyll configuration are unchanged by this refinement. Generated `dist/` and local audit/screenshot artifacts remain ignored.

## Verification results

The final completion pass ran these checks successfully:

| Check                             | Result                                                                                      |
| --------------------------------- | ------------------------------------------------------------------------------------------- |
| `npm run format:check`            | Passed                                                                                      |
| `npm run lint`                    | Passed                                                                                      |
| `npm run typecheck`               | Passed                                                                                      |
| `npm run validate:content`        | Passed: four capabilities, seven inquiries, two products, three insights, nine public pages |
| `npm test`                        | 12 tests passed across two files                                                            |
| `npm run build`                   | Nine public HTML pages plus 404 generated for `https://www.newroniq.com/`                   |
| `npm run test:smoke`              | Static links, anchors, metadata and fingerprinted assets passed                             |
| Project Pages browser checks      | Five tests passed against the `/website/` build, one per viewport                           |
| Full default-domain browser suite | 130 tests passed in 21.1 seconds                                                            |

The browser suite covers 320, 375, 390, 768 and 1440px widths. It checks direct access and refresh, all nine routes, real 404 responses, local assets/fonts, horizontal overflow, console errors, unexpected external requests, keyboard navigation, service/product inquiry context, native required fields, encoded draft contents, privacy/disclosures and primary content without JavaScript. Axe checks WCAG A/AA rules. This includes 45 visual comparisons against fixed HTML/CSS references, with identical dimensions and the existing 0.2% changed-pixel allowance; no regions are masked.

Representative desktop/mobile home, tablet contact and mobile/desktop product screenshots were visually reviewed before accepting intentional reference changes. Automated captures cover every page/viewport; this does not mean every capture received a separate human review. Local review captures are under `.cache/commercial-review/`; browser-run artifacts are under `test-results/` and are not published.

The project-path build and smoke check passed during the refinement; its interrupted browser result was replaced by the successful five-test completion run. The final build has been restored to the custom domain. Local tooling used Node 25.2.1; CI remains configured for Node 24 LTS. The first sandboxed browser attempt could not bind a local port; the authorized run outside the sandbox passed. npm emitted an environment-level `min-release-age` warning without failing checks.

Fresh Lighthouse 13.6.0 simulated-mobile audits against the production static server produced these results:

| Page     | Performance | Accessibility | Best Practices | SEO |
| -------- | ----------- | ------------- | -------------- | --- |
| Homepage | 100         | 100           | 100            | 100 |
| Contact  | 100         | 100           | 100            | 100 |

Raw reports are ignored local artifacts at `.cache/commercial-lighthouse-home.json` and `.cache/commercial-lighthouse-contact.json`. Lighthouse still identifies opportunities around unused JavaScript, render-blocking resources and cache/compression behaviour of the minimal local server. GitHub Pages controls production response headers; these local scores do not establish deployed caching behaviour, field Core Web Vitals or a performance guarantee. Workflow syntax also passed the available `actionlint` check; remote Actions execution remains unverified.

## Sources and evidence boundaries

- [Companies House company record](https://find-and-update.company-information.service.gov.uk/company/17181252): NEWRONIQ LTD, company number 17181252 and registered office 11 Crusader Gardens, Croydon, England, CR0 5UJ, checked during this refinement.
- [HMRC company-number guidance](https://www.gov.uk/hmrc-internal-manuals/cotax-manual/com100): the eight-digit number supports the England and Wales registration description.
- [Government company disclosure guidance](https://www.gov.uk/running-a-limited-company/signs-stationery-and-promotional-material): website company-name, number, office and registration-location requirements.
- [ICO right-to-be-informed guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/individual-rights/right-to-be-informed/) and [storage/access technology guidance](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/): privacy review and tracking controls. The notice is not a legal-compliance certification.
- [GitHub privacy statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement): hosting provider context.
- [Microsoft Strangler Fig](https://learn.microsoft.com/en-us/azure/architecture/patterns/strangler-fig), [Microsoft Retry](https://learn.microsoft.com/en-us/azure/architecture/patterns/retry) and [OWASP Excessive Agency](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/): supporting article references, rather than evidence of NEWRONIQ client delivery.
- [RFC 6068](https://www.rfc-editor.org/rfc/rfc6068): mailto encoding. The Inter licence is included in `public/fonts/OFL.txt`.

## Remaining owner review and manual checks

1. Confirm the mailbox provider, actual enquiry retention criteria, recipient categories, international-transfer arrangements and applicable lawful bases; update the privacy notice to match actual practices before publication. Confirm VAT and other business-specific disclosures where applicable.
2. Verify `info@newroniq.com` receives mail. Test draft handoff and delivery in real desktop/mobile email clients. Automated tests inspect drafts; they do not send personal information or prove delivery.
3. Reliable direct submission remains an integration dependency if required. There is no approved endpoint, and product interest is received only when the visitor sends the prepared email. Do not interpret CTA clicks as registrations.
4. Review the GTM container and applicable consent/objection controls before introducing tracking. Retaining an identifier does not enable analytics.
5. Perform assistive-technology and Safari/Firefox review. Automated Chromium/axe checks do not establish complete WCAG 2.2 AA conformance. No new remote CI run, live DNS/TLS audit or deployed-site validation was performed in this completion pass.

## Publication handoff

Follow the README deployment instructions: review the changes and owner checks, retain GitHub Actions as the Pages publishing source and `www.newroniq.com` as the custom domain, then merge to `master` only with approval. The existing workflow validates and uploads `dist/` using official Pages actions. Never publish the repository root: it contains the Vite source shell and can produce a blank website. After an approved deployment, check all public routes, assets, privacy disclosures and both interest journeys on the actual domain.
