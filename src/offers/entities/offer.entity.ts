import {
    Entity,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToOne,
    Column,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';


@Entity()
export class Offer {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.offers)
    user: User;

    @ManyToOne(() => Wish, (wish) => wish.link)
    item: Wish;

    @Column({
        type: 'numeric',
        precision: 10,
        scale: 2,
        default: 0,
    })
    amount: number;

    @Column({ default: false })
    hidden: boolean;

}
