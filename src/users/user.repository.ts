import { CreateUserDto } from './dto/user.dto';
import { Injectable, UseFilters } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MongoExceptionFilter,
  TypeOrmExceptionFilter,
} from '@common/middlewares/error/error.middleware';
import { User } from '@database/entites/user.entity';
import { Repository } from 'typeorm';
import { UpdateProfilePictureDto, UpdateUserDto } from './dto/request.user.dto';

@Injectable()
@UseFilters(new TypeOrmExceptionFilter())
@UseFilters(new MongoExceptionFilter())
export class UserRepository {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  public Mysql = {
    findById: async (userId: number): Promise<User> => {
      return this.userRepository.findOne({ where: { id: userId } });
    },

    insertUser: async (createUserDto: CreateUserDto) => {
      this.userRepository
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({ ...createUserDto })
        .execute();
    },

    updateUser: async (userId: number, updateUserDto: UpdateUserDto) => {
      return await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({ ...updateUserDto })
        .where('id = :id', { id: userId })
        .execute();
    },

    updateProfilePicture: async (
      userId: number,
      profilePictureDto: UpdateProfilePictureDto,
    ) => {
      await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({ ...profilePictureDto })
        .where('id = :id', { id: userId })
        .execute();
    },
  };
}
