import { OmitType, PartialType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';

export class UpdateUserDto extends OmitType(PartialType(User), [
  'id',
] as const) {}
