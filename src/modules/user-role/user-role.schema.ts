import { z } from 'zod';

const userId = z.uuid();
const roleId = z.uuid();

export const createUserRoleSchema = z.strictObject({
  userId,
  roleId,
});
export const updateUserRoleSchema = createUserRoleSchema.partial();
export type CreateUserRole = z.infer<typeof createUserRoleSchema>;
export type UpdateUserRole = z.infer<typeof updateUserRoleSchema>;
