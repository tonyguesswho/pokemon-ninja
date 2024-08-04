// src/auth/auth.service.ts

import {
  Injectable,
  Logger,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from '../models/user.model';
import { Organization } from '../models/organization.model';
import * as bcrypt from 'bcrypt';
import { transaction, ModelObject } from 'objection';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private jwtService: JwtService) {}

  async register(registerUserDto: RegisterUserDto) {
    this.logger.log(`Registering user with email: ${registerUserDto.email}`);

    return transaction(User.knex(), async (trx) => {
      const existingUser = await User.query(trx).findOne({
        email: registerUserDto.email,
      });
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      const organization = await Organization.query(trx).findById(
        registerUserDto.organizationId,
      );
      if (!organization) {
        throw new BadRequestException('Invalid organization');
      }

      const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);

      const userData: Partial<ModelObject<User>> = {
        email: registerUserDto.email,
        password: hashedPassword,
        organization_id: registerUserDto.organizationId,
      };

      const user = await User.query(trx).insert(userData);

      const payload = {
        email: user.email,
        sub: user.id,
        organizationId: user.organization_id,
      };
      return {
        access_token: this.jwtService.sign(payload),
      };
    });
  }

  async login(loginUserDto: LoginUserDto) {
    this.logger.log(`Login attempt for user: ${loginUserDto.email}`);

    const user = await User.query().findOne({ email: loginUserDto.email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      email: user.email,
      sub: user.id,
      organizationId: user.organization_id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await User.query().findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async getProfile(userId: number) {
    this.logger.log(`Fetching profile for user id: ${userId}`);
    const user = await User.query()
      .findById(userId)
      .select(
        'users.id',
        'users.email',
        'users.organization_id',
        'organizations.name as organization_name',
      )
      .join('organizations', 'users.organization_id', '=', 'organizations.id')
      .first();

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
