import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  create(createWishDto: CreateWishDto, ownerId: number) {
    const wish = this.wishesRepository.create({
      ...createWishDto,
      owner: { id: ownerId },
    });
    return this.wishesRepository.save(wish);
  }

  findMany(query: FindManyOptions<Wish>) {
    return this.wishesRepository.find(query);
  }

  findOne(query: FindOneOptions<Wish>) {
    return this.wishesRepository.findOne(query);
  }

  findTopWishes() {
    return this.findMany({ order: { copied: 'DESC' }, take: 10 });
  }

  findLastWishes() {
    return this.findMany({
      order: { createdAt: 'DESC' },
      take: 40,
    });
  }

  getWishById(id: number) {
    return this.findOne({
      where: { id },
      relations: { owner: true },
    });
  }

  async update(id: number, user: User, payload: UpdateWishDto) {
    const wish = await this.wishesRepository.findOne({
      relations: {
        owner: true,
      },
      where: {
        id,
      },
    });

    if (wish.raised > 0) {
      throw new ForbiddenException(
        'Нельязя изменять стоимость при наличии желающих скинуться',
      );
    }

    if (wish.owner.id !== user.id) {
      throw new UnauthorizedException('Нельзя редактировать чужие подарки');
    }

    await this.wishesRepository.update(id, { ...payload });

    return {};
  }

  async remove(id: number, userId: number) {
    const wish = await this.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (!wish) {
      throw new NotFoundException('Такого подарка нет');
    }

    if (userId !== wish.owner.id) {
      throw new ForbiddenException('Нельзя удалять чужие подарки');
    }

    this.wishesRepository.delete(id);
    return wish;
  }

  async copy(id: number, user: User) {
    const wish = await this.findOne({ where: { id: id } });

    const { name, link, image, price, copied } = wish;

    if (!wish) {
      throw new NotFoundException('Такого подарка нет');
    } else 
    
    if (wish.owner.id === user.id) {
      throw new ForbiddenException(
        'У вас уже есть такой подарок',
      );
    }
    const wishCopyDto = {
      name: name,
      link: link,
      image: image,
      price: price,
      copied: copied + 1,
    };

    await this.dataSource.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.update<Wish>(Wish, id, {
        copied: copied + 1,
      });

      await transactionalEntityManager.insert<Wish>(Wish, wishCopyDto);
    });

    return {};
  }
}
