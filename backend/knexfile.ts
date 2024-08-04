import type { Knex } from 'knex';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

const defaultConfig: Knex.Config = {
  client: 'pg',
  migrations: {
    directory: path.join(__dirname, 'src', 'database', 'migrations'),
  },
  seeds: {
    directory: path.join(__dirname, 'src', 'database', 'seeds'),
  },
  pool: {
    min: 2,
    max: 10,
  },
};

const config: { [key: string]: Knex.Config } = {
  development: {
    ...defaultConfig,
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
  },
  test: {
    ...defaultConfig,
    client: 'pg',
    connection: {
      host: process.env.TEST_DB_HOST,
      port: parseInt(process.env.TEST_DB_PORT || '5432'),
      user: process.env.TEST_DB_USER,
      password: process.env.TEST_DB_PASSWORD,
      database: process.env.TEST_DB_NAME,
    },
  },
  production: {
    ...defaultConfig,
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 20,
    },
  },
};

export default config;
