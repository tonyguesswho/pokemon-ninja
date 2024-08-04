import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('pokemons', function (table) {
    table.string('sprite_front');
    table.string('sprite_back');
    table.integer('stat_speed');
    table.text('description');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('pokemons', function (table) {
    table.dropColumn('sprite_front');
    table.dropColumn('sprite_back');
    table.dropColumn('stat_speed');
    table.dropColumn('description');
  });
}
