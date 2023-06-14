import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WishesService } from '../wishes/wishes.service';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) { }

  async findOffers() {
    const offers = await this.offersRepository.find({
      relations: ['item', 'user'],
    });
    if (!offers) {
      throw new NotFoundException('Такого подарка нет');
    }
    offers.map((offer) => delete offer.user.password);
    return offers;
  }

  async findOfferById(id) {
    const offer = await this.offersRepository.findOne({
      where: { id },
      relations: ['item', 'user'],
    });
    if (!offer) {
      throw new NotFoundException('Такого подарка нет');
    }
    delete offer.user.password;
    return offer;
  }

  async createOffer(data, info) {
    const userWish = await this.wishesService.findWishById(data.id);
    if (!userWish) {
      throw new NotFoundException('Такого подарка нет');
    }
    delete info.user.password;
    delete userWish.owner.password;
    const offer = this.offersRepository.create({
      ...data,
      user: info.user,
      item: userWish,
    });
    return await this.offersRepository.save(offer);
  }
}
