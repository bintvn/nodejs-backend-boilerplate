import { In } from 'typeorm';
import { AccessControlEntity } from '../../core/modules/access-control/access-control.entity.js';
import { dbVirtualOffice } from '../index.js';
import { ModuleEntity } from '../../core/modules/modules/module.entity.js';
import { RoleEntity } from '../../core/modules/role/role.entity.js';

export default async function accessControlSeed() {
  await dbVirtualOffice.manager.transaction(async (manager) => {
    const accessControlRepository = manager.getRepository(AccessControlEntity);
    const moduleRepository = manager.getRepository(ModuleEntity);
    const roleRepository = manager.getRepository(RoleEntity);

    const [accessControls, roles, modules] = await Promise.all([
      accessControlRepository.find({
        relations: {
          role: true,
          module: true,
        },
      }),
      roleRepository.find(),
      moduleRepository.find(),
    ]);

    const validRoleIds = new Set(roles.map((role) => role.id));
    const validModuleIds = new Set(modules.map((mod) => mod.id));

    const existingKeys = new Set<string>();
    const orphanIds: string[] = [];

    for (const ac of accessControls) {
      const roleId = ac.role?.id;
      const moduleId = ac.module?.id;

      if (
        !roleId ||
        !moduleId ||
        !validRoleIds.has(roleId) ||
        !validModuleIds.has(moduleId)
      ) {
        orphanIds.push(ac.id);
        continue;
      }

      existingKeys.add(`${roleId}:${moduleId}`);
    }

    if (orphanIds.length > 0) {
      await accessControlRepository.delete({ id: In(orphanIds) });
    }

    const newAccessControls: AccessControlEntity[] = [];

    for (const role of roles) {
      for (const mod of modules) {
        const key = `${role.id}:${mod.id}`;

        if (!existingKeys.has(key)) {
          newAccessControls.push(
            accessControlRepository.create({
              role,
              module: mod,
            }),
          );
        }
      }
    }

    if (newAccessControls.length > 0) {
      await accessControlRepository.save(newAccessControls);
    }
  });
}
