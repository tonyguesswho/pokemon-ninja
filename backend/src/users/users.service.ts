import { Injectable } from '@nestjs/common';
import { User } from '../models/user.model';
import * as bcrypt from 'bcrypt';
import { ModelObject } from 'objection';

@Injectable()
export class UsersService {
  async create(
    email: string,
    password: string,
    organizationId: number,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const userData: Partial<ModelObject<User>> = {
      email,
      password: hashedPassword,
      organization_id: organizationId,
    };

    return User.query().insert(userData);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return User.query().findOne({ email });
  }

  async findById(id: number): Promise<User | undefined> {
    return User.query().findById(id);
  }
}
