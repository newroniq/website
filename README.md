# NEWRONIQ website

NEWRONIQ LTD is an independent UK-based **Enterprise AI Strategy, Architecture & Cloud Advisory** consultancy. This website presents four advisory engagements and the Enterprise AI Transformation Blueprint. DOptimiser, IQPublish, StylePulse and Academy remain secondary offerings.

The existing React, strict TypeScript, Vite, Tailwind and Zod stack is retained. Marketing pages are prerendered to static HTML and hydrated for interactive controls. Deploy **only `dist/`** to GitHub Pages. No backend, framework migration or SPA rewrite is needed.

## Brand hierarchy

- Wordmark: **NEWRONIQ**, with NEWRON in black and IQ in red.
- Company tagline: **Think Bold. Build Reality.**, rendered from `site.tagline` beneath the footer wordmark.
- Specialisation: **Enterprise AI Strategy, Architecture & Cloud Advisory**.
- Homepage marketing headline: **From AI Ambition to Enterprise Reality.** This is separate from the company tagline.
- **Making Enterprise AI Work in the Real World.** is supporting consultancy copy.

## Development

Use Node 24 LTS and the committed npm lockfile.

```sh
npm ci
npm run dev
npm run build
npm run preview
```

For exact static routing and 404 behavior, run `node --import tsx scripts/serve-static.ts` after building and visit `http://127.0.0.1:4173/`.

## Content and structure

- `src/content/` contains business copy and metadata; `src/lib/content/` validates it with Zod. Invalid content fails the build.
- `advisory.json` owns the four advisory services, shared Blueprint, expertise and advisory questions. `home.json` owns homepage sections.
- `products.json` owns three initiatives with individual status and planned capability descriptions. `research.json` retains the three published articles; authors and dates remain optional and must be genuine.
- `site.json` owns the wordmark, navigation, verified company details and public email. `pages.json` owns contact, about and Academy copy; `privacy.json` owns the privacy notice.
- `src/app/routes.ts` defines public routes. Existing `/whitepapers/` and article URLs remain; new routes are `/services/`, `/products/`, `/doptimiser/`, `/about/` and `/academy/`.
- `src/lib/analytics.ts` is the single analytics gateway. `src/lib/tally.ts` handles form links and message validation. Components never send form answers to analytics.
- `scripts/prerender.tsx` generates route-specific HTML, metadata, canonical URLs, JSON-LD, robots, sitemap and the static 404. Fonts remain self-hosted under `public/fonts/` with their licence.

Copy `.env.example` to `.env.local` for optional integrations. These are **public browser build settings**, not secret credentials:

```dotenv
VITE_PUBLIC_TALLY_FORM_ID=
VITE_PUBLIC_POSTHOG_KEY=
VITE_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
```

The application stays usable without these settings: the Contact page offers the public email and analytics remains inactive. A configured Tally form works independently of analytics consent. A build must be repeated after changing public variables. Vite and the prerender script both load the same public configuration.

See [integration setup](docs/INTEGRATIONS.md) for the exact form, notifications, consent behavior and PostHog dashboard instructions. See [transformation verification](docs/TRANSFORMATION.md) for actual checks and outstanding manual work.

## Quality checks

```sh
npm run lint
npm run format:check
npm run typecheck
npm run validate:content
npm test
npm run build
npm run test:smoke
PLAYWRIGHT_BROWSERS_PATH=.cache/ms-playwright npx playwright install chromium
PLAYWRIGHT_BROWSERS_PATH=.cache/ms-playwright npm run test:e2e
```

Browser tests use the unconfigured production build and no real analytics or submission endpoints. SDK calls and configured Tally success messages are mocked in focused unit tests. They do not prove receipt in a live account. The provider integration suite intentionally skips ordinary builds: it requires fake form/project settings and intercepted HTTPS requests. CI runs that suite separately; see the isolated browser checks in `docs/INTEGRATIONS.md`.

Playwright covers 320, 375, 390, 768 and 1440px widths, static refresh and 404 behavior, keyboard navigation, WCAG A/AA axe checks, product context, privacy preferences, assets and console errors. Review screenshots before updating committed visual references:

```sh
npm run test:visual:update
npm run test:e2e
```

Reference updates are prohibited in CI. Keep existing comparison tolerances; never adjust them to hide an unintended regression. Historical migration documents under `docs/` describe prior versions.

## GitHub Pages deployment

No changes are published automatically by local commands. Review changes and finish live integration checks before merging.

1. In the GitHub repository, set **Pages → Build and deployment → GitHub Actions**. Retain the existing `www.newroniq.com` domain and DNS.
2. Add the three public settings as repository Actions **variables**, matching `.env.example`. The deploy build reads them; validation builds intentionally omit live integration settings.
3. Review the change, run the quality checks and configure the live Tally/PostHog projects. With owner approval, merge to `master`.
4. The existing workflow validates the commit, builds `dist/` and deploys through official GitHub Pages artifact actions. It also supports manual dispatch on `master`.
5. Verify HTTPS, navigation, metadata, real Tally receipt and notification email, consent rejection, accepted events and analytics withdrawal on the published site.

Root `CNAME` and `public/CNAME` retain the custom domain. `_config.yml` is historical and bypassed by the Actions build. Do not publish the uncompiled repository root or commit `dist/`.

Project Pages compatibility:

```sh
SITE_BASE_PATH=/website/ SITE_URL=https://newroniq.github.io/website/ npm run build
SITE_BASE_PATH=/website/ npm run test:smoke
SITE_BASE_PATH=/website/ SITE_URL=https://newroniq.github.io/website/ npm run test:e2e -- project-path
npm run build
```

The last command restores custom-domain output. The build prefixes links/assets and generates matching canonicals/sitemap URLs; project builds omit CNAME. `SITE_BASE_PATH` must start and end with `/` and match the HTTPS `SITE_URL` pathname.
