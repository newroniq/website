# NEWRONIQ website

NEWRONIQ LTD’s engineering-led consultancy website: enterprise architecture, cloud software, practical AI and digital experience engineering. Consulting is the primary offering; StylePulse and IQPublish are secondary product initiatives seeking expressions of interest.

The application uses React, strict TypeScript and Vite. Every public page is pre-rendered as a static HTML document and hydrated for navigation and form behaviour. Deploy only `dist/` to GitHub Pages. No application server, API, database or SPA rewrite is required.

## Local development

Use Node **24 LTS** and npm. Dependencies are locked in `package-lock.json`.

```sh
npm ci
npm run dev
```

For the production build:

```sh
npm run build
npm run preview
```

Vite preview may use an HTML fallback. For exact static routing and 404 behaviour, run `node --import tsx scripts/serve-static.ts` after building, then visit `http://127.0.0.1:4173/`.

## Architecture and content

- `src/app/` defines the shared shell and explicit public routes. Native links preserve history, direct access and refresh on static hosting.
- `src/components/` contains the shared header/footer, contact form, service grid, insight cards, product template and section headings.
- `src/pages/` composes page layouts. Existing product and article routes are retained; `/privacy/` is also pre-rendered.
- `src/content/` owns business copy and metadata. `src/lib/content/` parses it with Zod; invalid content fails the build.
- `src/lib/contact.ts` creates contextual contact URLs and encoded email drafts from a validated inquiry registry.
- `src/styles/` retains the deep-red/neutral palette and locally compiled Tailwind utilities with shared typography, buttons, cards and form styles. Inter is self-hosted under `public/fonts/`, including its OFL licence.
- `scripts/` validates content, pre-renders documents, checks static links/assets and serves the production files for browser tests.

| Content file     | Edit here                                                                                                               |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `site.json`      | Brand, official email, navigation/footer, verified company disclosures, form labels and tracking settings               |
| `home.json`      | Hero, outcomes, services, About/Why NEWRONIQ, engagement approach, insights introduction, product summary and final CTA |
| `inquiries.json` | Seven inquiry choices, stable IDs, categories, product names and email subjects                                         |
| `products.json`  | Product concepts, intended value, current status and interest CTAs                                                      |
| `research.json`  | Insight cards, complete article introductions/sections, source references and optional verified attribution             |
| `privacy.json`   | Privacy notice and its review date; confirm actual business practices before publication                                |
| `pages.json`     | Contact page copy                                                                                                       |
| `seo.json`       | Unique titles/descriptions, reused for Open Graph and Twitter metadata                                                  |

Paths in this table are relative to `src/content/`. Edit JSON, then run content validation and a production build. Do not put HTML into content strings: React renders them as text. Editorial ordering follows array order. Service titles come from the inquiry registry, so card headings and contact choices stay aligned.

To add a structurally new section, define its content/schema and compose a small semantic component using existing styles. To add a page, register its trailing-slash route and metadata/schema, add appropriate navigation and browser coverage. The static renderer and sitemap discover registered routes automatically. New inquiry types must have a unique validated ID and explicit subject; update the ID schema when deliberately expanding the registry.

Insight authors and publication dates are optional. Add them only when verified; Git commit dates are not treated as publication dates. Supporting links should point to authoritative publishers. Existing `/whitepapers/` URLs remain supported while the presentation uses “Insights”.

The shared wordmark uses `site.json`’s `wordmark` segments: NEWRON in black and IQ in deep red (`#A12027`). The browser favicon is an IQ monogram on white in `public/favicon.svg`; its lettering uses vector paths without a font dependency. Vite inserts the configured favicon in both development and production HTML with the deployment base path.

## Contact and product interest

The official email is configured once as **info@newroniq.com**. Visible contact links, form recipient, footer, privacy contact and Organization structured data use that value.

There is **no approved direct-submission endpoint**. The form prepares a local email draft; the visitor must review and send it in their email application. The interface never claims submission or registration on a server. Name and business email are required; organisation and message are optional. Form entries are not placed in page URLs or saved to browser storage.

Examples:

```text
/contact/?inquiry=stylepulse
/contact/?inquiry=iqpublish
/contact/?inquiry=architecture
```

Only registered inquiry IDs are accepted; unknown values safely select General Inquiry. Product selections show specific context, survive refresh via the URL, and produce subjects such as `Product Interest — StylePulse`. Query parameters contain the inquiry category only, not personal information. Without JavaScript, visitors can choose the inquiry manually or use the visible email address and native mailto fallback.

Email-client configuration, supported draft length and actual delivery are outside the website’s control. Test the `info@newroniq.com` mailbox and a real mail-client handoff before publication. A reliable approved submission integration remains an optional future dependency; do not add credentials, paid providers or false success states.

## Privacy and company disclosures

