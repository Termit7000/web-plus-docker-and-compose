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
  UseInterceptors,
  UseFilters,
  Inject,
} from '@nestjs/common';

import { ParseIntPipe } from '@nestjs/common/pipes';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { LoggerService } from '@nestjs/common/services';
import { FindManyOptions } from 'typeorm';

import { BadRequestException, ValidationError } from 'src/services/exceptions';

import { UserService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersDto } from './dto/find-users.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { HttpInterceptor } from 'src/services/interceptors/http.interceptor';
import { ServerExceptionFilter } from 'src/services/filters/server-exception.filter';
import { WishesService } from 'src/wishes/wishes.service';

@Controller('users')
@UseInterceptors(HttpInterceptor)
@UseFilters(ServerExceptionFilter)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly wishService: WishesService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findOwn(@Req() req) {
    const keys = this._getKeysUserWithEmail(req.user);

    return this.userService.findOne({
      select: keys,
      where: { id: req.user.id },
    });
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const user: User = req.user;
    const keys = this._getKeysUserWithEmail(req.user);

    return this.userService
      .updateOne(user.id, updateUserDto)
      .then(() =>
        this.userService.findOne({ select: keys, where: { id: user.id } }),
      )
      .catch((err) => {
        this.logger.error(
          `Ошибка обновления юзера: ${JSON.stringify(updateUserDto)}`,
          err,
        );
        throw new ValidationError();
      });
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.userService.findMany();
  }

  @Get('me/wishes')
  @UseGuards(JwtAuthGuard)
  getOwnWishes(@Req() req) {
    return this.wishService.findMany({
      where: { owner: { id: req.user.id } },
      relations: ['owner', 'offers', 'offers.user'],
    });
  }

  @Get(':username/wishes')
  @UseGuards(JwtAuthGuard)
  getWishes(@Param('username') username: string) {
    return this.wishService.findMany({
      where: { owner: { username } },
      relations: ['owner', 'offers', 'offers.user'],
    });
  }

  @Get(':username')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('username') username: string) {
    const user = await this.userService.findOne({ where: { username } });
    if (!user) {
      throw new BadRequestException(
        `пользователь username: ${username}  не найден `,
      );
    }

    return user;
  }

  @Post('find')
  @UseGuards(JwtAuthGuard)
  findMany(@Body() findUsersDto: FindUsersDto) {
    const nameOrEmail = findUsersDto.query;
    const query: FindManyOptions<User> = {
      where: [{ username: nameOrEmail }, { email: nameOrEmail }],
    };

    return this.userService.findMany(query);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.removeOne({ id });
  }

  _getKeysUserWithEmail(user) {
    const result = Object.keys(user) as [keyof User];
    result.push('email');
    return result;
  }
}
