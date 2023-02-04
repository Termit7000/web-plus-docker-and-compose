import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  UseGuards,
  UseInterceptors,
  UseFilters,
  Req,
} from '@nestjs/common';

import { LoggerService } from '@nestjs/common/services';
import { ParseIntPipe } from '@nestjs/common/pipes';

import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { CreateOfferDto } from './dto/create-offer.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { WishesService } from 'src/wishes/wishes.service';
import { OffersService } from './offers.service';
import { BadRequestException } from 'src/services/exceptions';
import { HttpInterceptor } from 'src/services/interceptors/http.interceptor';
import { ServerExceptionFilter } from 'src/services/filters/server-exception.filter';
import { User } from 'src/users/entities/user.entity';

@Controller('offers')
@UseInterceptors(HttpInterceptor)
@UseFilters(ServerExceptionFilter)
export class OffersController {
  constructor(
    private readonly offersService: OffersService,
    private readonly wishService: WishesService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createOfferDto: CreateOfferDto,
    @Req() req: Request & { user: User },
  ) {
    const wish = await this.wishService.findOne({
      where: { id: createOfferDto.itemId },
      relations: { owner: true },
    });

    if (!wish) {
      throw new BadRequestException(
        `Хотелка с id: ${createOfferDto.itemId} не найдена`,
      );
    }

    const sumToPrice = wish.price - wish.raised;

    if (sumToPrice <= 0) {
      throw new BadRequestException('Необходимая сумма уже собрана');
    }

    if (wish.owner.id === req.user.id) {
      throw new BadRequestException('Нельзя скинуться на свой подарок');
    }

    if (createOfferDto.amount > sumToPrice) {
      throw new BadRequestException(
        `Сумма собранных средств не может превышать стоимость подарка осталось собрать: ${sumToPrice}`,
      );
    }

    return this.offersService.addOffer(createOfferDto, wish, req.user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.offersService.findMany({
      where: { hidden: false },
      relations: { item: true, user: true },
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const offer = await this.offersService.findOne({
      where: { id, hidden: false },
    });
    if (!offer) {
      throw new BadRequestException(`Подарок с id:${id} не найден`);
    }

    return offer;
  }
}
