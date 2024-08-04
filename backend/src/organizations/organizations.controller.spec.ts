import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';

const mockOrganizationsService = {
  findAll: jest.fn(),
  findById: jest.fn(),
};

describe('OrganizationsController', () => {
  let controller: OrganizationsController;
  let service: OrganizationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationsController],
      providers: [
        {
          provide: OrganizationsService,
          useValue: mockOrganizationsService,
        },
      ],
    }).compile();

    controller = module.get<OrganizationsController>(OrganizationsController);
    service = module.get<OrganizationsService>(OrganizationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of organizations', async () => {
      const expectedResult = [
        { id: 1, name: 'Org 1' },
        { id: 2, name: 'Org 2' },
      ];

      mockOrganizationsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toBe(expectedResult);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single organization', async () => {
      const expectedResult = { id: 1, name: 'Test Org' };

      mockOrganizationsService.findById.mockResolvedValue(expectedResult);

      const result = await controller.findOne('1');

      expect(result).toBe(expectedResult);
      expect(service.findById).toHaveBeenCalledWith(1);
    });
  });
});
