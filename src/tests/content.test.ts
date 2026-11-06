import { describe, expect, it } from 'vitest';
import { site, siteSchema } from '../lib/content';
import { home, homeSchema } from '../lib/content/home';
import { seo, seoSchema } from '../lib/content/seo';
import { normalizeBase, url } from '../lib/urls';
describe('content contract', () => {
  it('rejects invalid emails, empty copy, unsafe navigation and invalid metadata', () => {
    expect(siteSchema.safeParse({ ...site, email: 'invalid' }).success).toBe(
      false,
    );
    expect(siteSchema.safeParse({ ...site, name: ' ' }).success).toBe(false);
    expect(
      siteSchema.safeParse({
        ...site,
        navigation: [{ label: 'x', href: 'javascript:alert(1)' }],
      }).success,
    ).toBe(false);
    expect(
      seoSchema.safeParse({ ...seo, contact: { title: '', description: 'x' } })
        .success,
    ).toBe(false);
  });
  it('requires valid populated card content and keeps editorial ordering', () => {
    expect(homeSchema.safeParse({ ...home, capabilities: [] }).success).toBe(
      false,
    );
    expect(
      homeSchema.safeParse({ ...home, focus: [{ title: 'Missing fields' }] })
        .success,
    ).toBe(false);
    expect(home.capabilities.map((item) => item.title)).toEqual([
      'Enterprise Architecture & Advisory',
      'Cloud & Software Engineering',
      'AI, Data & Intelligent Automation',
      'Digital Experience Engineering',
    ]);
  });
  it('rejects ambiguous or unsafe deployment bases', () => {
    expect(normalizeBase('/website/')).toBe('/website/');
    for (const path of [
      '//example.com/',
      '/\\example.com',
      'javascript:alert(1)',
    ])
      expect(() => url(path)).toThrow();
    for (const value of ['website', '//evil.com/', '/website', '/../'])
      expect(() => normalizeBase(value)).toThrow();
  });
});
