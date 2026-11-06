import { z } from 'zod';
import data from '../../content/seo.json';
const metadata = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
});
export const seoSchema = z.object({
  home: metadata,
  contact: metadata,
  stylepulse: metadata,
  iqpublish: metadata,
  whitepapers: metadata,
  paper_aec: metadata,
  paper_java: metadata,
  paper_retail: metadata,
});
export const seo = seoSchema.parse(data);
