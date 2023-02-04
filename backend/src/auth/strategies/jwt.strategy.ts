import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { BadRequestException } from 'src/services/exceptions';
import { AuthService } from '../auth.service';

import { TUserJwtPayload } from '../types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
    });
  }

  async validate({ id }: TUserJwtPayload) {
    const user = await this.authService.getUserById(id);

    if (!user) {
      throw new BadRequestException(`пользователь c id: ${id}  не найден `);
    }

    return user;
  }
}
