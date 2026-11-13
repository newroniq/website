import { z } from 'zod';
import data from '../../content/home.json';
import { text, linkSchema } from './schema';
const heading = z.object({ title: text, description: text });
export const homeSchema = z.object({
  hero: z.object({
    eyebrow: text,
    title: text,
    highlight: text,
    description: text,
    primaryAction: text,
    secondaryAction: linkSchema,
  }),
  challenge: heading.extend({ eyebrow: text, items: z.array(heading).min(1) }),
  strengths: heading.extend({ eyebrow: text }),
  audience: heading.extend({ items: z.array(text).min(1) }),
  insights: heading.extend({ eyebrow: text, allLabel: text }),
  products: heading.extend({ eyebrow: text }),
  finalAction: heading.extend({ action: text }),
});
export const home = homeSchema.parse(data);
