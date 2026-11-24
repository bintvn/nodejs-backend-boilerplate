import { z } from 'zod';

const roleId = z.uuid();
const moduleId = z.uuid();
const canRead = z.boolean();
const canCreate = z.boolean();
const canUpdate = z.boolean();
const canDelete = z.boolean();

export const createAccessControlSchema = z.strictObject({
  roleId,
  moduleId,
  canRead,
  canCreate,
  canUpdate,
  canDelete,
});
export const updateAccessControlSchema = createAccessControlSchema.partial();
export type CreateAccessControl = z.infer<typeof createAccessControlSchema>;
export type UpdateAccessControl = z.infer<typeof updateAccessControlSchema>;
