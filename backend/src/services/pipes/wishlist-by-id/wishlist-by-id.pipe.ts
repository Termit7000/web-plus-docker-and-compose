import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { BadRequestException } from 'src/services/exceptions';
import { WishlistsService } from 'src/wishlists/wishlists.service';

@Injectable()
export class WishlistByIdPipe implements PipeTransform {
  constructor(private readonly wishListService: WishlistsService) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async transform(value: string, metadata: ArgumentMetadata) {
    const id = parseInt(value);

    if (isNaN(id) || !id) {
      throw new BadRequestException('Передано не число');
    }

    const wish = await this.wishListService.findOne({
      where: { id },
      relations: { owner: true, items: true },
    });
    if (!wish) {
      throw new BadRequestException(`Не обнаржен wishlist по id: ${value}`);
    }
    return wish;
  }
}
