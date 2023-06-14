import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { CustomRequest } from '../utils/custom-request';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) { }

  @Post()
  async createOffer(@Body() createOfferDto: CreateOfferDto, @Req() req: CustomRequest) {
    const offer = await this.offersService.createOffer(createOfferDto, req);
    return offer;
  }

  @Get()
  async findOffers() {
    return await this.offersService.findOffers();
  }

  @Get(':id')
  async getOfferById(@Param('id') id: string) {
    return await this.offersService.findOfferById(id);
  }
}
