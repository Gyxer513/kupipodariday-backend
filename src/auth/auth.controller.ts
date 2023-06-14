import { Controller, Req, UseGuards, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { CustomRequest } from '../utils/custom-request';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signin(@Req() req: CustomRequest) {
    return this.authService.auth(req.user);
  }

  @Post('signup')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signup(createUserDto);
  }
}
