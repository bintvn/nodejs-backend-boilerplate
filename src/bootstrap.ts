import { dbVirtualOffice } from './db/index.js';
import { UserEntity } from './common/modules/user/user.entity.js';
import UserService from './common/modules/user/user.service.js';
import UserController from './common/modules/user/user.controller.js';
import { UserRoleEntity } from './common/modules/user-role/user-role.entity.js';
import UserRoleService from './common/modules/user-role/user-role.service.js';
import UserRoleController from './common/modules/user-role/user-role.controller.js';
import { ModuleEntity } from './common/modules/modules/module.entity.js';
import ModuleService from './common/modules/modules/module.service.js';
import ModuleController from './common/modules/modules/module.controller.js';
import ModuleUserRoleService from './common/modules/module-user-role/module-user-role.service.js';
import { ModuleUserRoleEntity } from './common/modules/module-user-role/module-user-role.entity.js';
import ModuleUserRoleController from './common/modules/module-user-role/module-user-role.controller.js';
import RoleService from './common/modules/role/role.service.js';
import { RoleEntity } from './common/modules/role/role.entity.js';
import RoleController from './common/modules/role/role.controller.js';
import { AuthService } from './common/modules/auth/auth.service.js';
import {
  JWT_ACCESS_EXPIRES_IN_SECOND,
  JWT_ACCESS_SECRET,
  JWT_AUDIENCE,
  JWT_ISSUER,
  JWT_REFRESH_EXPIRES_IN_SECOND,
  JWT_REFRESH_SECRET,
} from './constants.js';
import SessionService from './common/modules/session/session.service.js';
import { SessionEntity } from './common/modules/session/session.entity.js';
import EmailService from './common/modules/email/email.service.js';
import { EmailEntity } from './common/modules/email/email.entity.js';

const moduleService = new ModuleService(
  dbVirtualOffice.getRepository(ModuleEntity),
);
const moduleController = new ModuleController(moduleService);

const roleService = new RoleService(dbVirtualOffice.getRepository(RoleEntity));
const roleController = new RoleController(roleService);

const userService = new UserService(dbVirtualOffice.getRepository(UserEntity), {
  roleService,
});
const userController = new UserController(userService);

const userRoleService = new UserRoleService(
  dbVirtualOffice.getRepository(UserRoleEntity),
);
const userRoleController = new UserRoleController(userRoleService);

const moduleUserRoleService = new ModuleUserRoleService(
  dbVirtualOffice.getRepository(ModuleUserRoleEntity),
);
const moduleUserRoleController = new ModuleUserRoleController(
  moduleUserRoleService,
);

const sessionService = new SessionService(
  dbVirtualOffice.getRepository(SessionEntity),
);

const emailService = new EmailService(
  dbVirtualOffice.getRepository(EmailEntity),
);

const authService = new AuthService({
  config: {
    accessSecret: JWT_ACCESS_SECRET,
    refreshSecret: JWT_REFRESH_SECRET,
    accessExpiresInSeconds: JWT_ACCESS_EXPIRES_IN_SECOND,
    refreshExpiresInSeconds: JWT_REFRESH_EXPIRES_IN_SECOND,
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  },
  services: {
    email: emailService,
    user: userService,
    role: roleService,
    session: sessionService,
  },
});

export {
  authService,
  moduleController,
  moduleUserRoleController,
  roleController,
  sessionService,
  userController,
  userRoleController,
};
