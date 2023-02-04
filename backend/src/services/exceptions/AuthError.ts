import { UnauthorizedException } from '@nestjs/common';
export class AuthError extends UnauthorizedException {
  constructor() {
    super('Ошибка аутентификации', {
      description: 'UnauthorizedException',
    });
  }
}
