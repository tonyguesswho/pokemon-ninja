import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body(ValidationPipe) registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body(ValidationPipe) loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }
}
