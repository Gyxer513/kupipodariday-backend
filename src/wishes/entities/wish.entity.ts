import { IsString, Length, IsNotEmpty, IsUrl, IsInt } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    ManyToOne,
    OneToMany,
} from 'typeorm';

@Entity()
export class Wish {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    @Length(1, 250)
    name: string;

    @Column()
    @IsUrl()
    link: string;

    @Column()
    @IsUrl()
    image: string;

    @Column()
    price: number;

    @Column({
        default: 0,
    })
    raised: number;

    @Column()
    @Length(1, 1024)
    description: string;

    @Column({
        default: 0,
    })
    copied: number;

    @ManyToOne(() => User, (owner) => owner.wishes)
    owner: User;

    @OneToMany(() => Offer, (offers) => offers.item, {
        cascade: true,
    })
    offer: Offer[];

    @ManyToOne(() => Wishlist, (wishlists) => wishlists.items)
    wishlist: Wishlist;
}