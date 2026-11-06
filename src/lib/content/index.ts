import { z } from 'zod';
import pagesData from '../../content/pages.json';
import siteData from '../../content/site.json';
const text = z.string().trim().min(1);
const href = z
  .string()
  .regex(
    /^\/(?!\/)(?:[a-zA-Z0-9_/-]*)(?:#[a-zA-Z0-9_-]+)?$/,
    'Use a local absolute path or anchor',
  );
export const siteSchema = z.object({
  footer: z.object({
    aboutHeading: text,
    about: text,
    links: z.array(
      z.object({
        label: text,
        href: z
          .string()
          .refine(
            (value) =>
              value === '#' ||
              /^\/(?!\/)/.test(value) ||
              /^https:\/\//.test(value),
            'Use a local link, #, or HTTPS URL',
          ),
      }),
    ),
    copyright: text,
  }),
  favicon: z.string().regex(/^\/[a-zA-Z0-9_./-]+\.svg$/),
  name: text,
  url: z.url(),
  email: z.email(),
  gtmId: z.string().regex(/^GTM-[A-Z0-9]+$/),
  navigation: z.array(z.object({ label: text, href })).min(1),
  contactLabel: text,
  menuLabel: text,
  skipLabel: text,
  backToPapers: text,
  form: z.object({
    name: text,
    email: text,
    type: text,
    message: text,
    submit: text,
    notice: text,
    handoff: text,
  }),
  notFound: z.object({ title: text, description: text, homeLabel: text }),
});
// The inferred shape makes removed/renamed content keys TypeScript errors as well.
function validateCopy<T extends Record<string, Record<string, string>>>(
  data: T,
): T {
  z.record(text, z.record(text, text)).parse(data);
  return data;
}
export const copy = validateCopy(pagesData);
export const site = siteSchema.parse(siteData);
export type SiteContent = z.infer<typeof siteSchema>;
