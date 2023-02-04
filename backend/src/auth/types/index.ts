import { User } from 'src/users/entities/user.entity';

export type TUserJwtPayload = Pick<User, 'id'>;
