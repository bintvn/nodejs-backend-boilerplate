import { dbVirtualOffice } from './index.js';
import createAccessControlModule from './modules/access-control/index.js';
import createAuthModule from './modules/auth/index.js';
import createEmailModule from './modules/email/index.js';
import createModuleModule from './modules/modules/index.js';
import createRoleModule from './modules/role/index.js';
import createSessionModule from './modules/session/index.js';
import createUserRoleModule from './modules/user-role/index.js';
import createUserModule from './modules/user/index.js';

export type Container = ReturnType<typeof createContainer>;

const createContainer = () => {
  const accessControlModule = createAccessControlModule(dbVirtualOffice);

  const emailModule = createEmailModule(dbVirtualOffice);
  const moduleModule = createModuleModule(dbVirtualOffice);
  const roleModule = createRoleModule(dbVirtualOffice);
  const userRoleModule = createUserRoleModule(dbVirtualOffice);
  const sessionModule = createSessionModule(dbVirtualOffice);
  const userModule = createUserModule(dbVirtualOffice, {
    roleService: roleModule.service,
  });
  const authModule = createAuthModule(dbVirtualOffice, {
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

export default createContainer;
