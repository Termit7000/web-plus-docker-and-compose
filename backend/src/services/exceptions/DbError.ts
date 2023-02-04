import { InternalServerErrorException } from '@nestjs/common';

export class DbError extends InternalServerErrorException {
  constructor() {
    super('Неопознанная ошибка сервера', {
      description: 'InternalServerErrorException',
    });
  }
}
