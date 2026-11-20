import { ModuleUserRoleEntity } from '../entities/module-user-role.entity.js';
import { ModuleEntity } from '../entities/module.entity.js';
import { dbVirtualOffice } from '../index.js';
import { UserRoleEntity } from '../entities/user-role.entity.js';
import { ADMIN_EMAIL } from '../../constants.js';

const moduleUserRolesSeed = async () => {
  const moduleRepository = dbVirtualOffice.getRepository(ModuleEntity);
  const moduleUserRolesRepository =
    dbVirtualOffice.getRepository(ModuleUserRoleEntity);
  const userRoleRepository = dbVirtualOffice.getRepository(UserRoleEntity);

  const adminUserRole = await userRoleRepository.findOneBy({
    user: { email: ADMIN_EMAIL.trim().toLowerCase() },
    role: { slug: 'admin' },
  });
  if (!adminUserRole) return;

  const modules = await moduleRepository.find();

  const existingAdminModuleUserRoles = await moduleUserRolesRepository.find({
    where: {
      userRole: { id: adminUserRole.id },
    },
    relations: {
      module: true,
    },
  });

  const existingModuleIds = new Set(
    existingAdminModuleUserRoles.map((item) => item.module.id),
  );

  const adminModuleUserRolesToInsert = modules
    .filter((m) => !existingModuleIds.has(m.id))
    .map((m) => ({
      module: m,
      userRole: adminUserRole,
    }));

  if (adminModuleUserRolesToInsert.length > 0) {
    await moduleUserRolesRepository.insert(adminModuleUserRolesToInsert);
  }
};

export default moduleUserRolesSeed;
