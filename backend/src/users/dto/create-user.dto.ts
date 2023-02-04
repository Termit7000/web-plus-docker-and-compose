import { IsEmail, IsUrl, Length, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @Length(1, 64)
  username: string;

  @IsEmail()
  email: string;

  @MinLength(2)
  password: string;

  @MaxLength(200)
  about?: string = 'Пока ничего не рассказал о себе';

  @IsUrl()
  avatar?: string = 'https://i.pravatar.cc/300';
}
