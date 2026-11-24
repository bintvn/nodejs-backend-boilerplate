import accessControlSeed from './access-control.seed.js';
import moduleSeed from './module.seed.js';
import roleSeed from './role.seed.js';

export default async function seeds() {
  await moduleSeed();
  await roleSeed();
  await accessControlSeed();
}
