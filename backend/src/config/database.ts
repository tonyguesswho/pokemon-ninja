import Knex from 'knex';
import { Model } from 'objection';
import knexConfig from '../../knexfile';

const environment = process.env.NODE_ENV || 'development';
const connectionConfig = knexConfig[environment];

if (!connectionConfig) {
  throw new Error(
    `No database configuration found for environment: ${environment}`,
  );
}

const knex = Knex(connectionConfig);
Model.knex(knex);

export { knex };
