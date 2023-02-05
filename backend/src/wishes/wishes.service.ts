import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { Wish } from './entities/wish.entity';

import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { User } from 'src/users/entities/user.entity';
import { DbError } from 'src/services/exceptions';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private readonly wishRepository: Repository<Wish>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  create(user: User, createWishDto: CreateWishDto) {
    return this.wishRepository.save({ ...createWishDto, owner: user });
  }

  findOne(query: FindOneOptions<Wish>) {
    console.log(query);
    return this.wishRepository.findOne(query);
  }

  findMany(query: FindManyOptions<Wish>) {
    return this.wishRepository.find(query);
  }

  update(id: number, wish: UpdateWishDto | Pick<Wish, 'raised'>) {
    try {
      return this.wishRepository.update({ id }, wish);
    } catch (err) {
      this.logger.error(
        `Не удалось обновить wish ${id} с параметрами: ${JSON.stringify(wish)}`,
        err,
      );

      throw new DbError();
    }
  }

  remove(query: FindOptionsWhere<Wish>) {
    return this.wishRepository.delete(query);
  }
}
