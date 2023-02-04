import { NotAcceptableException } from '@nestjs/common';
export class BadRequestException extends NotAcceptableException {
  constructor(message: string) {
    super(message);
  }
}
