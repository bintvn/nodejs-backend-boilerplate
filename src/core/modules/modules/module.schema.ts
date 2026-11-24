import { z } from 'zod';
import { descriptionSchema } from '../../validation.js';

const name = z
  .string()
  .min(1)
  .max(255)
  .refine((value) => value.trim().length > 0);
const slug = z
  .string()
  .max(255)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*(?![\s\S])/);

export const createModuleSchema = z.strictObject({
  name,
  slug,
  description: descriptionSchema,
});
export const updateModuleSchema = createModuleSchema.partial();
export type CreateModule = z.infer<typeof createModuleSchema>;
export type UpdateModule = z.infer<typeof updateModuleSchema>;
