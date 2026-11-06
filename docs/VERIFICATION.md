# Migration verification

Verified locally on 3 November 2026 using macOS ARM64, Node 25.2.1, npm 11.6.2 and Playwright Chromium 156. CI targets Ubuntu with Node 24 LTS. The source repository's deployment settings and DNS have not been changed, and no remote deployment has been performed.

## Commands and outcomes

| Command/check                                                                                              | Outcome                                                                                                                    |
| ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `npm run lint`                                                                                             | Passed, no lint errors                                                                                                     |
| `npm run format:check`                                                                                     | Passed                                                                                                                     |
| `npm run typecheck`                                                                                        | Passed with strict TypeScript                                                                                              |
| `npm run validate:content`                                                                                 | Passed: site, page copy/actions, four capabilities, three research cards and eight SEO entries                             |
| `npm test`                                                                                                 | 8 tests passed across 2 suites                                                                                             |
| `npm run build`                                                                                            | Passed: 8 public HTML documents plus 404, metadata, sitemap, robots and .nojekyll                                          |
| `npm run test:smoke`                                                                                       | Passed: every local route/anchor, pre-rendered h1, metadata and referenced static assets                                   |
| `PLAYWRIGHT_BROWSERS_PATH=.cache/ms-playwright npm run test:e2e`                                           | Final complete suite: 63 passed                                                                                            |
| Project Pages build and smoke with `SITE_BASE_PATH=/website/ SITE_URL=https://newroniq.github.io/website/` | Passed; correctly prefixed assets/links/canonicals/sitemap; no CNAME in project output                                     |
| Project browser tests (`npm run test:e2e -- project-path` with matching build environment)                 | 3 passed, covering all eight routes and refreshes at desktop/tablet/mobile widths                                          |
| `npm audit --audit-level=moderate`                                                                         | 0 vulnerabilities reported                                                                                                 |
| Ruby YAML parsing of both workflows                                                                        | Passed                                                                                                                     |
| Official `actionlint` 1.7.12, checksum verified, `-shellcheck= -pyflakes=`                                 | Both workflows passed semantic/expression/action-input validation; optional shellcheck/pyflakes integrations were disabled |
| `git diff --check`                                                                                         | Passed                                                                                                                     |

The final local `dist/` is restored to the existing custom-domain target, `https://www.newroniq.com/`, with CNAME retained. Build artifacts, browser downloads and test outputs are ignored by Git.

## Browser coverage

The suite covers all eight public pages at **1440×1000**, **768×1024** and **390×844**. It checks direct document loading and refreshing, local asset responses, internal link/base correctness, canonical URLs and sitemap discovery, mobile menu state, product/research navigation, anchors, form required/email checks and email handoff, unsupported URLs returning HTTP 404, horizontal overflow and unexpected JavaScript/console errors. The HTML remains readable with JavaScript disabled.

Axe found no violations of the tested WCAG 2 A/AA, 2.1 AA and 2.2 AA rules on any page at those widths. Automated results do not establish full WCAG conformance; assistive-technology and manual usability reviews remain useful.

### Visual comparisons

All **24** original-versus-migrated comparisons passed: eight views/articles × three viewports. The baseline is the preserved original HTML, styled using locally compiled original Tailwind utilities and original custom CSS, with neither accessibility overrides nor migrated layout code applied to it.

Tests write original and migrated full-page PNGs to `test-results/`; Playwright reports attach comparison ratios and diff PNGs. To inspect them, rerun the suite with `--reporter=html` and open `npx playwright show-report`. CI always uploads the root-build browser reports/results as an artifact.

Comparisons block remote fonts and analytics for deterministic system-font rendering on both sides. They use a color threshold of 0.2 and require less than 2% changed pixels. They are geometry/regression checks, not proof of identical Inter rendering on every browser/OS. The contact form region is masked, and the new email-delivery notice is hidden only for comparison to prevent its intentional extra height from shifting the footer. The real form remains covered by behavior and accessibility tests.

The comparison initially found spacing changes after converting buttons to links. Restoring inline-block display corrected these differences. Article heading levels were also corrected without changing their visual classes.

## Lighthouse

