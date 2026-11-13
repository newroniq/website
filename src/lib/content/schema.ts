import { z } from 'zod';
export const text = z.string().trim().min(1);
export const localHref = z
  .string()
  .regex(/^\/(?!\/)[a-zA-Z0-9_/-]*(?:#[a-zA-Z0-9_-]+)?$/);
export const httpsHref = z
  .url()
  .refine((value) => new URL(value).protocol === 'https:', 'Use an HTTPS URL');
export const linkSchema = z.object({ label: text, href: localHref });
export const referenceSchema = z.object({ label: text, href: httpsHref });
export const serviceIdSchema = z.enum([
  'strategy',
  'architecture',
  'security',
  'roadmap',
]);
export const productIdSchema = z.enum([
  'doptimiser',
  'iqpublish',
  'stylepulse',
]);
export const inquiryIdSchema = z.enum([
  ...serviceIdSchema.options,
  'implementation',
  ...productIdSchema.options,
  'general',
]);
