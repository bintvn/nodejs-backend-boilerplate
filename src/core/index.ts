import { DataSource } from 'typeorm';
import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME,
  IS_DEV,
} from './constants.js';
import seeds from './seeds/index.js';
import { ModuleEntity } from './modules/modules/module.entity.js';
import { RoleEntity } from './modules/role/role.entity.js';
import { SessionEntity } from './modules/session/session.entity.js';
import { UserRoleEntity } from './modules/user-role/user-role.entity.js';
import { UserEntity } from './modules/user/user.entity.js';
import { EmailEntity } from './modules/email/email.entity.js';
import { AccessControlEntity } from './modules/access-control/access-control.entity.js';
import { PostEntity } from '../modules/post/post.entity.js';
import { CategoryEntity } from '../modules/category/category.entity.js';
import { CategoryPostEntity } from '../modules/category/category-post.entity.js';

export const entities = [
  AccessControlEntity,
  CategoryEntity,
  CategoryPostEntity,
  EmailEntity,
  ModuleEntity,
  PostEntity,
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
