import { site } from './content';
import { advisory } from './content/advisory';
import { research, type Paper } from './content/research';
import { products } from './content/products';

type GraphNode = Record<string, unknown>;
type AbsoluteUrl = (local: string) => string;
type Breadcrumb = Readonly<{ name: string; path: string }>;

function organizationData(siteURL: URL, organizationId: string): GraphNode {
  return {
    '@type': 'Organization',
    '@id': organizationId,
    name: site.legalName,
    alternateName: site.name,
    identifier: site.company.number,
    description:
      'UK-based technology consultancy focused on enterprise AI strategy and architecture.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.company.registeredOffice,
    },
    sameAs: [site.company.registryUrl],
    url: siteURL.href,
    email: site.email,
  };
}
function serviceData(
  absolute: AbsoluteUrl,
  organizationId: string,
): GraphNode[] {
  return advisory.services.map((service) => ({
    '@type': 'Service',
    '@id': absolute(`/services/#${service.id}`),
    name: service.title,
    description: service.description,
    serviceType: service.title,
    url: absolute(`/services/#${service.id}`),
    provider: { '@id': organizationId },
  }));
}
function articleData(
  paper: Paper,
  path: string,
  absolute: AbsoluteUrl,
  organizationId: string,
): GraphNode {
  const article: GraphNode = {
    '@type': 'Article',
    '@id': absolute(path) + '#article',
    headline: paper.title,
    description: paper.description,
    articleSection: paper.category,
    url: absolute(path),
    mainEntityOfPage: absolute(path),
    publisher: { '@id': organizationId },
    citation: paper.references.map((reference) => reference.href),
  };
  if (paper.author) article.author = { '@type': 'Person', name: paper.author };
  if (paper.publishedOn) article.datePublished = paper.publishedOn;
  return article;
}
function parentBreadcrumb(
  isArticle: boolean,
  isProduct: boolean,
): Breadcrumb | undefined {
  if (isArticle) return { name: 'Insights', path: '/whitepapers/' };
  if (isProduct) return { name: 'Products', path: '/products/' };
  return undefined;
}
function breadcrumbData(
  path: string,
  title: string,
  paper: Paper | undefined,
  absolute: AbsoluteUrl,
): GraphNode {
  const product = products.products.find((item) => path === `/${item.id}/`);
  const parent = parentBreadcrumb(Boolean(paper), Boolean(product));
  const items: Breadcrumb[] = [{ name: 'Home', path: '/' }];
  if (parent) items.push(parent);
  const name = paper?.title ?? product?.name ?? title.split(' | ')[0];
  items.push({ name, path });
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}
export function structuredData(path: string, siteURL: URL, title: string) {
  const absolute: AbsoluteUrl = (local) =>
    new URL(local.replace(/^\//, ''), siteURL).href;
  const organizationId = siteURL.href + '#organization';
  const graph: GraphNode[] = [organizationData(siteURL, organizationId)];
  if (path === '/services/')
    graph.push(...serviceData(absolute, organizationId));
  const paper = research.papers.find(
    (item) => path === `/whitepapers/${item.id}/`,
  );
  if (paper) graph.push(articleData(paper, path, absolute, organizationId));
  if (path !== '/' && path !== '/404.html')
    graph.push(breadcrumbData(path, title, paper, absolute));
  return { '@context': 'https://schema.org', '@graph': graph };
}
