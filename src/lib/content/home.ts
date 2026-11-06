import { z } from 'zod';
import data from '../../content/home.json';
const text = z.string().trim().min(1);
export const homeSchema = z.object({
  focus: z
    .array(z.object({ label: text, title: text, description: text }))
    .min(1),
  capabilities: z
    .array(
      z.object({
        title: text,
        category: text,
        description: text,
        benefits: z.array(text).min(1),
        action: z.object({
          label: text,
          href: z.literal('/contact/'),
        }),
      }),
    )
    .min(1),
});
export const home = homeSchema.parse(data);
export type FocusArea = z.infer<typeof homeSchema>['focus'][number];
export type Capability = z.infer<typeof homeSchema>['capabilities'][number];
