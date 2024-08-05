import request from 'supertest';
import {
  setupTestDatabase,
  teardownTestDatabase,
  clearDatabase,
  createTestOrganization,
  createTestUser,
  createTestUserAndToken,
  createTestPokemon,
} from './setup';
import { INestApplication } from '@nestjs/common';
import { Pokemon } from '../models/pokemon.model';
import { Favorite } from '../models/favorite.model';

describe('PokemonController (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const setup = await setupTestDatabase();
    app = setup.app;
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  describe('GET /pokemon', () => {
    it('should return pokemon list for authenticated user', async () => {
      const org = await createTestOrganization('Test Org');
      const { user, token } = await createTestUserAndToken(
        'test@example.com',
        'password123',
        org.id,
      );

      // Create some test Pokemon
      await createTestPokemon('Pikachu', org.id);
      await createTestPokemon('Charizard', org.id);

      const response = await request(app.getHttpServer())
        .get('/pokemon')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.pokemons).toHaveLength(2);
      expect(response.body.total).toBe(2);
      expect(response.body.pokemons[0].name).toBe('Pikachu');
      expect(response.body.pokemons[1].name).toBe('Charizard');
    });

    it('should return paginated results', async () => {
      const org = await createTestOrganization('Test Org');
      const { user, token } = await createTestUserAndToken(
        'test@example.com',
        'password123',
        org.id,
      );

      // Create 25 test Pokemon
      for (let i = 1; i <= 25; i++) {
        await createTestPokemon(`Pokemon ${i}`, org.id);
      }

      const response = await request(app.getHttpServer())
        .get('/pokemon?page=2&limit=10')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.pokemons).toHaveLength(10);
      expect(response.body.total).toBe(25);
      expect(response.body.pokemons[0].name).toBe('Pokemon 11');
    });

    it('should return 401 for unauthenticated request', async () => {
      await request(app.getHttpServer()).get('/pokemon').expect(401);
    });
  });

  describe('POST /pokemon/:id/toggle-favorite', () => {
    it('should toggle favorite status of a Pokemon', async () => {
      const org = await createTestOrganization('Test Org');
      const { user, token } = await createTestUserAndToken(
        'test@example.com',
        'password123',
        org.id,
      );
      const pokemon = await createTestPokemon('Pikachu', org.id);

      // Favorite the Pokemon
      let response = await request(app.getHttpServer())
        .post(`/pokemon/${pokemon.id}/toggle-favorite`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.isFavorited).toBe(true);

      // Unfavorite the Pokemon
      response = await request(app.getHttpServer())
        .post(`/pokemon/${pokemon.id}/toggle-favorite`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.isFavorited).toBe(false);
    });

    it('should return 404 for non-existent Pokemon', async () => {
      const org = await createTestOrganization('Test Org');
      const { user, token } = await createTestUserAndToken(
        'test@example.com',
        'password123',
        org.id,
      );

      await request(app.getHttpServer())
        .post('/pokemon/9999/toggle-favorite')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });

    it('should return 403 for Pokemon from different organization', async () => {
      const org1 = await createTestOrganization('Org 1');
      const org2 = await createTestOrganization('Org 2');
      const { user, token } = await createTestUserAndToken(
        'test@example.com',
        'password123',
        org1.id,
      );
      const pokemon = await createTestPokemon('Charizard', org2.id);

      await request(app.getHttpServer())
        .post(`/pokemon/${pokemon.id}/toggle-favorite`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });

    it('should return 401 for unauthenticated request', async () => {
      await request(app.getHttpServer())
        .post('/pokemon/1/toggle-favorite')
        .expect(401);
    });
  });
});
