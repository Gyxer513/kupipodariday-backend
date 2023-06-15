import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { CustomRequest } from '../utils/custom-request';
import { JwtGuard } from 'src/auth/jwt.ruard';


@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) { }

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createWishDto: CreateWishDto, @Req() req: CustomRequest) {
    return this.wishesService.create(createWishDto, req.user.id);
  }

  @Get('last')
  getLastWishes() {
    return this.wishesService.findLastWishes();
  }

  @Get('top')
  getTopWishes() {
    return this.wishesService.findTopWishes();
  }
  @UseGuards(JwtGuard)
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.wishesService.findWishById(+id);
  }
  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req: CustomRequest,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishesService.update(+id, req.user, updateWishDto);
  }
  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: CustomRequest) {
    return this.wishesService.remove(+id, req.user.id);
  }
  @UseGuards(JwtGuard)
  @Post(':id/copy')
  copy(@Param('id') id: string, @Req() req: CustomRequest) {
    return this.wishesService.copy(+id, req.user);
  }
}
