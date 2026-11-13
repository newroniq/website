import { z } from 'zod';
import data from '../../content/products.json';
import { text, productIdSchema } from './schema';
export const productsSchema = z
  .object({
    eyebrow: text,
    backLabel: text,
    problemLabel: text,
    directionLabel: text,
    boundaryTitle: text,
    boundaryDescription: text,
    products: z
      .array(
        z.object({
          id: productIdSchema,
          name: text,
          status: text,
          statusDescription: text,
          secondaryAction: text.optional(),
          summary: text,
          description: text,
          problem: text,
          directions: z
            .array(z.object({ title: text, description: text }))
            .min(1),
          interestTitle: text,
          interestDescription: text,
          interestAction: text,
        }),
      )
      .length(3),
  })
  .refine(
    (value) =>
      new Set(value.products.map((item) => item.id)).size ===
      value.products.length,
    { message: 'Product IDs must be unique', path: ['products'] },
  );
export const products = productsSchema.parse(data);
export type ProductId = z.infer<typeof productIdSchema>;
