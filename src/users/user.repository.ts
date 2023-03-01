import {
  CreateUserDto,
  UpdateProfilePictureDto,
  UpdateUserDto,
} from './dto/user.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entites/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    this.userRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({ ...createUserDto })
      .execute();
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    return await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ ...updateUserDto })
      .where('id = :id', { id: userId })
      .execute();
  }
}
