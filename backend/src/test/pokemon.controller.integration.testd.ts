import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import {
  setupTestDatabase,
  teardownTestDatabase,
  clearDatabase,
  createTestOrganization,
  createTestUserAndToken,
} from './setup';
import { Pokemon } from '../models/pokemon.model';

describe('PokemonController (integration)', () => {
  let app: INestApplication;
  let authToken: string;
  let organizationId: number;
  let userId: number;

  //   beforeAll(async () => {
  //     const setup = await setupTestDatabase();
  //     app = setup.app;
  //   });

  //   afterAll(async () => {
  //     await teardownTestDatabase();
  //   });

  //   beforeEach(async () => {
  //     await clearDatabase();
  //     const org = await createTestOrganization('Test Org');
  //     organizationId = org.id;
  //     const { user, token } = await createTestUserAndToken(
  //       'test@example.com',
  //       'password123',
  //       org.id,
  //     );
  //     authToken = token;
  //     userId = user.id;
  //   });

  describe('GET /pokemon', () => {
    it("should return a list of Pokemon for the user's organization", async () => {
      // Create another organization for testing
      const otherOrg = await createTestOrganization('Other Org');

      // Create test Pokemon
      await Pokemon.query().insert([
        { name: 'Pikachu', organization_id: organizationId },
        { name: 'Charizard', organization_id: organizationId },
        { name: 'Bulbasaur', organization_id: otherOrg.id }, // Different org
      ]);

      const response = await request(app.getHttpServer())
        .get('/pokemon')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.pokemons).toHaveLength(2);
      expect(response.body.pokemons[0].name).toBe('Pikachu');
      expect(response.body.pokemons[1].name).toBe('Charizard');
    });

    it('should return paginated results', async () => {
      // Create 25 test Pokemon
      const pokemonData = Array.from({ length: 25 }, (_, i) => ({
        name: `Pokemon ${i + 1}`,
        organization_id: organizationId,
      }));
      await Pokemon.query().insert(pokemonData);

      const response = await request(app.getHttpServer())
        .get('/pokemon?page=2&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.pokemons).toHaveLength(10);
      expect(response.body.total).toBe(25);
      expect(response.body.pokemons[0].name).toBe('Pokemon 11');
    });
  });

  describe('GET /pokemon/:id', () => {
    it('should return a specific Pokemon', async () => {
      const pokemon = await Pokemon.query().insert({
        name: 'Pikachu',
        organization_id: organizationId,
      });

      const response = await request(app.getHttpServer())
        .get(`/pokemon/${pokemon.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.name).toBe('Pikachu');
    });

    it('should return 404 for non-existent Pokemon', async () => {
      await request(app.getHttpServer())
        .get('/pokemon/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 403 for Pokemon from different organization', async () => {
      const otherOrg = await createTestOrganization('Other Org');
      const pokemon = await Pokemon.query().insert({
        name: 'Charizard',
        organization_id: otherOrg.id,
      });

      await request(app.getHttpServer())
        .get(`/pokemon/${pokemon.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(403);
    });
  });

  describe('POST /pokemon/:id/toggle-favorite', () => {
    it('should toggle favorite status of a Pokemon', async () => {
      const pokemon = await Pokemon.query().insert({
        name: 'Pikachu',
        organization_id: organizationId,
      });

      // Favorite the Pokemon
      let response = await request(app.getHttpServer())
        .post(`/pokemon/${pokemon.id}/toggle-favorite`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.isFavorited).toBe(true);

      // Unfavorite the Pokemon
      response = await request(app.getHttpServer())
        .post(`/pokemon/${pokemon.id}/toggle-favorite`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.isFavorited).toBe(false);
    });

    it('should return 404 for non-existent Pokemon', async () => {
      await request(app.getHttpServer())
        .post('/pokemon/9999/toggle-favorite')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 403 for Pokemon from different organization', async () => {
      const otherOrg = await createTestOrganization('Other Org');
      const pokemon = await Pokemon.query().insert({
        name: 'Charizard',
        organization_id: otherOrg.id,
      });

      await request(app.getHttpServer())
        .post(`/pokemon/${pokemon.id}/toggle-favorite`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(403);
    });
  });
});
