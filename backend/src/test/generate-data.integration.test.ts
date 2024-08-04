// src/scripts/generate-data.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { PokemonApiService } from '../services/pokemon-api.service';
import { generateData } from '../scripts/generate-data';
import { Organization } from '../models/organization.model';
import { User } from '../models/user.model';
import { Pokemon } from '../models/pokemon.model';
import { knex } from '../config/database';

// Mock the models
jest.mock('../models/organization.model');
jest.mock('../models/user.model');
jest.mock('../models/pokemon.model');

// Mock the database connection
jest.mock('../config/database', () => ({
  knex: jest.fn().mockReturnValue({
    del: jest.fn().mockResolvedValue(undefined),
  }),
}));

describe('Data Generation Script', () => {
  let pokemonApiService: PokemonApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PokemonApiService,
          useValue: {
            fetchAllPokemonData: jest.fn().mockResolvedValue([
              {
                name: 'bulbasaur',
                height: 7,
                weight: 69,
                baseExperience: 64,
                sprite_front: 'https://example.com/bulbasaur-front.png',
                sprite_back: 'https://example.com/bulbasaur-back.png',
                stat_speed: 45,
                url: 'https://pokeapi.co/api/v2/pokemon/1/',
              },
              {
                name: 'charmander',
                height: 6,
                weight: 85,
                baseExperience: 62,
                sprite_front: 'https://example.com/charmander-front.png',
                sprite_back: 'https://example.com/charmander-back.png',
                stat_speed: 65,
                url: 'https://pokeapi.co/api/v2/pokemon/4/',
              },
            ]),
          },
        },
      ],
    }).compile();

    pokemonApiService = module.get<PokemonApiService>(PokemonApiService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should generate data using PokemonApiService', async () => {
    (Organization.query as jest.Mock).mockReturnValue({
      insert: jest.fn().mockResolvedValue([
        { id: 1, name: 'Org 1' },
        { id: 2, name: 'Org 2' },
      ]),
    });

    (User.query as jest.Mock).mockReturnValue({
      insert: jest.fn().mockResolvedValue([]),
    });

    // Mock the Pokemon.query().insert() method
    (Pokemon.query as jest.Mock).mockReturnValue({
      insert: jest.fn().mockResolvedValue([]),
    });

    await generateData(pokemonApiService);

    expect(knex).toHaveBeenCalledWith('pokemons');
    expect(knex).toHaveBeenCalledWith('users');
    expect(knex).toHaveBeenCalledWith('organizations');
    expect(knex('pokemons').del).toHaveBeenCalled();
    expect(knex('users').del).toHaveBeenCalled();
    expect(knex('organizations').del).toHaveBeenCalled();

    // Verify that organizations were created
    expect(Organization.query().insert).toHaveBeenCalled();

    // Verify that users were created
    expect(User.query().insert).toHaveBeenCalled();

    // Verify that Pokemon data was fetched
    expect(pokemonApiService.fetchAllPokemonData).toHaveBeenCalled();

    // Verify that Pokemon were inserted
    expect(Pokemon.query().insert).toHaveBeenCalled();
  });

  it('should handle errors during data generation', async () => {
    // Mock an error in fetching Pokemon data
    (pokemonApiService.fetchAllPokemonData as jest.Mock).mockRejectedValue(
      new Error('API Error'),
    );

    await expect(generateData(pokemonApiService)).rejects.toThrow('API Error');
  });
});
