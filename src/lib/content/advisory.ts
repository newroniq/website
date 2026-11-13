import { z } from 'zod';
import data from '../../content/advisory.json';
import { text, serviceIdSchema } from './schema';
const statement = z.object({ title: text, description: text });
export const advisorySchema = z.object({
  title: text,
  description: text,
  services: z
    .array(
      z.object({
        id: serviceIdSchema,
        title: text,
        description: text,
        problem: text,
        audience: text,
        approach: text,
        outputs: z.array(text).min(1),
      }),
    )
    .length(4)
    .refine(
      (items) => new Set(items.map((item) => item.id)).size === 4,
      'Provide every service exactly once',
    ),
  blueprint: statement.extend({
    steps: z.array(statement).length(5),
    deliverables: z.array(text).min(1),
  }),
  expertise: z.array(statement).min(1),
  engagement: text,
  faq: z.array(z.object({ question: text, answer: text })).min(1),
});
export const advisory = advisorySchema.parse(data);
export type AdvisoryService = (typeof advisory.services)[number];
