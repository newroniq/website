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
        cardDescription: text,
        capabilities: z.array(text).length(3),
        whatWeDo: text,
        whatYouReceive: text,
      }),
    )
    .length(6)
    .refine(
      (items) => new Set(items.map((item) => item.id)).size === 6,
      'Provide every service exactly once',
    ),
  blueprint: statement.extend({ deliverables: z.array(text).length(5) }),
});
export const advisory = advisorySchema.parse(data);
export type AdvisoryService = (typeof advisory.services)[number];
