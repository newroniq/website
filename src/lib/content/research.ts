import { z } from 'zod';
import data from '../../content/research.json';
const text = z.string().trim().min(1);
export const researchSchema = z
  .object({
    eyebrow: text,
    title: text,
    readLabel: text,
    papers: z
      .array(
        z.object({
          id: z.enum(['paper-aec', 'paper-java', 'paper-retail']),
          category: text,
          title: text,
          description: text,
          intro: text,
          sections: z.array(z.object({ heading: text, body: text })).min(1),
        }),
      )
      .min(1),
  })
  .refine(
    (value) =>
      new Set(value.papers.map((paper) => paper.id)).size ===
      value.papers.length,
    { message: 'Research paper IDs must be unique', path: ['papers'] },
  );
export const research = researchSchema.parse(data);
