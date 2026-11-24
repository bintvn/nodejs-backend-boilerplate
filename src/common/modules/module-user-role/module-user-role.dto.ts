import { baseDto } from '../../base.dto.js';
import { moduleDto } from '../modules/module.dto.js';
import { userRoleDto } from '../user-role/user-role.dto.js';
import type { ModuleUserRoleEntity } from './module-user-role.entity.js';

export default function moduleUserRoleDto(moduleRole: ModuleUserRoleEntity) {
  return {
    ...baseDto(moduleRole),
    module: moduleDto(moduleRole.module),
    userRole: userRoleDto(moduleRole.userRole),
  };
}
