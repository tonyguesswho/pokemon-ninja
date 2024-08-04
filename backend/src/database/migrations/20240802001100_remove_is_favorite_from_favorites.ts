import { Knex } from 'knex';
export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('favorites', (table) => {
    table.dropColumn('is_favorite');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('favorites', (table) => {
    table.boolean('is_favorite').notNullable().defaultTo(true);
  });
}
