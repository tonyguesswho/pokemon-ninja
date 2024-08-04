import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { User } from '../models/user.model';
import { Organization } from '../models/organization.model';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

jest.mock('../models/user.model');
jest.mock('../models/organization.model');
jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test_token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user and return JWT token', async () => {
      const registerUserDto: RegisterUserDto = {
        email: 'test@example.com',
        password: 'password',
        organizationId: 1,
      };

      const mockTransaction = jest
        .fn()
        .mockImplementation((callback) => callback({ rollback: jest.fn() }));
      (User.knex as jest.Mock).mockReturnValue({
        transaction: mockTransaction,
      });

      (User.query as jest.Mock).mockReturnValue({
        findOne: jest.fn().mockResolvedValue(null),
        insert: jest.fn().mockResolvedValue({
          id: 1,
          email: 'test@example.com',
          organizationId: 1,
        }),
      });

      (Organization.query as jest.Mock).mockReturnValue({
        findById: jest.fn().mockResolvedValue({ id: 1, name: 'Test Org' }),
      });

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');

      const result = await service.register(registerUserDto);
      expect(result).toHaveProperty('access_token');
      expect(jwtService.sign).toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      const registerUserDto: RegisterUserDto = {
        email: 'test@example.com',
        password: 'password',
        organizationId: 1,
      };

      const mockTransaction = jest
        .fn()
        .mockImplementation((callback) => callback({ rollback: jest.fn() }));
      (User.knex as jest.Mock).mockReturnValue({
        transaction: mockTransaction,
      });

      (User.query as jest.Mock).mockReturnValue({
        findOne: jest
          .fn()
          .mockResolvedValue({ id: 1, email: 'test@example.com' }),
      });

      await expect(service.register(registerUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    it('should return JWT token when credentials are valid', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'password',
      };

      (User.query as jest.Mock).mockReturnValue({
        findOne: jest.fn().mockResolvedValue({
          id: 1,
          email: 'test@example.com',
          password: 'hashed_password',
          organization_id: 1,
        }),
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login(loginUserDto);
      expect(result).toHaveProperty('access_token');
      expect(jwtService.sign).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'wrong_password',
      };

      (User.query as jest.Mock).mockReturnValue({
        findOne: jest.fn().mockResolvedValue({
          id: 1,
          email: 'test@example.com',
          password: 'hashed_password',
        }),
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginUserDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('validateUser', () => {
    it('should return user object when credentials are valid', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      (User.query as jest.Mock).mockReturnValue({
        findOne: jest.fn().mockResolvedValue(user),
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toEqual({ id: 1, email: 'test@example.com' });
    });

    it('should return null when credentials are invalid', async () => {
      (User.query as jest.Mock).mockReturnValue({
        findOne: jest.fn().mockResolvedValue(null),
      });

      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toBeNull();
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        organizationId: 1,
      };

      (User.query as jest.Mock).mockReturnValue({
        findById: jest.fn().mockResolvedValue(user),
        select: jest.fn().mockReturnThis(),
      });

      const result = await service.getProfile(1);
      expect(result).toEqual(user);
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      (User.query as jest.Mock).mockReturnValue({
        findById: jest.fn().mockResolvedValue(null),
        select: jest.fn().mockReturnThis(),
      });

      await expect(service.getProfile(1)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
