import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Inject,
  LoggerService,
  UseInterceptors,
  UseFilters,
} from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { FindManyOptions } from 'typeorm';

import { plainToClass } from 'class-transformer';

import { WishesService } from './wishes.service';
import { CreateWishDto, creationFieldsWish } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  BadRequestException,
  ForbiddenError,
  ValidationError,
} from 'src/services/exceptions';

import {
  QUANTITY_LAST_WISHES,
  QUANTITY_TOP_WISHES,
} from 'src/utlils/constants';
import { DbError } from 'src/services/exceptions';

import { User } from 'src/users/entities/user.entity';
import { HttpInterceptor } from 'src/services/interceptors/http.interceptor';
import { ServerExceptionFilter } from 'src/services/filters/server-exception.filter';
import { WishByIdPipePipe } from 'src/services/pipes/wish-by-id/wish-by-id.pipe';

@Controller('wishes')
@UseInterceptors(HttpInterceptor)
@UseFilters(ServerExceptionFilter)
export class WishesController {
  constructor(
    private readonly wishesService: WishesService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createWishDto: CreateWishDto, @Req() req) {
    try {
      await this.wishesService.create(req.user, createWishDto);
      return {};
    } catch {
      throw new ValidationError();
    }
  }

  @Get('last')
  findLast() {
    const findOptions: FindManyOptions = {
      take: QUANTITY_LAST_WISHES,
      order: { createdAt: 'DESC' },
      relations: { owner: true },
    };

    try {
      return this.wishesService.findMany(findOptions);
    } catch (error) {
      this.logger.error('Ошибка получения последних подарков', error);
      throw new DbError();
    }
  }

  @Get('top')
  findTop() {
    const findOptions: FindManyOptions = {
      take: QUANTITY_TOP_WISHES,
      order: { copied: 'DESC' },
      relations: { owner: true },
    };

    try {
      return this.wishesService.findMany(findOptions);
    } catch (error) {
      this.logger.error('Ошибка получения топовых подарков', error);
      throw new DbError();
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', WishByIdPipePipe) wish) {
    return wish;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishDto: UpdateWishDto,
    @Req() req: Request & { user: User },
  ) {
    const wish = await this._wishCanBeChanged(req.user.id, id);

    if (
      'price' in updateWishDto &&
      wish.offers.length > 0 &&
      updateWishDto.price !== wish.price
    ) {
      throw new BadRequestException(
        'Нельзя изменять стоимость подарка, если уже есть желающие скинуться',
      );
    }

    await this.wishesService.update(id, updateWishDto);
    return {};
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: User },
  ) {
    const wish = await this._wishCanBeChanged(req.user.id, id);
    await this.wishesService.remove({ id });

    return wish;
  }

  @Post(':id/copy')
  @UseGuards(JwtAuthGuard)
  async copyWish(
    @Param('id', WishByIdPipePipe) wish,
    @Req() req: Request & { user: User },
  ) {
    const copyWish = {};
    creationFieldsWish.forEach((key) => {
      copyWish[key] = wish[key];
    });

    const newWish = plainToClass(CreateWishDto, copyWish);

    await this.wishesService.update(wish.id, { copied: wish.copied + 1 });

    return await this.wishesService.create(req.user, newWish);
  }

  async _wishCanBeChanged(userId: number, wishId: number) {
    const wish = await this.wishesService.findOne({
      where: { id: wishId },
      relations: { owner: true, offers: true },
    });

    if (!wish) {
      throw new BadRequestException(`хотелка с id:${wishId} не найдена`);
    }

    if (wish.owner.id.toString() !== userId.toString()) {
      throw new ForbiddenError('Можно изменять только свои хотелки');
    }
    return wish;
  }
}
