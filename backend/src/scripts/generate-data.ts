// src/scripts/generate-data.ts

import { knex } from '../config/database';
import { Organization } from '../models/organization.model';
import { User } from '../models/user.model';
import { Pokemon } from '../models/pokemon.model';
import { PokemonApiService } from '../services/pokemon-api.service';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';
import { logger } from '../config/logger';

dotenv.config();

const POKEMON_API_URL =
  process.env.POKEMON_API_URL || 'https://pokeapi.co/api/v2';
const POKEMON_LIMIT = parseInt(process.env.POKEMON_LIMIT || '100', 10);
const NUM_ORGANIZATIONS = parseInt(process.env.NUM_ORGANIZATIONS || '10', 10);
const NUM_USERS_PER_ORG = parseInt(process.env.NUM_USERS_PER_ORG || '10', 10);
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || '100', 10);

async function clearDatabase() {
  try {
    await knex('pokemons').del();
    await knex('users').del();
    await knex('organizations').del();
    logger.info('Database cleared');
  } catch (error) {
    logger.error('Error clearing database:', error);
    throw error;
  }
}

export async function generateData(pokemonApiService: PokemonApiService) {
  try {
    await clearDatabase();

    // Generate organizations
    const organizations = await Organization.query().insert(
      Array.from({ length: NUM_ORGANIZATIONS }, () => ({
        name: faker.company.name(),
      })),
    );

    logger.info(`Generated ${organizations.length} organizations`);

    // Generate users
    for (const org of organizations) {
      const users = Array.from({ length: NUM_USERS_PER_ORG }, () => ({
        email: faker.internet.email(),
        password: bcrypt.hashSync('password123', 10),
        organization_id: org.id,
      }));

      await User.query().insert(users);
    }

    logger.info(`Generated ${NUM_USERS_PER_ORG * organizations.length} users`);

    // Fetch Pokemon data
    const pokemonData =
      await pokemonApiService.fetchAllPokemonData(POKEMON_LIMIT);
    logger.info(`Fetched data for ${pokemonData.length} Pokemon`);

    // Insert Pokemon data in batches
    for (let i = 0; i < pokemonData.length; i += BATCH_SIZE) {
      const batch = pokemonData.slice(i, i + BATCH_SIZE).map((pokemon) => ({
        ...pokemon,
        organization_id:
          organizations[Math.floor(Math.random() * organizations.length)].id,
      }));

      await Pokemon.query().insert(batch);
      logger.info(`Inserted batch of ${batch.length} Pokemon`);
    }

    logger.info(
      `Successfully assigned ${pokemonData.length} Pokemon to organizations`,
    );
    logger.info('Data generation completed successfully');
  } catch (error) {
    logger.error('Error generating data:', error);
    throw error;
  }
}

if (require.main === module) {
  const pokemonApiService = new PokemonApiService(null, POKEMON_API_URL);
  generateData(pokemonApiService)
    .then(() => {
      logger.info('Data generation script completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Unhandled error in data generation script:', error);
      process.exit(1);
    });
}
