import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findOne(query: FindOneOptions<User>) {
    return this.userRepository.findOne(query);
  }

  findMany(query: FindManyOptions<User>) {
    return this.userRepository.find(query);
  }

  findByNameOrEmail(query: string) {
    return this.findMany({
      where: [{ username: query }, { email: query }],
    });
  }

  /* Создаём пользователя */
  async create(payload: CreateUserDto): Promise<User> {
    const { username, email } = payload;

    if (await this.findOne({ where: [{ email }, { username }] })) {
      throw new ConflictException('Такой пользователь уже зарегистрирован');
    }

    const hash = await bcrypt.hash(payload.password, 10);
    const user = await this.userRepository.save({
      ...payload,
      password: hash,
    });

    return user;
  }

  /* Обновляем информацию о пользователе */
  async update(id: number, payload: UpdateUserDto): Promise<User> {
    const { username, email } = payload;
    if (username || email) {
      if (await this.findOne({ where: [{ email }, { username }] })) {
        throw new ConflictException('Такой пользователь уже зарегистрирован');
      }

      const data = { ...payload };
      if (payload.password) {
        const hash = await bcrypt.hash(payload.password, 10);
        data.password = hash;
      }

      await this.userRepository.update(id, data);
      const user = await this.userRepository.findOneBy({ id });

      return user;
    }
  }

  findByUsername(username: string) {
    return this.findOne({
      where: { username },
    });
  }
  async findUserWishes(userId: number) {
    const user = await this.findOne({
      where: { id: userId },
      relations: {
        wishes: { owner: true },
      },
    });

    return user.wishes;
  }

  async findOtherUserWishes(username: string) {
    const user = await this.findOne({
      where: { username },
      relations: {
        wishes: true,
      },
    });

    return user.wishes;
  }
}
