import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('pokemons', function (table) {
    table.dropColumn('pokedex_number');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('pokemons', function (table) {
    table.integer('pokedex_number');
  });
}
