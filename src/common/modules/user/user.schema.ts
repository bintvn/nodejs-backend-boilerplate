import { z } from 'zod';
import { RoleEntity } from '../role/role.entity.js';

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
const role = RoleEntity;

export const createUserSchema = z.strictObject({
  name,
  email,
  password,
  role,
});
export const updateUserSchema = createUserSchema.partial();
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
