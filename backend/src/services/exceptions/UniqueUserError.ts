import { InternalServerErrorException } from '@nestjs/common';

export class UniqueUserError extends InternalServerErrorException {
  constructor() {
    super('Такой пользователь уже существует', {
      description: 'InternalServerErrorException',
    });
  }
}
