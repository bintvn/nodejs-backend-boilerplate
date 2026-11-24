import { baseDto } from '../../base.dto.js';
import { InternalServerError } from '../../errors.js';
import { roleDto } from '../role/role.dto.js';
import { userDto } from '../user/user.dto.js';
import type { UserRoleEntity } from './user-role.entity.js';

export const userRoleDto = (userRole: UserRoleEntity) => {
  if (!userRole.user)
    throw new InternalServerError('`userRole.user` is null or undefined');

  if (!userRole.role)
    throw new InternalServerError('`userRole.role` is null or undefined');

  return {
    ...baseDto(userRole),
    user: userDto(userRole.user),
    role: roleDto(userRole.role),
  };
};
