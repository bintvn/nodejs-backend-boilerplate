import { In, type DeepPartial } from 'typeorm';
import { dbVirtualOffice } from '../index.js';
import { RoleEntity } from '../../common/modules/role/role.entity.js';

const newRoles: DeepPartial<RoleEntity>[] = [
  {
    name: 'Administrator',
    slug: 'admin',
    description: 'Administrator role',
  },
  {
    name: 'User',
    slug: 'user',
    description: 'User role',
  },
];

const roleSeed = async () => {
  const roleRepository = dbVirtualOffice.getRepository(RoleEntity);
  const existingUserRoles = await roleRepository.find({
    where: {
      slug: In(newRoles.map((m) => m.slug)),
    },
  });

  const existingSlugs = new Set(existingUserRoles.map((m) => m.slug));
  const modulesToInsert = newRoles.filter(
    (m) => m.slug && !existingSlugs.has(m.slug),
  );

  if (modulesToInsert.length > 0) {
    await roleRepository.save(modulesToInsert);
  }
};

export default roleSeed;
