import type { RoleEntity } from './role.entity.js';

export const roleDto = (role: RoleEntity) => ({
  id: role.id,
  createdAt: role.createdAt,
  updatedAt: role.updatedAt,
  disabled: role.disabled,
  name: role.name,
  slug: role.slug,
  description: role.description,
});
