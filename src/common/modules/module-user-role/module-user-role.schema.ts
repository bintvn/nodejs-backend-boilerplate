import { z } from 'zod';

export const createModuleUserRoleSchema = z.strictObject({
  moduleId: z.uuid(),
  userRoleId: z.uuid(),
});
export const updateModuleUserRoleSchema = createModuleUserRoleSchema.partial();
export type CreateModuleRole = z.infer<typeof createModuleUserRoleSchema>;
export type UpdateModuleRole = z.infer<typeof updateModuleUserRoleSchema>;
