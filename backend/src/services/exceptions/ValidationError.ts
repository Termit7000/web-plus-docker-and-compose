import { BadRequestException } from '@nestjs/common';

export class ValidationError extends BadRequestException {
  constructor() {
    super(`Ошибка валидации переданных значений`, {
      description: 'ValidationError',
    });
  }
}
