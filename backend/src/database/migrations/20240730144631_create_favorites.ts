import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('favorites', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.integer('pokemon_id').unsigned().notNullable();
    table.boolean('is_favorite').notNullable();
    table.foreign('user_id').references('users.id');
    table.foreign('pokemon_id').references('pokemons.id');
    table.unique(['user_id', 'pokemon_id']);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('favorites');
}
