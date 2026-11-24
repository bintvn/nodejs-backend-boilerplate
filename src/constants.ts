export const NODE_ENV = process.env.NODE_ENV || 'development';
export const IS_DEV = NODE_ENV === 'development';

if (IS_DEV) {
  process.loadEnvFile('.env.dev');
} else {
  process.loadEnvFile('.env');
}

export const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
export const HOST = process.env.HOST || 'localhost';

export const IS_PROD = NODE_ENV === 'production';
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_PORT = process.env.DB_PORT
  ? parseInt(process.env.DB_PORT)
  : 3306;
export const DB_NAME = process.env.DB_NAME || 'virtual_office';
export const DB_USERNAME = process.env.DB_USERNAME || 'root';
export const DB_PASSWORD = process.env.DB_PASSWORD || '';
export const REDIRECT_TRAILING_SLASH =
  process.env.REDIRECT_TRAILING_SLASH === 'true';
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'secret';
export const JWT_ACCESS_EXPIRES_IN_SECOND = process.env
  .JWT_ACCESS_EXPIRES_IN_SECOND
  ? parseInt(process.env.JWT_ACCESS_EXPIRES_IN_SECOND)
  : 300;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'secret';
export const JWT_REFRESH_EXPIRES_IN_SECOND = process.env
  .JWT_REFRESH_EXPIRES_IN_SECOND
  ? parseInt(process.env.JWT_REFRESH_EXPIRES_IN_SECOND)
  : 86400 * 7;
export const JWT_ISSUER = process.env.JWT_ISSUER || '';
export const JWT_AUDIENCE = process.env.JWT_AUDIENCE || '';
