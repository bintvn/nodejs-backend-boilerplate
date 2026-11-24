import type { DataSource } from 'typeorm';
import createAccessControlModule from './modules/access-control/index.js';
import createAuthModule from './modules/auth/index.js';
import createEmailModule from './modules/email/index.js';
import createModuleModule from './modules/modules/index.js';
import createRoleModule from './modules/role/index.js';
import createSessionModule from './modules/session/index.js';
import createUserRoleModule from './modules/user-role/index.js';
import createUserModule from './modules/user/index.js';

export type CoreContainer = ReturnType<typeof createCoreContainer>;

const createCoreContainer = (dataSource: DataSource) => {
  const accessControlModule = createAccessControlModule(dataSource);
  const emailModule = createEmailModule(dataSource);
  const moduleModule = createModuleModule(dataSource);
  const roleModule = createRoleModule(dataSource);
  const userRoleModule = createUserRoleModule(dataSource);
  const sessionModule = createSessionModule(dataSource);
  const userModule = createUserModule(dataSource, {
    roleService: roleModule.service,
  });
  const authModule = createAuthModule(dataSource, {
    emailService: emailModule.service,
    roleService: roleModule.service,
    sessionService: sessionModule.service,
    userService: userModule.service,
  });

  return {
    accessControlModule,
    authModule,
    emailModule,
    moduleModule,
    roleModule,
    userModule,
    userRoleModule,
    sessionModule,
  };
};

export default createCoreContainer;
