import { research } from '../src/lib/content/research';
import { links } from '../src/lib/content/links';
import { site, copy } from '../src/lib/content';
import { home } from '../src/lib/content/home';
import { seo } from '../src/lib/content/seo';
import { normalizeBase, deploymentBase } from '../src/lib/urls';
normalizeBase(deploymentBase);
console.log(
  `Content valid: ${site.name}, ${Object.keys(copy).length} content groups, ${home.capabilities.length} capabilities, ${Object.keys(seo).length} pages.`,
);

console.log(`Validated ${Object.keys(links).length} groups of page actions.`);

console.log(`Validated ${research.papers.length} research cards.`);
