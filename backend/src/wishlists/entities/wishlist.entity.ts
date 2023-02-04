import { IsNumber, IsString, IsUrl, MaxLength } from 'class-validator';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @MaxLength(250)
  @IsString()
  name: string;

  @Column({ default: '' })
  @MaxLength(1024)
  @IsString()
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToOne(() => User, (user) => user.wishlists, { onDelete: 'CASCADE' })
  @JoinColumn()
  owner: User;

  @ManyToMany(() => Wish, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable()
  items: Wish[];
}
