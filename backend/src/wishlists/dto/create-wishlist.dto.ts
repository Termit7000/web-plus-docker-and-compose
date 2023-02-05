import { PickType } from '@nestjs/mapped-types';
import { Wishlist } from '../entities/wishlist.entity';
import { ArrayNotEmpty, IsNumber } from 'class-validator';

export class CreateWishlistDto extends PickType(Wishlist, ['name', 'image']) {
  @IsNumber({ allowInfinity: false, allowNaN: false }, { each: true })
  itemsId: number[];
}
