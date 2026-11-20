import { In } from 'typeorm';
import { dbVirtualOffice } from '../index.js';
import { UserEntity } from '../entities/user.entity.js';
import { ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD } from '../../constants.js';
import { RoleEntity } from '../entities/role.entity.js';
import { UserRoleEntity } from '../entities/user-role.entity.js';
import password from '../../utils/password.util.js';

const userSeed = async () => {
  const userRepository = dbVirtualOffice.getRepository(UserEntity);
  const userRoleRepository = dbVirtualOffice.getRepository(UserRoleEntity);
  const roleRepository = dbVirtualOffice.getRepository(RoleEntity);

  const email = ADMIN_EMAIL.trim().toLowerCase();
  const admin =
    (await userRepository.findOneBy({ email })) ??
    (await userRepository.save(
      userRepository.create({
        name: ADMIN_NAME,
        email,
        password: await password.hash(ADMIN_PASSWORD),
      }),
    ));

  const roles = await roleRepository.findBy({ slug: In(['admin', 'user']) });
  const assignments = await userRoleRepository.find({
    where: { user: { id: admin.id } },
    relations: { role: true },
  });
  const assignedRoleIds = new Set(assignments.map(({ role }) => role.id));
  const missingAssignments = roles
    .filter(({ id }) => !assignedRoleIds.has(id))
    .map((role) => ({ user: { id: admin.id }, role: { id: role.id } }));

  if (missingAssignments.length > 0) {
    await userRoleRepository.insert(missingAssignments);
  }
};

export default userSeed;
