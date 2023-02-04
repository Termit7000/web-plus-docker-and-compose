import { PickType } from '@nestjs/mapped-types';
import { Wish } from '../entities/wish.entity';

export const creationFieldsWish: Array<keyof Wish> = [
  'name',
  'link',
  'image',
  'price',
  'description',
];

export class CreateWishDto extends PickType(Wish, creationFieldsWish) {}
