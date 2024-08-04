import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from '../models/user.model';
import * as bcrypt from 'bcrypt';

// Mock the User model
jest.mock('../models/user.model');

// Mock bcrypt
jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const mockUser = { id: 1, email: 'test@example.com', organizationId: 1 };
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (User.query as jest.Mock).mockReturnValue({
        insert: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.create('test@example.com', 'password', 1);
      expect(result).toEqual(mockUser);
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
      expect(User.query().insert).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'hashedPassword',
        organization_id: 1,
      });
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const mockUser = { id: 1, email: 'test@example.com', organizationId: 1 };
      (User.query as jest.Mock).mockReturnValue({
        findOne: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.findByEmail('test@example.com');
      expect(result).toEqual(mockUser);
      expect(User.query().findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
    });
  });

  describe('findById', () => {
    it('should find a user by id', async () => {
      const mockUser = { id: 1, email: 'test@example.com', organizationId: 1 };
      (User.query as jest.Mock).mockReturnValue({
        findById: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.findById(1);
      expect(result).toEqual(mockUser);
      expect(User.query().findById).toHaveBeenCalledWith(1);
    });
  });
});
