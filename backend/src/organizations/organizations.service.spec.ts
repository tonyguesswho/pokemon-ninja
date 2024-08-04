import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationsService } from './organizations.service';
import { Organization } from '../models/organization.model';

// Mock the Organization model
jest.mock('../models/organization.model');

describe('OrganizationsService', () => {
  let service: OrganizationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizationsService],
    }).compile();

    service = module.get<OrganizationsService>(OrganizationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of organizations', async () => {
      const mockOrganizations = [
        { id: 1, name: 'Org 1' },
        { id: 2, name: 'Org 2' },
      ];
      (Organization.query as jest.Mock).mockResolvedValue(mockOrganizations);

      const result = await service.findAll();
      expect(result).toEqual(mockOrganizations);
      expect(Organization.query).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should find an organization by id', async () => {
      const mockOrganization = { id: 1, name: 'Test Org' };
      (Organization.query as jest.Mock).mockReturnValue({
        findById: jest.fn().mockResolvedValue(mockOrganization),
      });

      const result = await service.findById(1);
      expect(result).toEqual(mockOrganization);
      expect(Organization.query().findById).toHaveBeenCalledWith(1);
    });

    it('should return undefined if organization is not found', async () => {
      (Organization.query as jest.Mock).mockReturnValue({
        findById: jest.fn().mockResolvedValue(undefined),
      });

      const result = await service.findById(999);
      expect(result).toBeUndefined();
      expect(Organization.query().findById).toHaveBeenCalledWith(999);
    });
  });
});
