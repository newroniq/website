import { z } from 'zod';
import data from '../../content/links.json';
// Parse without importing routes at runtime to avoid a page/content cycle.
const destination = z
  .string()
  .regex(/^\/(?!\/)(?:[a-zA-Z0-9_/-]*)(?:#[a-zA-Z0-9_-]+)?$/);
export const linksSchema = z.record(
  z.string(),
  z.record(z.string(), destination),
);
linksSchema.parse(data);
export const links = data;
