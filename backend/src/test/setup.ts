// test/setup.ts

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';
import { Model } from 'objection';
import { User } from '../models/user.model';
import { Favorite } from '../models/favorite.model';
import { Organization } from '../models/organization.model';
import { Pokemon } from '../models/pokemon.model';
import { JwtService } from '@nestjs/jwt';

let app: INestApplication;
let jwtService: JwtService;

export async function setupTestDatabase() {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();

  jwtService = moduleFixture.get<JwtService>(JwtService);

  // Run migrations
  const knex = Model.knex();
  await knex.migrate.latest();

  return { app, jwtService };
}

export async function teardownTestDatabase() {
  const knex = Model.knex();
  // Rollback migrations
  await knex.migrate.rollback(undefined, true);
  await knex.destroy();
  await app.close();
}

export async function clearDatabase() {
  await User.query().delete();
  await Pokemon.query().delete();
  await Organization.query().delete();
  await Favorite.query().delete();

  // Add other model deletions here as needed
}

export async function createTestOrganization(
  name: string = 'Test Organization',
) {
  return await Organization.query().insert({ name });
}

export async function createTestUser(
  email: string,
  password: string,
  organizationId: number,
) {
  return await User.query().insert({
    email,
    password, // Note: In a real scenario, you'd hash this password
    organization_id: organizationId,
  });
}

export async function createTestUserAndToken(
  email: string,
  password: string,
  organizationId: number,
) {
  const user = await createTestUser(email, password, organizationId);
  const token = jwtService.sign({
    id: user.id,
    email: user.email,
    organizationId: user.organization_id,
  });
  return { user, token };
}
