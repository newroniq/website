import { z } from 'zod';
import data from '../../content/privacy.json';
import { text, referenceSchema } from './schema';
export const privacySchema = z.object({
  title: text,
  updatedLabel: text,
  updatedOn: z.iso.date(),
  intro: text,
  sections: z
    .array(
      z.object({
        heading: text,
        paragraphs: z.array(text).min(1),
        links: z.array(referenceSchema).optional(),
      }),
    )
    .min(1),
});
export const privacy = privacySchema.parse(data);
