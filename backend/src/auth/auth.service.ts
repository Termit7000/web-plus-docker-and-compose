import * as bcrypt from 'bcrypt';
import { Injectable, Inject, LoggerService } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { UniqueUserError } from 'src/services/exceptions';
import { User } from 'src/users/entities/user.entity';
import { UserService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { TUserJwtPayload } from './types';
import { getPasswordHash } from 'src/utlils';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const hash = await getPasswordHash(createUserDto.password);
      const userWithHash = { ...createUserDto, password: hash };
      return await this.userService.create(userWithHash);
    } catch (err) {
      this.logger.error(
        `Ошибка создания пользователя ${createUserDto.username}`,
        err,
      );

      throw new UniqueUserError();
    }
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne({
      select: ['id', 'username', 'password'],
      where: { username },
    });

    const isCorrect = user && bcrypt.compareSync(pass, user.password);

    if (!isCorrect) {
      return null;
    }

    return user;
  }

  async login(user: User) {
    const payload: TUserJwtPayload = { id: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  getUserById(id: number) {
    return this.userService.findOne({ where: { id } });
  }
}
