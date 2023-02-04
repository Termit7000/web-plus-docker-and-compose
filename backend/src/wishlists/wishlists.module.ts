import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WishesModule } from 'src/wishes/wishes.module';

import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';

import { Wishlist } from './entities/wishlist.entity';
import { WishlistByIdPipe } from 'src/services/pipes/wishlist-by-id/wishlist-by-id.pipe';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist]), WishesModule],
  controllers: [WishlistsController],
  providers: [WishlistsService, WishlistByIdPipe],
})
export class WishlistsModule {}
