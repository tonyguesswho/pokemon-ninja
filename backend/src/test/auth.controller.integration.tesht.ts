// test/auth.controller.integration.spec.ts

import request from 'supertest';
import {
  setupTestDatabase,
  teardownTestDatabase,
  clearDatabase,
  createTestOrganization,
  createTestUser,
} from './setup';
import { INestApplication } from '@nestjs/common';
import { User } from '../models/user.model';
import * as bcrypt from 'bcrypt';

describe('AuthController (integration)', () => {
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

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const org = await createTestOrganization('org3');

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          organizationId: org.id,
        })
        .expect(201);

      expect(response.body.access_token).toBeDefined();

      // Verify the user was created in the database
      const user = await User.query().findOne({ email: 'test@example.com' });
      expect(user).toBeDefined();
      expect(user!.organization_id).toBe(org.id);
    });

    it('should return 400 for invalid input', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          password: '123', // assuming you have password length validation
        })
        .expect(400);
    });
  });

  it('should return 409 for duplicate email registration', async () => {
    const org = await createTestOrganization('org4');
    await createTestUser('existing@example.com', 'password123', org.id);

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'existing@example.com',
        password: 'newpassword',
        organizationId: org.id,
      })
      .expect(409);
  });

  it('should return 400 for invalid organization ID', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        organizationId: 9999, // Non-existent organization ID
      })
      .expect(400);
  });

  it('should hash the password before storing', async () => {
    const org = await createTestOrganization('org5');
    await request(app.getHttpServer()).post('/auth/register').send({
      email: 'test@example.com',
      password: 'password123',
      organizationId: org.id,
    });

    const user = await User.query().findOne({ email: 'test@example.com' });
    expect(user!.password).not.toBe('password123');
    expect(await bcrypt.compare('password123', user!.password)).toBe(true);
  });

  describe('POST /auth/login', () => {
    it('should login a user and return a token', async () => {
      const org = await createTestOrganization('org1');
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);
      await createTestUser('login@example.com', hashedPassword, org.id);

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'login@example.com',
          password: password,
        })
        .expect(201);

      expect(response.body.access_token).toBeDefined();
    });

    it('should return 401 for invalid credentials', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });

  describe('GET /auth/profile', () => {
    it('should return user profile for authenticated user', async () => {
      const org = await createTestOrganization('org2');
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const user = await createTestUser(
        'profile@example.com',
        hashedPassword,
        org.id,
      );

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'profile@example.com',
          password: password,
        });

      const token = loginResponse.body.access_token;

      const profileResponse = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(profileResponse.body.email).toBe('profile@example.com');
      expect(profileResponse.body.organization_id).toBe(org.id);
    });

    it('should return 401 for unauthenticated request', async () => {
      await request(app.getHttpServer()).get('/auth/profile').expect(401);
    });
  });
});
