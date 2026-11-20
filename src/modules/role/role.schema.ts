import { z } from 'zod';
import { descriptionSchema } from '../../common/validation.js';

const name = z
  .string()
  .min(1)
  .max(255)
  .refine((value) => value.trim().length > 0);
const slug = z
  .string()
  .max(255)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*(?![\s\S])/);

export const createRoleSchema = z.strictObject({
  name,
  slug,
  description: descriptionSchema,
});
export const updateRoleSchema = createRoleSchema.partial();
export type CreateRole = z.infer<typeof createRoleSchema>;
export type UpdateRole = z.infer<typeof updateRoleSchema>;
