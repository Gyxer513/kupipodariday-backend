import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UsersService,
    ) { }

    auth(user: User) {
        const payload = { sub: user.id };
        return {
            access_token: this.jwtService.sign(payload, {
                expiresIn: '7d',
            }),
        };
    }

    async validatePassword(username: string, password: string) {
        const checkedUser = await this.userService.findByUsername(username);
        if (!checkedUser) {
            throw new UnauthorizedException('Неправильный пароль');
        }
        const checkPassword = await bcrypt.compare(password, checkedUser.password).then((matched) => {
            if (!matched) {
                return null
            } else
                return true
        });
        if (!checkPassword) {
            throw new UnauthorizedException('Неправильный пароль');
        }
        return checkedUser;
    }

    async signup(createUserDto: CreateUserDto) {
        const user = await this.userService.create(createUserDto);
        return user;
      }
}
