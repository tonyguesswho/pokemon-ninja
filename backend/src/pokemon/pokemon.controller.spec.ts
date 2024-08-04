import { Test, TestingModule } from '@nestjs/testing';
import { PokemonController } from './pokemon.controller';
import { PokemonService } from './pokemon.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('PokemonController', () => {
  let controller: PokemonController;
  let service: PokemonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PokemonController],
      providers: [
        {
          provide: PokemonService,
          useValue: {
            getPokemonWithFavoriteStatus: jest.fn(),
            toggleFavorite: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PokemonController>(PokemonController);
    service = module.get<PokemonService>(PokemonService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPokemon', () => {
    it('should return pokemon with favorite status', async () => {
      const mockResult = {
        pokemons: [{ id: 1, name: 'Pikachu', is_favorite: true }],
        total: 1,
      };
      jest
        .spyOn(service, 'getPokemonWithFavoriteStatus')
        .mockResolvedValue(mockResult);

      const result = await controller.getPokemon(1, 20, {
        user: { id: 1, organizationId: 1 },
      });

      expect(result).toEqual(mockResult);
      expect(service.getPokemonWithFavoriteStatus).toHaveBeenCalledWith(
        1,
        1,
        1,
        20,
      );
    });
  });

  describe('toggleFavorite', () => {
    it('should toggle favorite status to true', async () => {
      jest
        .spyOn(service, 'toggleFavorite')
        .mockResolvedValue({ isFavorited: true });

      const result = await controller.toggleFavorite(1, { user: { id: 1 } });

      expect(result).toEqual({
        message: 'Pokemon favorited successfully',
        isFavorited: true,
      });
      expect(service.toggleFavorite).toHaveBeenCalledWith(1, 1);
    });

    it('should toggle favorite status to false', async () => {
      jest
        .spyOn(service, 'toggleFavorite')
        .mockResolvedValue({ isFavorited: false });

      const result = await controller.toggleFavorite(1, { user: { id: 1 } });

      expect(result).toEqual({
        message: 'Pokemon unfavorited successfully',
        isFavorited: false,
      });
      expect(service.toggleFavorite).toHaveBeenCalledWith(1, 1);
    });

    it('should throw ForbiddenException', async () => {
      jest
        .spyOn(service, 'toggleFavorite')
        .mockRejectedValue(new ForbiddenException('Forbidden'));

      await expect(
        controller.toggleFavorite(1, { user: { id: 1 } }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException', async () => {
      jest
        .spyOn(service, 'toggleFavorite')
        .mockRejectedValue(new NotFoundException('Not Found'));

      await expect(
        controller.toggleFavorite(1, { user: { id: 1 } }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
