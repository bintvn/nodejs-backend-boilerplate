import { dbVirtualOffice } from './db/index.js';
import { UserEntity } from './db/entities/user.entity.js';
import UserService from './modules/user/user.service.js';
import UserController from './modules/user/user.controller.js';
import { UserRoleEntity } from './db/entities/user-role.entity.js';
import UserRoleService from './modules/user-role/user-role.service.js';
import UserRoleController from './modules/user-role/user-role.controller.js';
import { ModuleEntity } from './db/entities/module.entity.js';
import ModuleService from './modules/modules/module.service.js';
import ModuleController from './modules/modules/module.controller.js';
import ModuleRoleService from './modules/module-user-role/module-user-role.service.js';
import { ModuleUserRoleEntity } from './db/entities/module-user-role.entity.js';
import ModuleUserRoleController from './modules/module-user-role/module-user-role.controller.js';
import RoleService from './modules/role/role.service.js';
import { RoleEntity } from './db/entities/role.entity.js';
import RoleController from './modules/role/role.controller.js';

const moduleService = new ModuleService(
  dbVirtualOffice.getRepository(ModuleEntity),
);
const moduleController = new ModuleController(moduleService);

const roleService = new RoleService(dbVirtualOffice.getRepository(RoleEntity));
const roleController = new RoleController(roleService);

const userService = new UserService(dbVirtualOffice.getRepository(UserEntity));
const userController = new UserController(userService);

const userRoleService = new UserRoleService(
  dbVirtualOffice.getRepository(UserRoleEntity),
  {
    userService,
  },
);
const userRoleController = new UserRoleController(userRoleService);

const moduleUserRoleService = new ModuleRoleService(
  dbVirtualOffice.getRepository(ModuleUserRoleEntity),
  { userRole: userRoleService, module: moduleService },
);
const moduleUserRoleController = new ModuleUserRoleController(
  moduleUserRoleService,
);

export {
  moduleController,
  moduleUserRoleController,
  roleController,
  userController,
  userRoleController,
};
