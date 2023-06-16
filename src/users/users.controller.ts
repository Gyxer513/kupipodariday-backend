import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  UseGuards
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CustomRequest } from '../utils/custom-request'
import { FindUserDto } from './dto/find-user.dto';
import { JwtGuard } from 'src/auth/jwt.guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get(':me')
  findMe(@Req() req: CustomRequest) {
    return req.user;
  }

  @Patch('me')
  update(@Req() req: CustomRequest, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Get('me/wishes')
  getUserWishes(@Req() req: CustomRequest) {
    return this.usersService.findUserWishes(req.user.id);
  }

  @Get(':username')
  getByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @Get(':username/wishes')
  getOtherUserWishes(@Param('username') username: string) {
    return this.usersService.findOtherUserWishes(username);
  }

  @Post('find')
  findByNameOrEmail(@Body() findUserDto: FindUserDto) {
    const { query } = findUserDto;
    return this.usersService.findByNameOrEmail(query);
  }
}
