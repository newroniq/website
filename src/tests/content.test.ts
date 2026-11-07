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
import { createInquiryEmail, contactHref } from '../lib/contact';
import { normalizeBase, url } from '../lib/urls';
describe('content and inquiry contracts', () => {
  it('rejects invalid copy, unsafe links and enabling unaudited tracking', () => {
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
      siteSchema.safeParse({ ...site, analyticsEnabled: true }).success,
    ).toBe(false);
    expect(
      seoSchema.safeParse({ ...seo, privacy: { title: '', description: 'x' } })
        .success,
    ).toBe(false);
  });
  it('validates services, all seven inquiry choices and distinct product concepts', () => {
    expect(homeSchema.safeParse({ ...home, capabilities: [] }).success).toBe(
      false,
    );
    expect(
      homeSchema.safeParse({
        ...home,
        outcomes: { ...home.outcomes, items: [{ title: 'Incomplete' }] },
      }).success,
    ).toBe(false);
    expect(home.capabilities.map((item) => item.inquiryId)).toEqual([
      'architecture',
      'engineering',
      'automation',
      'experience',
    ]);
    expect(inquiriesSchema.safeParse(inquiries.slice(0, 4)).success).toBe(
      false,
    );
    expect(
      inquiriesSchema.safeParse([...inquiries, inquiries[0]]).success,
    ).toBe(false);
    expect(
      productsSchema.safeParse({
        ...products,
        products: [products.products[0], products.products[0]],
      }).success,
    ).toBe(false);
    expect(getInquiry('untrusted')).toEqual(getInquiry('general'));
  });
  it('encodes a truthful product-interest draft with optional organisation and no URL injection', () => {
    const draft = createInquiryEmail({
      id: 'stylepulse',
      name: 'A & B',
      email: 'person@example.com',
      organisation: 'Example Ltd',
      message: 'Can we discuss a pilot? & next steps',
    });
    expect(draft).not.toContain('+');
    expect(draft).toContain('%0D%0A');
    const parsed = new URL(draft);
    expect(parsed.pathname).toBe('info@newroniq.com');
    expect(parsed.searchParams.get('subject')).toBe(
      'Product Interest — StylePulse',
    );
    expect(parsed.searchParams.get('body')).toContain('A & B');
    expect(parsed.searchParams.get('body')).toContain('Example Ltd');
    expect(parsed.searchParams.get('body')).toContain(
      'Can we discuss a pilot? & next steps',
    );
    expect(contactHref('iqpublish')).toBe('/contact/?inquiry=iqpublish');
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
