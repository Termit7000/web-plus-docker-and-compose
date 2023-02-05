import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { BadRequestException } from 'src/services/exceptions';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class WishByIdPipePipe implements PipeTransform {
  constructor(private readonly wishService: WishesService) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async transform(value: string, metadata: ArgumentMetadata) {
    const id = parseInt(value);

    if (isNaN(id) || !id) {
      throw new BadRequestException('Передано не число');
    }

    const wish = await this.wishService.findOne({
      where: { id },
      relations: ['owner', 'offers', 'offers.user'],
    });
    if (!wish) {
      throw new BadRequestException(`Не обнаржен подарок по id: ${value}`);
    }
    return wish;
  }
}
