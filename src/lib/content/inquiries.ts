import { z } from 'zod';
import data from '../../content/inquiries.json';
import { text, inquiryIdSchema } from './schema';
export const inquiriesSchema = z
  .array(
    z.object({
      id: inquiryIdSchema,
      kind: z.enum(['service', 'product', 'general']),
      label: text,
      subject: text,
      productName: text.optional(),
    }),
  )
  .min(1)
  .superRefine((items, context) => {
    for (const id of inquiryIdSchema.options)
      if (items.filter((item) => item.id === id).length !== 1)
        context.addIssue({
          code: 'custom',
          message: `Provide exactly one inquiry for ${id}`,
        });
    items.forEach((item, index) => {
      if (item.kind === 'product' && !item.productName)
        context.addIssue({
          code: 'custom',
          path: [index, 'productName'],
          message: 'A product inquiry needs a product name',
        });
    });
  });
export const inquiries = inquiriesSchema.parse(data);
export type InquiryId = z.infer<typeof inquiryIdSchema>;
export function getInquiry(id: unknown) {
  return (
    inquiries.find((item) => item.id === id) ??
    inquiries.find((item) => item.id === 'general')!
  );
}
