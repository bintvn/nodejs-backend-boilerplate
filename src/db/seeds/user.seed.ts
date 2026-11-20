import { In, type DeepPartial } from 'typeorm';
import { dbVirtualOffice } from '../index.js';
import { UserEntity } from '../entities/user.entity.js';
import { ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD } from '../../constants.js';
import { RoleEntity } from '../entities/role.entity.js';
import { UserRoleEntity } from '../entities/user-role.entity.js';
import password from '../../utils/password.util.js';

const userSeed = async () => {
  const newUsers: DeepPartial<UserEntity>[] = [
    {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: await password.hash(ADMIN_PASSWORD),
    },
  ];
  const userRepository = dbVirtualOffice.getRepository(UserEntity);
  const userRoleRepository = dbVirtualOffice.getRepository(UserRoleEntity);
  const roleRepository = dbVirtualOffice.getRepository(RoleEntity);

  const emailsToCheck = newUsers
    .map((m) => m.email)
    .filter((email): email is string => Boolean(email));

  const existingUsers =
    emailsToCheck.length > 0
      ? await userRepository.find({ where: { email: In(emailsToCheck) } })
      : [];

  const existingEmails = new Set(existingUsers.map((m) => m.email));
  const usersToInsert = newUsers.filter(
    (m) => m.email && !existingEmails.has(m.email),
  );

  const [adminRole, userRole] = await Promise.all([
    roleRepository.findOneBy({ slug: 'admin' }),
    roleRepository.findOneBy({ slug: 'user' }),
  ]);

  const ensureRole = async (user: UserEntity, role: RoleEntity | null) => {
    if (!role) return;
    const exists = await userRoleRepository.findOne({
      where: { user: { id: user.id }, role: { id: role.id } },
    });
    if (!exists) {
      await userRoleRepository.save(userRoleRepository.create({ user, role }));
    }
  };
  const existingAdminUser = existingUsers.find((u) => u.email === ADMIN_EMAIL);

  if (existingAdminUser) {
    let isChanged = false;

    if (existingAdminUser.name !== ADMIN_NAME) {
      existingAdminUser.name = ADMIN_NAME;
      isChanged = true;
    }

    if (existingAdminUser.password !== ADMIN_PASSWORD) {
      existingAdminUser.password = await password.hash(ADMIN_PASSWORD);
      isChanged = true;
    }

    if (isChanged) {
      await userRepository.save(existingAdminUser);
    }

    await ensureRole(existingAdminUser, adminRole);
    await ensureRole(existingAdminUser, userRole);
  }

  if (usersToInsert.length > 0) {
    const savedUsers = await userRepository.save(
      userRepository.create(usersToInsert),
    );

    for (const user of savedUsers) {
      if (user.email === ADMIN_EMAIL) {
        await ensureRole(user, adminRole);
        await ensureRole(user, userRole);
      }
    }
  }
};

export default userSeed;