Lighthouse **13.6.0**, default mobile simulation, local production static server, Chromium 156:

| Page        | Performance | Accessibility | Best Practices | SEO |
| ----------- | ----------: | ------------: | -------------: | --: |
| `/`         |         100 |           100 |            100 | 100 |
| `/contact/` |         100 |           100 |            100 | 100 |

Reports are available locally at `.cache/lighthouse-home.json` and `.cache/lighthouse-contact.json`. Both reported no browser console errors. The initial audit exposed a missing favicon; the final output includes a small SVG using the existing signature color.

Analytics requests were explicitly blocked to avoid recording test visits. Google Fonts was left enabled for these audits. These are local lab measurements with simulated throttling, not field Core Web Vitals or scores measured on GitHub Pages. Real third-party GTM tags, geographic latency and GitHub caching/transport can change results. Only the two listed pages received Lighthouse audits.

A reproducible command, after starting `node --import tsx scripts/serve-static.ts`:

```sh
CHROME_PATH="/path/to/chrome" npm exec --yes --package=lighthouse -- lighthouse \
  http://127.0.0.1:4173/ --chrome-flags='--headless' \
  --only-categories=performance,accessibility,best-practices,seo \
  --blocked-url-patterns='*googletagmanager.com*' \
  --output=json --output-path=.cache/lighthouse-home.json
```

Production output contains approximately 13.1 kB CSS (3.7 kB gzip) and 342.5 kB JavaScript (102.3 kB gzip), plus static HTML. There are no runtime Tailwind CDN requests or local image downloads. Given the small site, excellent lab results and no routing dependency, further chunking was not justified for this migration.

## Repository changes

- Replaced root `index.html` with the Vite document shell; archived its original contents under `docs/baseline/index.html`.
- Added React page, article, layout, form and repeated-content components under `src/`, retaining original utility classes and content order.
- Added six JSON content files and Zod validation modules, safe base-path helpers and static rendering/verification scripts.
- Added package manifest/lockfile, TypeScript/Vite/Tailwind/PostCSS/ESLint/Prettier/Playwright configuration, unit/component/browser/axe/visual tests, and CI/deploy workflows.
- Added `public/CNAME` copied from the existing root file and a signature-color SVG favicon.
- Replaced the minimal README with setup, architecture, content editing, testing, routing, deployment, custom-domain and troubleshooting documentation.
- Root `CNAME` and `_config.yml` remain byte-for-byte unchanged. Unrelated IntelliJ files were left alone. No original files were deleted; unpublished commented-out Services content remains in the archived original.

## Intentional corrections and remaining limitations

- The original contact form never transmitted data and fabricated success. The migrated form requests a prefilled email draft, preserves fields/native validation, supports a native mailto fallback and explicitly states that the website has not sent the inquiry. An email application and user sending action are required; actual delivery cannot be verified here.
- The Services navigation previously threw on a missing target. It now reaches the existing capabilities section. The unpublished commented Services section was not made public.
- Mobile navigation, real document links/history, associated form labels, heading hierarchy, visible keyboard focus and reduced-motion support were added. Muted text contrast was strengthened. No business copy was rewritten to fix apparent editorial inconsistencies.
- Original footer links remain `#` placeholders. No verified LinkedIn, careers or insights destination was supplied. They can be configured in `site.json` when known.
- Original capability-to-product mappings are retained even where the category and destination appear inconsistent. Product claims and placeholder dashboard/portal visuals are retained without inventing assets or evidence.
- No Safari, Firefox, screen-reader or physical-device checks were run. E2E used Chromium; automated tests are not a full accessibility audit.
- Fonts and GTM remain external. The remote GTM container's contents, analytics receipt and privacy configuration were not audited. No client secret or new third-party submission service was added.
- Workflow syntax and semantics were validated locally; GitHub-hosted CI, environment protections, DNS, certificate state and actual deployment still require execution in the repository. Publish instructions are in the README. Select GitHub Actions as the Pages source and retain the existing custom domain.
- The npm toolchain repeatedly warns about an existing environment-level `min-release-age` setting. This warning is outside repository configuration and did not prevent installation or checks.
