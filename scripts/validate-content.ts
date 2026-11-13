import { academy } from '../src/lib/content/academy';
import { advisory } from '../src/lib/content/advisory';
import { products } from '../src/lib/content/products';
import { inquiries } from '../src/lib/content/inquiries';
import { privacy } from '../src/lib/content/privacy';
import { research } from '../src/lib/content/research';
import { site, copy } from '../src/lib/content';
import { home } from '../src/lib/content/home';
import { seo } from '../src/lib/content/seo';
import { normalizeBase, deploymentBase } from '../src/lib/urls';
normalizeBase(deploymentBase);
console.log(
  `Content valid: ${site.name}, ${Object.keys(copy).length} content groups, ${Object.keys(home).length} homepage groups, ${Object.keys(seo).length} pages.`,
);

console.log(`Validated ${research.papers.length} research cards.`);

console.log(
  `Validated ${products.products.length} product initiatives, ${inquiries.length} inquiry types and ${privacy.title}. Advisory services: ${advisory.services.length}`,
);

console.log(
  `Validated Academy: ${academy.learning.areas.length} learning areas.`,
);
