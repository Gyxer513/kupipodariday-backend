import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { CustomRequest } from '../utils/custom-request';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) { }

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

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.wishesService.findWishById(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req: CustomRequest,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishesService.update(+id, req.user, updateWishDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: CustomRequest) {
    return this.wishesService.remove(+id, req.user.id);
  }

  @Post(':id/copy')
  copy(@Param('id') id: string, @Req() req: CustomRequest) {
    return this.wishesService.copy(+id, req.user);
  }
}
