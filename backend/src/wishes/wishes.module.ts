import { Module } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { WishByIdPipePipe } from 'src/services/pipes/wish-by-id/wish-by-id.pipe';

@Module({
  imports: [TypeOrmModule.forFeature([Wish])],
  controllers: [WishesController],
  providers: [WishesService, WishByIdPipePipe],
  exports: [WishesService],
})
export class WishesModule {}
