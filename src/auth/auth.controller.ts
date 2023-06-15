import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { CustomRequest } from 'src/utils/custom-request';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

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