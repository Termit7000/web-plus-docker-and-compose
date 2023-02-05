import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UseFilters,
  Req,
} from '@nestjs/common';

import { In } from 'typeorm';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { BadRequestException, ForbiddenError } from 'src/services/exceptions';

import { ServerExceptionFilter } from 'src/services/filters/server-exception.filter';
import { User } from 'src/users/entities/user.entity';

import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { HttpInterceptor } from 'src/services/interceptors/http.interceptor';
import { WishesService } from 'src/wishes/wishes.service';
import { WishlistByIdPipe } from 'src/services/pipes/wishlist-by-id/wishlist-by-id.pipe';

@Controller('wishlistlists')
@UseInterceptors(HttpInterceptor)
@UseFilters(ServerExceptionFilter)
export class WishlistsController {
  constructor(
    private readonly wishlistsService: WishlistsService,
    private readonly wishesService: WishesService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createWishlistDto: CreateWishlistDto,
    @Req() req: Request & { user: User },
  ) {
    const items = await this.wishesService.findMany({
      where: {
        id: In(createWishlistDto.itemsId),
        owner: { id: req.user.id },
      },
    });

    return this.wishlistsService.create(req.user, createWishlistDto, items);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.wishlistsService.findMany({
      relations: { owner: true, items: true },
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', WishlistByIdPipe) wishlist) {
    return wishlist;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', WishlistByIdPipe) wishlist,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Req() req,
  ) {
    if (wishlist.owner.id.toString() !== req.user.id.toString()) {
      throw new ForbiddenError('Изменять можно только свои списки');
    }

    let items = [];
    if ('itemsId' in updateWishlistDto) {
      items = await this.wishesService.findMany({
        where: {
          id: In(updateWishlistDto.itemsId),
          owner: { id: req.user.id },
        },
      });

      if (!items.length) {
        throw new BadRequestException('Не найдено подходящих хотелок');
      }
    }

    return this.wishlistsService.update(wishlist.id, updateWishlistDto, items);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', WishlistByIdPipe) wishlist, @Req() req) {
    if (wishlist.owner.id.toString() !== req.user.id.toString()) {
      throw new ForbiddenError('Удялять можно только свои списки');
    }
    await this.wishlistsService.remove(wishlist);
    return wishlist;
  }
}
