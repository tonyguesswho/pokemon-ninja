import { IsEmail, IsString, IsNumber } from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsNumber()
  organizationId: number;
}
