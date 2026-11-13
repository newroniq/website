import { z } from 'zod';
import data from '../../content/research.json';
import { referenceSchema, text } from './schema';
export const paperIdSchema = z.enum([
  'paper-aec',
  'paper-java',
  'paper-retail',
]);
export const paperSchema = z.object({
  id: paperIdSchema,
  category: text,
  title: text,
  description: text,
  intro: text,
  references: z.array(referenceSchema).min(1),
  author: text.optional(),
  publishedOn: z.iso.date().optional(),
  sections: z.array(z.object({ heading: text, body: text })).min(1),
});
export const researchSchema = z
  .object({
    eyebrow: text,
    title: text,
    readLabel: text,
    referencesHeading: text,
    cta: text,
    papers: z.array(paperSchema).length(paperIdSchema.options.length),
  })
  .refine(
    (value) =>
      new Set(value.papers.map((paper) => paper.id)).size ===
      paperIdSchema.options.length,
    { message: 'Provide every research paper exactly once', path: ['papers'] },
  );
export const research = researchSchema.parse(data);
export type PaperId = z.infer<typeof paperIdSchema>;
export type Paper = z.infer<typeof paperSchema>;
