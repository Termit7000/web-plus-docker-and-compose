import { Injectable, Inject, LoggerService } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import {
  DataSource,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Wish } from 'src/wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class OffersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  create(createOfferDto: CreateOfferDto) {
    return this.offersRepository.save(createOfferDto);
  }

  async addOffer(createOfferDto: CreateOfferDto, wish: Wish, user: User) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    wish.raised += createOfferDto.amount;

    const newOffer = { ...createOfferDto, user, item: wish };

    let offer;

    try {
      await queryRunner.manager.save(Wish, wish);
      offer = await queryRunner.manager.save(Offer, newOffer);

      await queryRunner.commitTransaction();
      this.logger.log(
        `Операция произошла успешно. Текущий сбор: ${wish.raised}`,
      );
    } catch (err) {
      this.logger.error(`В процессе операции возникла ошибка ${err.message}`);
      await queryRunner.rollbackTransaction();
      offer = {};
    } finally {
      await queryRunner.release();
    }
    return offer;
  }

  findOne(query: FindOneOptions<Offer>) {
    return this.offersRepository.findOne(query);
  }

  findMany(query: FindManyOptions<Offer>) {
    return this.offersRepository.find(query);
  }

  update(id: number, updateOfferDto: UpdateOfferDto) {
    return this.offersRepository.update(id, updateOfferDto);
  }

  remove(query: FindOptionsWhere<Offer>) {
    return this.offersRepository.delete(query);
  }
}
