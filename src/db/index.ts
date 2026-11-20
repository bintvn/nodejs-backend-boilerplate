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
import { DatabaseError } from '../common/errors.js';
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
  try {
    console.log('Connecting to database...');
    await dbVirtualOffice.initialize();
    console.log('Database connected');

    if (IS_DEV) {
      console.log('Synchronizing database...');
      await dbVirtualOffice.synchronize();
      console.log('Database synchronized');
    }

    await seeds();
  } catch (error) {
    if (error instanceof Error) {
      if ('code' in error && typeof error.code === 'string') {
        if (
          ['ER_BAD_DB_ERROR', 'ER_ACCESS_DENIED_ERROR'].includes(error.code)
        ) {
          const newError = new DatabaseError(
            error.message,
            'Wrong database credentials',
            error.code,
          );
          console.error(newError);

          process.exit(1);
        }
      }
    }

    console.log('initDB', error);
  }
};
export { dbVirtualOffice, initDB };
