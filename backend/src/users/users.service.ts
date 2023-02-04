import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

import { getPasswordHash } from 'src/utlils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  async findOne(query: FindOneOptions<User>) {
    return this.userRepository.findOne(query);
  }

  findMany(query: FindManyOptions<User> = {}) {
    return this.userRepository.find(query);
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    if ('password' in updateUserDto) {
      updateUserDto.password = await getPasswordHash(updateUserDto.password);
    }

    return this.userRepository.update({ id }, updateUserDto);
  }

  removeOne(query: FindOptionsWhere<User>) {
    return this.userRepository.delete(query);
  }
}
