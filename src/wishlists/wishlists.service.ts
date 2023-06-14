import { Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';


@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
  ) { }

  findMany(query: FindManyOptions<Wishlist>) {
    return this.wishlistsRepository.find(query);
  }

  findOne(query: FindOneOptions<Wishlist>) {
    return this.wishlistsRepository.findOne(query);
  }

  findWishlists() {
    return this.findMany({
      relations: ['items', 'owner'],
    });
  }

  create(createWishlistDto: CreateWishlistDto, ownerId: number) {
    const { itemsId, ...rest } = createWishlistDto;
    const items = itemsId.map((id) => ({ id }));
    const wishList = this.wishlistsRepository.create({
      ...rest,
      items,
      owner: { id: ownerId },
    });
    return this.wishlistsRepository.save(wishList);
  }

  findById(id: number) {
    return this.findOne({
      where: { id },
      relations: ['items', 'owner'],
    });
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ) {
    const wishlist = await this.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException(
        'Вы не можете редактировать чужие списки подарков',
      );
    }
    const { itemsId, ...rest } = updateWishlistDto;
    const items = itemsId.map((id) => ({ id }));
    const updatedWishlist = { ...rest, items };
    await this.wishlistsRepository.update(id, updatedWishlist);
    return this.findOne({ where: { id } });
  }

  async remove(id: number, user: User) {
    const wishlist = await this.findOne({
      where: { id }
    });
    if (!wishlist) {
      throw new ForbiddenException('Нельзя удалять чужие подарки');
    } else

      if (wishlist.owner.id !== user.id) {
        throw new UnauthorizedException('Необходима авторизация');
      }
    await this.wishlistsRepository.delete(id);
    return 'Удалено';
  }
}
