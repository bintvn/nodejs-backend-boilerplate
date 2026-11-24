import { DataSource } from 'typeorm';
import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME,
  IS_DEV,
} from '../constants.js';
import seeds from './seeds/index.js';
import { ModuleUserRoleEntity } from '../common/modules/module-user-role/module-user-role.entity.js';
import { ModuleEntity } from '../common/modules/modules/module.entity.js';
import { RoleEntity } from '../common/modules/role/role.entity.js';
import { SessionEntity } from '../common/modules/session/session.entity.js';
import { UserRoleEntity } from '../common/modules/user-role/user-role.entity.js';
import { UserEntity } from '../common/modules/user/user.entity.js';

export const entities = [
  ModuleEntity,
  ModuleUserRoleEntity,
  RoleEntity,
  SessionEntity,
  UserEntity,
  UserRoleEntity,
];

const dbVirtualOffice = new DataSource({
  type: 'mysql',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities,
  logging: false,
  synchronize: false,
  timezone: 'Z',
});

const initDB = async () => {
  console.log('Connecting to database...');
  await dbVirtualOffice.initialize();
  console.log('Database connected');

  if (IS_DEV) {
    console.log('Synchronizing database...');
    await dbVirtualOffice.synchronize();
    console.log('Database synchronized');
  }

  await seeds();
};
export { dbVirtualOffice, initDB };
