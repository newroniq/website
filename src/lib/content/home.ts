import { z } from 'zod';
import data from '../../content/home.json';
import { text, linkSchema, serviceIdSchema } from './schema';
const heading = z.object({ eyebrow: text, title: text, description: text });
export const homeSchema = z.object({
  hero: z.object({
    title: text,
    highlight: text,
    description: text,
    primaryAction: linkSchema,
    secondaryAction: linkSchema,
  }),
  outcomes: heading.extend({
    items: z
      .array(z.object({ title: text, points: z.array(text).min(1) }))
      .length(3),
  }),
  services: heading,
  capabilities: z
    .array(
      z.object({
        inquiryId: serviceIdSchema,
        category: text,
        description: text,
        benefits: z.array(text).min(1),
        actionLabel: text,
      }),
    )
    .length(4),
  about: z.object({
    eyebrow: text,
    title: text,
    description: text,
    philosophy: text,
    principles: z.array(z.object({ title: text, description: text })).min(1),
  }),
  approach: z.object({
    eyebrow: text,
    title: text,
    steps: z
      .array(z.object({ title: text, activity: text, output: text }))
      .length(4),
    outputLabel: text,
  }),
  insights: heading.extend({ allLabel: text }),
  products: heading.extend({ actionLabel: text }),
  finalAction: z.object({ title: text, description: text, action: linkSchema }),
});
export const home = homeSchema.parse(data);
export type Capability = z.infer<typeof homeSchema>['capabilities'][number];
