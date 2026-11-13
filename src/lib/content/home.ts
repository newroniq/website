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
  services: z.object({ eyebrow: text, title: text }),
  approach: z.object({
    eyebrow: text,
    title: text,
    steps: z.array(heading).length(3),
    outcome: text,
  }),
  products: heading.extend({ eyebrow: text }),
  finalAction: heading.extend({ action: text }),
});
export const home = homeSchema.parse(data);
