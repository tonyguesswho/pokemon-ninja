import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('pokemons', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.integer('pokedex_number').notNullable();
    table.string('image_url');
    table.integer('organization_id').unsigned().notNullable();
    table.foreign('organization_id').references('organizations.id');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('pokemons');
}
