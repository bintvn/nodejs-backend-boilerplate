import { DataSource } from 'typeorm';
import entities from './entities/index.js';
import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME,
  IS_DEV,
} from '../constants.js';
import seeds from './seeds/index.js';

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
