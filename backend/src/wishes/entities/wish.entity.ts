import { Length, IsUrl, Min, IsNumber, IsString } from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { currencyDescriptor } from 'src/utlils';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @Length(1, 250)
  @IsString()
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column(currencyDescriptor)
  @IsNumber()
  @Min(1)
  price: number;

  @Column(currencyDescriptor)
  @IsNumber()
  @Min(1)
  raised: number;

  @Column({ default: 0 })
  @IsNumber()
  copied: number;

  @Column()
  @Length(1, 1024)
  @IsString()
  description: string;

  @ManyToOne(() => User, (user) => user.wishes, { onDelete: 'CASCADE' })
  @JoinColumn()
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];
}
