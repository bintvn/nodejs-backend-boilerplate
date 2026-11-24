import { Not } from 'typeorm';
import { ModuleUserRoleEntity } from '../../common/modules/module-user-role/module-user-role.entity.js';
import { ModuleEntity } from '../../common/modules/modules/module.entity.js';
import { dbVirtualOffice } from '../index.js';
import { UserRoleEntity } from '../../common/modules/user-role/user-role.entity.js';
import { ADMIN_EMAIL } from '../../constants.js';
import { InternalServerError } from '../../common/errors.js';

const moduleUserRolesSeed = async () => {
  if (!ADMIN_EMAIL?.trim())
    throw new InternalServerError(
      'ADMIN_EMAIL is not defined in constants/environment.',
    );

  const normalizedEmail = ADMIN_EMAIL.trim().toLowerCase();

  await dbVirtualOffice.transaction(async (manager) => {
    const moduleRepository = manager.getRepository(ModuleEntity);
    const moduleUserRolesRepository =
      manager.getRepository(ModuleUserRoleEntity);
    const userRoleRepository = manager.getRepository(UserRoleEntity);

    const adminUserRole = await userRoleRepository.findOne({
      where: {
        user: { email: normalizedEmail },
        role: { slug: 'admin' },
      },
      select: { id: true },
    });

    if (!adminUserRole) {
      console.warn(
        `[Seed] Admin user role for "${normalizedEmail}" not found. Skipping sync.`,
      );
      return;
    }

    const staleAdminUserRoles = await userRoleRepository.find({
      where: {
        id: Not(adminUserRole.id),
        role: { slug: 'admin' },
      },
      select: { id: true },
    });

    if (staleAdminUserRoles.length > 0) {
      const staleIds = staleAdminUserRoles.map((ur) => ur.id);
      await moduleUserRolesRepository
        .createQueryBuilder()
        .delete()
        .from(ModuleUserRoleEntity)
        .where('userRole IN (:...staleIds)', { staleIds })
        .execute();
    }

    const modules = await moduleRepository.find({
      select: { id: true },
    });

    if (modules.length === 0) return;

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
        module: { id: m.id },
        userRole: { id: adminUserRole.id },
      }));

    if (adminModuleUserRolesToInsert.length > 0) {
      await moduleUserRolesRepository
        .createQueryBuilder()
        .insert()
        .into(ModuleUserRoleEntity)
        .values(adminModuleUserRolesToInsert)
        .orIgnore()
        .execute();
    }
  });
};

export default moduleUserRolesSeed;
