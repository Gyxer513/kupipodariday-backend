import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { WishesService } from 'src/wishes/wishes.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Wish])],
  controllers: [UsersController],
  providers: [UsersService, WishesService],
  exports: [UsersService]
})
export class UsersModule {}
