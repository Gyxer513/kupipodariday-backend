import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';

export interface CustomRequest extends Request {
    user: User;
}