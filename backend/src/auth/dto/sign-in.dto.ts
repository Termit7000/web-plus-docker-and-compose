import { PickType } from '@nestjs/mapped-types';
import { User } from 'src/users/entities/user.entity';

export class signInDto extends PickType(User, [
  'username',
  'password',
] as const) {}