The footer uses NEWRONIQ LTD’s public [Companies House record](https://find-and-update.company-information.service.gov.uk/company/17181252): company number **17181252**, registered in England and Wales, registered office **11 Crusader Gardens, Croydon, England, CR0 5UJ**. Recheck the register if the company changes its details. Confirm whether a VAT disclosure or any other business-specific disclosure applies; none has been invented.

GTM’s identifier is retained, but **analytics is disabled** and no GTM script or noscript iframe is emitted. Validation prevents enabling it accidentally. There is no consent banner because the application currently loads no analytics/advertising tags or tracking storage. Before introducing tracking, review the container, purposes, recipients and applicable consent/objection requirements; implement the appropriate controls and update the notice before changing this guard.

The privacy notice describes the implemented website behaviour. The owner must still confirm the email provider, enquiry retention policy/criteria, recipients, international-transfer arrangements and applicable lawful bases. The notice is not a legal-compliance certification. See [commercial readiness and verification](docs/COMMERCIAL-READINESS.md) for source checks and remaining owner decisions.

## Quality checks

```sh
npm run lint
npm run format:check
npm run typecheck
npm run validate:content
npm test
npm run build
npm run test:smoke
npx playwright install chromium
npm run test:e2e
```

`npm run format` applies Prettier. To keep Chromium in the repository cache, prefix both install and test commands with `PLAYWRIGHT_BROWSERS_PATH=.cache/ms-playwright`. On Linux, use `npx playwright install --with-deps chromium` if system browser dependencies are missing.

Browser checks cover 320, 375, 390, 768 and 1440px widths: every public page, real static refresh/404 behaviour, assets/fonts, no unexpected external requests or console errors, keyboard navigation, product/service inquiry context, encoded draft contents, privacy/disclosures, JavaScript-disabled primary content and axe WCAG A/AA rules. Automated checks supplement human accessibility and mail-client review.

### Visual references

Committed HTML/CSS references in `tests/fixtures/visual/` are independent of normal builds and tests. Both the reference and current page render in the same browser using self-hosted Inter. Checks require identical page dimensions and less than 0.2% changed pixels at a 0.2 colour threshold. There are no masked form or footer regions.

After an intentional design/content change, first review screenshots of the actual pages at the supported widths. Then run:

```sh
npm run test:visual:update
npm run test:e2e
```

Review the changed reference files and screenshots before committing them. Reference updates are blocked in CI. `test-results/` contains reference/actual PNGs; `npm run test:e2e -- --reporter=html` followed by `npx playwright show-report` exposes image diffs. Historical pre-migration HTML is archived under `docs/baseline/` and is not the current visual target.

## GitHub Pages deployment

Deployment configuration and the custom domain remain unchanged. Nothing in this refinement pushes, merges or deploys automatically from the local workspace.

1. Review changes and complete the owner checks above.
2. In **Settings → Pages → Build and deployment**, select **GitHub Actions**, retaining **www.newroniq.com** as the custom domain and the existing DNS.
3. With owner approval, merge the reviewed changes into **master**. The deployment workflow runs the reusable validation workflow, then rebuilds the same commit and deploys `dist/` using the official Pages artifact/deployment actions.
4. Confirm the `validate` and `deploy` jobs succeed, then check the live homepage, privacy page and both product-interest journeys. Enable **Enforce HTTPS** when GitHub makes it available.

Publishing the repository root serves the uncompiled Vite source shell and can produce a blank page. Do not switch to branch-root publishing or commit `dist/`. CNAME and site URL configuration do not replace the production build. PRs validate but do not deploy; manual deployment is gated to master. No personal access token is needed.

### Base paths and domains

The default build targets `https://www.newroniq.com/`. Root `CNAME` and `public/CNAME` match; `_config.yml` remains historical and is bypassed by the Actions deployment.

For project Pages validation:

```sh
SITE_BASE_PATH=/website/ SITE_URL=https://newroniq.github.io/website/ npm run build
SITE_BASE_PATH=/website/ npm run test:smoke
SITE_BASE_PATH=/website/ SITE_URL=https://newroniq.github.io/website/ npm run test:e2e -- project-path
```

The build prefixes assets, fonts, links and product-interest URLs; writes matching canonical/sitemap URLs; and omits CNAME for the project build. `SITE_BASE_PATH` must start/end with `/`, and the HTTPS `SITE_URL` pathname must match it exactly. Afterwards run `npm run build` to restore the custom-domain output. No environment variables are required for normal deployment, so no `.env.example` is needed.

## Troubleshooting

- Blank live page or `/src/main.tsx` in delivered HTML: Pages is serving source rather than `dist/`; check the publishing source and deployment job.
- Missing assets/deep links: publish the entire production directory with the correct base. Use the strict static server to check real HTTP 404s.
- Content errors: fix the reported JSON path/schema instead of bypassing validation. Copy changes ordinarily need no component edit.
- Visual failures: inspect screenshots and geometry before accepting a new reference. Do not increase tolerances to conceal a regression.
- Draft does not open: configure an email application or use the visible address in webmail. The site cannot verify that an email was sent.
- Privacy or disclosure changes: update the central company/contact configuration and notice, then review actual business practices before publishing.

The original [migration inventory](docs/MIGRATION.md) and [historical verification](docs/VERIFICATION.md) are retained for context. The [commercial readiness report](docs/COMMERCIAL-READINESS.md) describes this refinement and its actual checks.
