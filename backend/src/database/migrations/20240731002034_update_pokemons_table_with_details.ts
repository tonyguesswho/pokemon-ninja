import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('pokemons', function (table) {
    table.integer('height');
    table.integer('weight');
    table.integer('baseExperience');
    table.integer('pokedexNumber').notNullable();
    table.renameColumn('image_url', 'url');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('pokemons', function (table) {
    table.dropColumn('height');
    table.dropColumn('weight');
    table.dropColumn('baseExperience');
    table.dropColumn('pokedexNumber');
    table.renameColumn('url', 'image_url');
  });
}
