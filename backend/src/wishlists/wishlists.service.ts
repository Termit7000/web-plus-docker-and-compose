import { Injectable, Inject } from '@nestjs/common';
import { LoggerService } from '@nestjs/common/services';

import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { Wishlist } from './entities/wishlist.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  create(user: User, createWishlistDto: CreateWishlistDto, items: Wish[]) {
    const newList = {
      ...createWishlistDto,
      owner: user,
      items,
    };

    return this.wishlistRepository.save(newList);
  }

  findMany(query: FindManyOptions<Wishlist> = {}) {
    return this.wishlistRepository.find(query);
  }

  findOne(query: FindOneOptions<Wishlist>) {
    return this.wishlistRepository.findOne(query);
  }

  update(id: number, updateWishlistDto: UpdateWishlistDto, items: Wish[]) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { itemsId, ...newList } = {
      ...updateWishlistDto,
      id,
    };

    if (items.length) {
      newList['items'] = items;
    }

    return this.wishlistRepository.save(newList);
  }

  remove(wishlist: Wishlist) {
    return this.wishlistRepository.remove(wishlist);
  }
}
