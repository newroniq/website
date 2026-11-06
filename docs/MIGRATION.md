# Migration inventory and decisions

Inspected before source changes: all tracked files (`index.html`, `_config.yml`, `CNAME`, README), Git branch/remotes and repository status. Only unrelated untracked `.idea/` files existed; leave them alone. There were no workflows, local images/fonts, package dependencies, or further source directories.

## Baseline

- One public URL `/`; imperative view switching without history/deep links: home, StylePulse, IQPublish, contact, whitepapers and three research articles.
- Home: hero/two CTAs, purpose/three principles, four capabilities cards, closing CTA. The copy says four principles but provides three: preserve the supplied copy.
- Detail pages: existing product names, placeholder dashboard/portal visuals, feature grids, back links and contact CTAs. Preserve the surprising original capability-to-product link mappings.
- Research hub: three cards and three complete articles stored as HTML strings.
- Fixed desktop navigation, Products anchor, broken Services anchor (section commented out), Contact button. Mobile hides navigation with no replacement.
- Contact: four fields and native required/email checks. **No network submission or external form provider exists**; the original fabricated a success message using innerHTML.
- Footer: three `#` placeholder links. No real social/careers destination is supplied; preserve them and document this limitation.
- Styling: Tailwind v3 CDN default theme/breakpoints (640/768/1024/1280/1536), max-width containers, Inter weights 300–800 via Google Fonts, signature #a12027, gray backgrounds/borders, hover translation/shadow, smooth scroll. Inline SVG icons; no image assets. No dropdowns or other animations.
- SEO: only title/viewport/charset/lang. GTM-KXTJW9R8 script and noscript iframe. No canonical, sitemap, robots or structured data.
- Hosting: CNAME `www.newroniq.com`; `_config.yml` chooses jekyll-theme-minimal. Origin newroniq/website; default branch master. No checked-in deployment workflow.

## Architecture

React + strict TypeScript + Vite with native document navigation. Each former view receives an actual directory/index.html; article routes are `/whitepapers/paper-aec/`, `/whitepapers/paper-java/`, `/whitepapers/paper-retail/`. No router is necessary for these small independent static pages. React's supported static DOM prerender API generates all pages at build time; hydration adds only navigation/form state. This avoids GitHub Pages rewrites and a runtime server.

JSON is parsed/validated using Zod before Vite, shared by browser and build. Layout and page components retain original classes and content order. Existing Tailwind is compiled locally (not a new design system). Use existing SVG rather than adding an icon dependency. Build metadata from site configuration, generate sitemap/robots/404/.nojekyll and preserve CNAME. Base-path configuration is explicit; project Pages builds omit CNAME and require a matching canonical site URL.

Intentional corrections: keyboard-operable links, mobile menu, associated form labels, real heading hierarchy, stronger muted-text contrast, focus/reduced-motion support. Services reaches the existing capabilities, without resurrecting unpublished commented content. Contact opens a prefilled email and explicitly states it has not sent a message. No external service is introduced.

The original source remains in `docs/baseline/index.html` for reproducible screenshot comparison. `_config.yml` and root CNAME remain as historical hosting configuration; Actions deploys dist with .nojekyll and bypasses Jekyll.

## Rendering and hosting references

React Router's [static pre-rendering support](https://reactrouter.com/how-to/pre-rendering) was considered. For this finite set of document pages, [React DOM's static prerender API](https://react.dev/reference/react-dom/static/prerender) with native links provides the required HTML without a router framework or fallback. Base-path and artifact deployment follow [Vite's static deployment guidance](https://vite.dev/guide/static-deploy) and the official [Pages artifact](https://github.com/actions/upload-pages-artifact/tree/v3) and [Pages deployment](https://github.com/actions/deploy-pages/tree/v4) actions.
