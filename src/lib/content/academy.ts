import { z } from 'zod';
import data from '../../content/academy.json';
import { text } from './schema';
const statement = z.object({ title: text, description: text });
const section = z.object({ eyebrow: text, title: text });
export const academySchema = z.object({
  hero: section.extend({ description: text, action: text }),
  values: section.extend({
    paragraphs: z.array(text).length(2),
    items: z.array(statement).length(3),
  }),
  learning: z.object({
    title: text,
    areas: z
      .array(z.object({ title: text, items: z.array(text).length(3) }))
      .length(4),
  }),
  method: section.extend({ steps: z.array(statement).length(4) }),
  experience: section.extend({
    description: text,
    items: z.array(text).length(6),
  }),
  audience: section.extend({ items: z.array(statement).length(3) }),
  objectives: section.extend({
    description: text,
    items: z.array(text).length(5),
  }),
  finalAction: statement.extend({ action: text }),
});
export const academy = academySchema.parse(data);
