import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('pokemons', function (table) {
    table.dropColumn('pokedexNumber');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('pokemons', function (table) {
    table.integer('pokedexNumber');
  });
}
