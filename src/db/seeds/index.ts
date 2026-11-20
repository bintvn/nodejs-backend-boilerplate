import moduleUserRolesSeed from './module-user-role.seed.js';
import moduleSeed from './module.seed.js';
import roleSeed from './role.seed.js';
import userSeed from './user.seed.js';

export default async function seeds() {
  await moduleSeed();
  await roleSeed();
  await userSeed();
  await moduleUserRolesSeed();
}
