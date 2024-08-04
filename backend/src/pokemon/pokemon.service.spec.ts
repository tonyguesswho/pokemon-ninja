import { Test, TestingModule } from '@nestjs/testing';
import { PokemonService } from './pokemon.service';
import { Pokemon } from '../models/pokemon.model';
import { Favorite } from '../models/favorite.model';
import { User } from '../models/user.model';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

jest.mock('../models/pokemon.model', () => ({
  Pokemon: {
    knex: jest.fn(),
    query: jest.fn(),
    startTransaction: jest.fn(),
  },
}));
jest.mock('../models/favorite.model');
jest.mock('../models/user.model');

describe('PokemonService', () => {
  let service: PokemonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PokemonService],
    }).compile();

    service = module.get<PokemonService>(PokemonService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPokemonWithFavoriteStatus', () => {
    it('should return pokemons with favorite status', async () => {
      const mockResults = [
        { id: 1, name: 'Pikachu', is_favorite: true },
        { id: 2, name: 'Charmander', is_favorite: false },
      ];
      const mockCount = { count: '2' };

      const mockKnex = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockResults),
        count: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(mockCount),
        raw: jest
          .fn()
          .mockReturnValue(
            'CASE WHEN favorites.id IS NOT NULL THEN true ELSE false END as is_favorite',
          ),
      };

      (Pokemon.knex as jest.Mock).mockReturnValue(mockKnex);

      const result = await service.getPokemonWithFavoriteStatus(1, 1, 1, 20);
      expect(result).toEqual({
        pokemons: mockResults,
        total: 2,
      });

      expect(mockKnex.from).toHaveBeenCalledWith('pokemons');
      expect(mockKnex.select).toHaveBeenCalledWith('pokemons.*');
      expect(mockKnex.leftJoin).toHaveBeenCalled();
      expect(mockKnex.where).toHaveBeenCalledWith(
        'pokemons.organization_id',
        1,
      );
      expect(mockKnex.orderBy).toHaveBeenCalledWith('pokemons.id', 'asc');
      expect(mockKnex.offset).toHaveBeenCalledWith(0);
      expect(mockKnex.limit).toHaveBeenCalledWith(20);
      expect(mockKnex.raw).toHaveBeenCalled();
    });
  });

  describe('toggleFavorite', () => {
    it('should favorite a pokemon', async () => {
      const mockUser = { id: 1, organization_id: 1 };
      const mockPokemon = { id: 1, organization_id: 1 };
      (User.query as jest.Mock).mockReturnValue({
        findById: jest.fn().mockResolvedValue(mockUser),
      });
      (Pokemon.query as jest.Mock).mockReturnValue({
        findById: jest.fn().mockResolvedValue(mockPokemon),
      });
      (Favorite.query as jest.Mock).mockReturnValue({
        findOne: jest.fn().mockResolvedValue(null),
        insert: jest.fn().mockResolvedValue({}),
      });
      (Pokemon.startTransaction as jest.Mock).mockResolvedValue({
        commit: jest.fn(),
        rollback: jest.fn(),
      });

      const result = await service.toggleFavorite(1, 1);
      expect(result).toEqual({ isFavorited: true });
    });

    it('should unfavorite a pokemon', async () => {
      const mockUser = { id: 1, organization_id: 1 };
      const mockPokemon = { id: 1, organization_id: 1 };
      const mockFavorite = { id: 1 };
      (User.query as jest.Mock).mockReturnValue({
        findById: jest.fn().mockResolvedValue(mockUser),
      });
      (Pokemon.query as jest.Mock).mockReturnValue({
        findById: jest.fn().mockResolvedValue(mockPokemon),
      });
      (Favorite.query as jest.Mock).mockReturnValue({
        findOne: jest.fn().mockResolvedValue(mockFavorite),
        deleteById: jest.fn().mockResolvedValue(1),
      });
      (Pokemon.startTransaction as jest.Mock).mockResolvedValue({
        commit: jest.fn(),
        rollback: jest.fn(),
      });

      const result = await service.toggleFavorite(1, 1);
      expect(result).toEqual({ isFavorited: false });
    });

    it('should throw NotFoundException if user is not found', async () => {
      (User.query as jest.Mock).mockReturnValue({
        findById: jest.fn().mockResolvedValue(null),
      });
      (Pokemon.startTransaction as jest.Mock).mockResolvedValue({
        commit: jest.fn(),
        rollback: jest.fn(),
      });

      await expect(service.toggleFavorite(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if pokemon is not found', async () => {
      const mockUser = { id: 1, organization_id: 1 };
      (User.query as jest.Mock).mockReturnValue({
        findById: jest.fn().mockResolvedValue(mockUser),
      });
      (Pokemon.query as jest.Mock).mockReturnValue({
        findById: jest.fn().mockResolvedValue(null),
      });
      (Pokemon.startTransaction as jest.Mock).mockResolvedValue({
        commit: jest.fn(),
        rollback: jest.fn(),
      });

      await expect(service.toggleFavorite(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should throw ForbiddenException if pokemon is not from user's organization", async () => {
      const mockUser = { id: 1, organization_id: 1 };
      const mockPokemon = { id: 1, organization_id: 2 };
      (User.query as jest.Mock).mockReturnValue({
        findById: jest.fn().mockResolvedValue(mockUser),
      });
      (Pokemon.query as jest.Mock).mockReturnValue({
        findById: jest.fn().mockResolvedValue(mockPokemon),
      });
      (Pokemon.startTransaction as jest.Mock).mockResolvedValue({
        commit: jest.fn(),
        rollback: jest.fn(),
      });

      await expect(service.toggleFavorite(1, 1)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('getPokemonById', () => {
    it('should return a pokemon by id', async () => {
      const mockPokemon = { id: 1, name: 'Pikachu' };
      (Pokemon.query as jest.Mock).mockReturnValue({
        findById: jest.fn().mockResolvedValue(mockPokemon),
      });

      const result = await service.getPokemonById(1);
      expect(result).toEqual(mockPokemon);
    });

    it('should throw NotFoundException if pokemon is not found', async () => {
      (Pokemon.query as jest.Mock).mockReturnValue({
        findById: jest.fn().mockResolvedValue(null),
      });

      await expect(service.getPokemonById(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getPokemonByOrganization', () => {
    it('should return pokemons for an organization', async () => {
      const mockPokemons = [
        { id: 1, name: 'Pikachu' },
        { id: 2, name: 'Charmander' },
      ];
      (Pokemon.query as jest.Mock).mockReturnValue({
        where: jest.fn().mockResolvedValue(mockPokemons),
      });

      const result = await service.getPokemonByOrganization(1);
      expect(result).toEqual(mockPokemons);
    });
  });
});
