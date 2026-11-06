# NEWRONIQ website

The existing NEWRONIQ website migrated to React and strict TypeScript. Vite builds fingerprinted CSS/JavaScript; React's static `prerender` API produces complete HTML for every page. Deploy only `dist/`; no application server, database, SPA fallback or GitHub Pages rewrite is required.

The original copy, product mappings, typography, breakpoints, placeholder visuals, hover effects and GTM integration are retained. [Migration inventory and decisions](docs/MIGRATION.md) documents the baseline and intentional corrections. [Verification report](docs/VERIFICATION.md) records the checks actually run and remaining limitations.

## Requirements and setup

Use Node **24 LTS** and npm. Node 22.12+ is also supported by the toolchain; CI uses 24. Commit `package-lock.json` and use `npm ci` for reproducible installation.

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. For production behavior:

```sh
npm run build
npm run preview
```

`preview` is a convenience server and may use a development-style HTML fallback. Browser tests instead use `scripts/serve-static.ts`, which serves real files and returns `404.html` with HTTP 404 for unknown paths.

## Architecture

- `src/app/`: shared application shell and explicit public route registry.
- `src/pages/`: semantic page layouts preserving the original utility classes; articles use safe JSX, never HTML injection.
- `src/components/layout/`: shared header, keyboard-accessible mobile navigation and footer.
- `src/components/sections/`: data-driven capability and principle grids.
- `src/components/common/`: contact form and its email-draft handoff.
- `src/content/`: JSON source of truth for business copy, labels, links and metadata.
- `src/lib/content/`: Zod contracts and typed content imports.
- `src/styles/`: original CSS plus local Tailwind v3 compilation, contrast, focus and reduced-motion corrections.
- `scripts/`: content validation, static rendering, link/asset smoke checks and a strict static test server.
- `tests/e2e/`: production browser, accessibility and original-versus-migrated visual checks.
- `docs/baseline/index.html`: untouched original source; never copied to production.
- `public/CNAME`: retained custom-domain file. The root `CNAME` and `_config.yml` are retained as historical hosting configuration. Actions bypasses Jekyll.

React 19, TypeScript 6, Vite 8, Zod 4, Tailwind 3, Vitest 4, Testing Library, Playwright, axe, ESLint and Prettier are locked in `package-lock.json`. JSON avoids an unnecessary YAML parsing dependency. Existing inline SVGs avoid an unnecessary icon dependency. Native document links suit this small static site; React Router is unnecessary. Static rendering uses React's supported API rather than a browser crawl or private framework hooks.

### Public routes

| URL                          | Original screen                                       |
| ---------------------------- | ----------------------------------------------------- |
| `/`                          | Home, including `#products` and corrected `#services` |
| `/stylepulse/`               | StylePulse detail                                     |
| `/iqpublish/`                | IQPublish detail                                      |
| `/contact/`                  | Contact                                               |
| `/whitepapers/`              | Research hub                                          |
| `/whitepapers/paper-aec/`    | Adobe Experience Cloud article                        |
| `/whitepapers/paper-java/`   | Java resilience article                               |
| `/whitepapers/paper-retail/` | Predictive trend article                              |

The original exposed only `/` and switched views without changing the URL. These additional URLs make each view directly accessible. The build also writes `404.html`, `.nojekyll`, `robots.txt`, `sitemap.xml`, canonical/social metadata and an Organization JSON-LD record using the supplied name, URL and email. No fabricated addresses, reviews, images or business claims are added.

## Editing content

Edit JSON files, then run `npm run build`. Do not put HTML into JSON: strings are escaped by React.

| File                        | Controls                                                                                      |
| --------------------------- | --------------------------------------------------------------------------------------------- |
| `src/content/site.json`     | Identity, canonical origin, email, GTM ID, navigation, footer, form copy/options and 404 text |
| `src/content/home.json`     | Ordered principle and capability arrays, benefits and action labels/destinations              |
| `src/content/research.json` | Research heading, ordered cards, article identifiers and shared read label                    |
| `src/content/pages.json`    | Remaining page and article copy; descriptive keys stay stable when wording changes            |
| `src/content/links.json`    | Page action destinations                                                                      |
| `src/content/seo.json`      | Page-specific titles and descriptions used for HTML, Open Graph and Twitter metadata          |

For example, add an item to `home.capabilities` with `title`, `category`, `description`, `benefits` and `action: { label, href }`; the grid renders it in array order. No JSX change is needed. Footer HTTPS links can replace existing `#` placeholders when verified destinations are available.

Zod rejects empty copy, incomplete cards, invalid email, unsupported paper IDs and unsafe navigation. The build type-checks references, so removing/renaming a referenced copy key also fails the build with its location. Route/anchor/asset integrity is checked by `npm run test:smoke`. Follow validation messages rather than bypassing schemas.

### Adding a section or page

For a structurally new section, add content and its Zod contract, build a small semantic component using existing classes, and compose it into the relevant page. Reuse a component for repeated structures; avoid creating a component for every wrapper.

