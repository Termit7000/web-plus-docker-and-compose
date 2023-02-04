import { ForbiddenException } from '@nestjs/common';
export class ForbiddenError extends ForbiddenException {
  constructor(message: string) {
    super(`Доступ запрещен: ${message}`, { description: 'ForbiddenException' });
  }
}
