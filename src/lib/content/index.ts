import { z } from 'zod';
import pagesData from '../../content/pages.json';
import siteData from '../../content/site.json';
import { text, localHref, httpsHref, linkSchema } from './schema';
export const siteSchema = z.object({
  name: text,
  wordmark: z.object({ primary: text, accent: text }),
  legalName: text,
  tagline: text,
  url: httpsHref,
  email: z.email(),
  company: z.object({
    number: z.string().regex(/^\d{8}$/),
    registeredIn: text,
    registeredOffice: text,
    registryUrl: httpsHref,
    verifiedOn: z.iso.date(),
    registrationLabel: text,
    numberLabel: text,
    officeLabel: text,
    registryLabel: text,
  }),
  navigation: z.array(linkSchema).min(1),
  contactLabel: text,
  menuLabel: text,
  skipLabel: text,
  backToPapers: text,
  footer: z.object({
    aboutHeading: text,
    about: text,
    navigationLabel: text,
    contactHeading: text,
    links: z.array(linkSchema).min(1),
    copyright: text,
  }),
  favicon: z.string().regex(/^\/[a-zA-Z0-9_./-]+\.svg$/),
  form: z.object({
    sensitiveNotice: text,
    privacyLabel: text,
    privacyHref: localHref,
    unavailable: text,
    fallbackLabel: text,
    success: text,
  }),
  notFound: z.object({ title: text, description: text, homeLabel: text }),
});
function validateCopy<
  T extends Record<string, Record<string, string | string[]>>,
>(data: T): T {
  z.record(text, z.record(text, z.union([text, z.array(text).min(1)]))).parse(
    data,
  );
  return data;
}
export const copy = validateCopy(pagesData);
export const site = siteSchema.parse(siteData);
export type SiteContent = z.infer<typeof siteSchema>;
