import { advisory, advisorySchema } from '../lib/content/advisory';
import { tallyUrl } from '../lib/tally';
import { structuredData } from '../lib/structured-data';
import { describe, it, expect } from 'vitest';
import { site, siteSchema } from '../lib/content';
import { home, homeSchema } from '../lib/content/home';
import { seo, seoSchema } from '../lib/content/seo';
import {
  inquiries,
  inquiriesSchema,
  getInquiry,
} from '../lib/content/inquiries';
import { products, productsSchema } from '../lib/content/products';
import { research, researchSchema } from '../lib/content/research';
import { contactHref } from '../lib/contact';
import { normalizeBase, url } from '../lib/urls';
describe('content and inquiry contracts', () => {
  it('rejects invalid copy and unsafe links', () => {
    expect(siteSchema.safeParse({ ...site, email: 'invalid' }).success).toBe(
      false,
    );
    expect(siteSchema.safeParse({ ...site, name: ' ' }).success).toBe(false);
    expect(
      siteSchema.safeParse({
        ...site,
        navigation: [{ label: 'x', href: '//evil.com' }],
      }).success,
    ).toBe(false);
    expect(
      seoSchema.safeParse({ ...seo, privacy: { title: '', description: 'x' } })
        .success,
    ).toBe(false);
  });
  it('requires the advisory services, nine inquiry choices and three distinct products', () => {
    expect(
      homeSchema.safeParse({
        ...home,
        challenge: { ...home.challenge, items: [] },
      }).success,
    ).toBe(false);
    expect(
      advisorySchema.safeParse({
        ...advisory,
        services: advisory.services.slice(1),
      }).success,
    ).toBe(false);
    expect(
      advisorySchema.safeParse({
        ...advisory,
        services: advisory.services.map(() => advisory.services[0]),
      }).success,
    ).toBe(false);
    expect(inquiries).toHaveLength(9);
    expect(inquiriesSchema.safeParse(inquiries.slice(0, 4)).success).toBe(
      false,
    );
    expect(
      inquiriesSchema.safeParse([...inquiries, inquiries[0]]).success,
    ).toBe(false);
    expect(
      productsSchema.safeParse({
        ...products,
        products: products.products.map(() => products.products[0]),
      }).success,
    ).toBe(false);
    expect(getInquiry('untrusted')).toEqual(getInquiry('general'));
    expect(getInquiry('engineering').id).toBe('implementation');
    expect(getInquiry('automation').id).toBe('strategy');
    expect(getInquiry('__proto__').id).toBe('general');
  });
  it('passes only the allowlisted interest category to Tally', () => {
    expect(contactHref('iqpublish')).toBe('/contact/?inquiry=iqpublish');
    const form = new URL(
      tallyUrl('testForm', '<script>invalid</script>', true),
    );
    expect(form.origin).toBe('https://tally.so');
    expect(form.searchParams.get('interest_context')).toBe('general');
    expect([...form.searchParams.keys()]).toEqual([
      'interest_context',
      'interest_label',
      'alignLeft',
      'hideTitle',
      'transparentBackground',
    ]);
  });
  it('requires every existing article exactly once', () => {
    expect(
      researchSchema.safeParse({
        ...research,
        papers: research.papers.slice(1),
      }).success,
    ).toBe(false);
    expect(
      researchSchema.safeParse({
        ...research,
        papers: research.papers.map(() => research.papers[0]),
      }).success,
    ).toBe(false);
    expect(
      researchSchema.safeParse({
        ...research,
        papers: [
          { ...research.papers[0], id: 'unknown' },
          ...research.papers.slice(1),
        ],
      }).success,
    ).toBe(false);
  });
  it('builds structured data from visible facts without invented publication metadata', () => {
    const graph = structuredData(
      '/whitepapers/paper-aec/',
      new URL(site.url),
      'Architecture',
    )['@graph'];
    const article = graph.find((item) => item['@type'] === 'Article');
    expect(article?.headline).toBe(research.papers[0].title);
    expect(article).not.toHaveProperty('datePublished');
    expect(article).not.toHaveProperty('author');
    const serviceGraph = structuredData(
      '/services/',
      new URL('https://example.com/website/'),
      'Services',
    )['@graph'];
    expect(
      serviceGraph.filter((item) => item['@type'] === 'Service'),
    ).toHaveLength(4);
    expect(JSON.stringify(serviceGraph)).toContain(
      'https://example.com/website/services/#strategy',
    );
  });
  it('builds accurate breadcrumbs for articles, products and ordinary pages', () => {
    const base = new URL('https://example.com/website/');
    const breadcrumbNames = (path: string, title: string) => {
      const node = structuredData(path, base, title)['@graph'].find(
        (item) => item['@type'] === 'BreadcrumbList',
      );
      return (
        node?.itemListElement as { name: string; item: string }[] | undefined
      )?.map((item) => item.name);
    };
    expect(breadcrumbNames('/doptimiser/', 'DOptimiser | NEWRONIQ')).toEqual([
      'Home',
      'Products',
      'DOptimiser',
    ]);
    expect(
      breadcrumbNames('/whitepapers/paper-aec/', 'Article | NEWRONIQ'),
    ).toEqual(['Home', 'Insights', research.papers[0].title]);
    expect(breadcrumbNames('/contact/', 'Contact | NEWRONIQ')).toEqual([
      'Home',
      'Contact',
    ]);
    expect(breadcrumbNames('/', 'Home')).toBeUndefined();
    expect(breadcrumbNames('/404.html', 'Missing')).toBeUndefined();
  });
  it('supports optional editorial attribution without inventing it', () => {
    expect(
      research.papers.every((paper) => !paper.author && !paper.publishedOn),
    ).toBe(true);
    expect(
      researchSchema.safeParse({
        ...research,
        papers: research.papers.map((paper, index) =>
          index
            ? paper
            : {
                ...paper,
                author: 'Verified contributor',
                publishedOn: '2026-11-06',
              },
        ),
      }).success,
    ).toBe(true);
    expect(
      researchSchema.safeParse({
        ...research,
        papers: research.papers.map((paper, index) =>
          index
            ? paper
            : {
                ...paper,
                references: [{ label: 'Unsafe', href: 'javascript:alert(1)' }],
              },
        ),
      }).success,
    ).toBe(false);
  });
  it('rejects unsafe site paths and invalid deployment bases', () => {
    expect(normalizeBase('/website/')).toBe('/website/');
    for (const path of [
      '//example.com/',
      '/\\example.com',
      'javascript:alert(1)',
    ])
      expect(() => url(path)).toThrow();
    for (const base of ['website', '//evil.com/', '/website', '/../'])
      expect(() => normalizeBase(base)).toThrow();
  });
});