For a new public page, add the page component, register its trailing-slash path/key in `src/app/routes.ts`, add its metadata and corresponding field in `src/lib/content/seo.ts`, and add navigation/cards where appropriate. Add a production browser test. The renderer and sitemap discover registered routes automatically. For new research articles, extend the research identifier schema, add safe JSX for the article layout with external copy, and register the route. No server routing configuration is needed.

If adding images later, put them in `public/`, store their path/alt text in content, use `url()` to respect the deployment base, specify dimensions and lazy-load below-the-fold images. The original contains no image assets.

### Contact behavior

The old form had no integration: it only replaced itself with a false “Message Sent” message. The migrated form preserves all fields and native required/email validation, opens a `mailto:` draft with encoded input, and explicitly tells the visitor to review/send it in their email app. The email address is also directly linked. A configured email client is required. The website cannot verify delivery and never claims that it can. A backend/external processing service was not introduced.

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

`npm run format` applies Prettier. To keep Chromium inside the repository instead of the user cache, prefix **both** install and test commands with `PLAYWRIGHT_BROWSERS_PATH=.cache/ms-playwright`. `.cache/`, build artifacts and test results are ignored.

Browser coverage includes all pages, real file routes and refreshes, mobile navigation, capability/research links, anchors, required fields, email handoff, console exceptions, missing assets, horizontal overflow, JavaScript-disabled content and axe WCAG A/AA checks at 1440, 768 and 390px widths.

Visual tests compile the original source's Tailwind CSS and compare it with the production application in the same Chromium session. Every view/article is compared at all three widths. Original/migrated PNGs are written to `test-results/`; reports include diff images and pixel ratios. Remote fonts and analytics are blocked for deterministic comparisons, so these check geometry using the same system fallback font. They allow less than 2% changed pixels at a 0.2 color threshold for intentional contrast/menu changes. The contact form is masked and its added delivery notice is hidden only in the comparison; normal behavior/accessibility tests cover the actual form. These checks supplement human review and do not establish pixel-perfect fidelity with remote Inter on every OS.

## GitHub Pages deployment

1. Commit the migration and lockfile, review it, and merge into **master**.
2. In the repository's **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source.
3. Retain the custom domain **www.newroniq.com** and existing DNS. Check **Enforce HTTPS** when GitHub makes it available. Do not change DNS as part of this migration.
4. The `Validate` workflow runs formatting/lint/types/content/unit/build/static checks, Chromium E2E/axe/visual checks, then a project-base build smoke check. Failed validation prevents automatic deployment.
5. `Deploy GitHub Pages` runs the reusable `Validate` workflow on each master push (and manual master dispatch). Once validation succeeds, it checks out the same commit, builds it, uploads `dist/` using the official Pages artifact action, and deploys with the official Pages deployment action. The workflow's deployment URL identifies the published site. PR and feature-branch workflows do not deploy.

No personal access token is required. Deployment uses the scoped `GITHUB_TOKEN` and OIDC; validation has read-only repository permissions. Manual workflow dispatch is limited to master. Repository environment protections may require a maintainer to approve the deployment.

### Custom domain and project base paths

The default build targets `https://www.newroniq.com/` and retains `public/CNAME`. Keep the root and public CNAME files synchronized if the domain changes, and update `site.url`.

To test a project Pages build locally:

```sh
SITE_BASE_PATH=/website/ SITE_URL=https://newroniq.github.io/website/ npm run build
SITE_BASE_PATH=/website/ npm run test:smoke
SITE_BASE_PATH=/website/ npm run preview
```

Open `/website/` in preview. `SITE_BASE_PATH` must start and end with `/`; `SITE_URL` must be HTTPS and include exactly that pathname. The build rejects mismatches. Project-domain builds omit `dist/CNAME` automatically, prefix all local links/assets, and generate matching canonical/sitemap URLs. To deploy on project Pages instead of the current custom domain, set these two values on the deploy build step and remove the custom domain in repository Pages settings. This is an optional hosting change; the checked-in workflow preserves the existing domain.

No environment variables are required for the normal custom-domain deployment, so there is no `.env.example`. Optional overrides are build configuration and never contain secrets.

## Troubleshooting and limitations

- Missing styles/assets on project Pages: rebuild with the matching base and canonical URL, then publish the whole `dist/` directory.
- Deep links 404: deploy directory `index.html` files, not only the root index. No SPA rewrite is required or expected.
- Wrong page on unknown URLs in preview: test with `node --import tsx scripts/serve-static.ts`; it returns the generated 404 with HTTP 404.
- Build content errors: check the reported JSON path/key and corresponding schema. Ordinary copy changes do not require component edits.
- Chromium missing: run the Playwright install command using the same `PLAYWRIGHT_BROWSERS_PATH` as the tests. CI installs required Linux libraries with `--with-deps`.
- Contact draft does not open: configure an email client or use the visible direct email address.
- Footer destinations are still `#` because the original supplied no LinkedIn, careers or insights URLs. Supply verified URLs in `site.json` when available.
- Google Fonts and GTM remain external integrations. Font availability and analytics/tag-container behavior depend on those providers and the visitor's settings. Audit the GTM container separately; its downstream tags are not in this repository.
- Lighthouse and automated axe cannot certify full WCAG compliance or real-world Core Web Vitals. See the verification report for measured versus untested areas.
