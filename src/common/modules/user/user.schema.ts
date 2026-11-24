import { z } from 'zod';

const name = z
  .string()
  .min(1)
  .max(255)
  .refine((value) => value.trim().length > 0);
const email = z.string().trim().toLowerCase().max(255).check(z.email());
const password = z
  .string()
  .min(1)
  .max(255)
  .refine((value) => value.trim().length > 0, {
    message: 'Password must contain a non-whitespace character',
  });
const roleId = z.uuid();

export const createUserSchema = z.strictObject({
  isEmailVerified: z.boolean().optional(),
  name,
  email,
  password,
  roleId,
});
export const updateUserSchema = createUserSchema.partial();
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
