import { Injectable } from '@nestjs/common';
import { Organization } from '../models/organization.model';

@Injectable()
export class OrganizationsService {
  async findAll(): Promise<Organization[]> {
    return Organization.query();
  }

  async findById(id: number): Promise<Organization | undefined> {
    return Organization.query().findById(id);
  }
}
