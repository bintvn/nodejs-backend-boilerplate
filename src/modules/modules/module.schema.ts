import { z } from 'zod';

const name = z
  .string()
  .min(1)
  .max(255)
  .refine((value) => value.trim().length > 0);
const slug = z
  .string()
  .max(255)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*(?![\s\S])/);

const description = z.string().optional();

export const createModuleSchema = z.strictObject({
  name,
  slug,
  description,
});
export const updateModuleSchema = createModuleSchema.partial();
export type CreateModule = z.infer<typeof createModuleSchema>;
export type UpdateModule = z.infer<typeof updateModuleSchema>;
