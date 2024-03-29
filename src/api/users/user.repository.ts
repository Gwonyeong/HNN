import { CreateUserDto } from './dto/user.dto';
import { Injectable, UseFilters } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MongoExceptionFilter,
  TypeOrmExceptionFilter,
} from '@common/middlewares/error/error.middleware';
import { User } from '@database/entites/user.entity';
import { Repository } from 'typeorm';
import { UpdateprofileImageDto, UpdateUserDto } from './dto/user.request.dto';

@Injectable()
@UseFilters(new TypeOrmExceptionFilter())
@UseFilters(new MongoExceptionFilter())
export class UserRepository {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  public Mysql = {
    findById: async (userId: string): Promise<any> => {
      const findUserQuery = this.userRepository
        .createQueryBuilder('user')
        .select([
          `user.id AS userId`,

          `user.nickname AS userNickname`,

          `user.MBTI AS userMBTI`,

          `CASE WHEN user.profileImage IS NULL 
          THEN '${process.env.AWS_S3_CLOUDFRONT_DOMAIN}${process.env.S3_AVATAR_PATH}${process.env.S3_AVATAR_DEFAULT_IMAGE}'
          ELSE CONCAT('${process.env.AWS_S3_CLOUDFRONT_DOMAIN}${process.env.S3_AVATAR_PATH}', user.profileImage) 
          END AS userProfileImage`,

          `user.gender AS userGender`,
          `user.role AS userRole`,
        ])
        .where('user.id = :userId', { userId });

      return await findUserQuery.getRawOne();
    },

    insertUser: async (createUserDto: CreateUserDto) => {
      return await this.userRepository.save(
        this.userRepository.create({
          ...createUserDto,
        }),
      );
    },

    updateUser: async (userId: number, updateUserDto: UpdateUserDto) => {
      return await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({ ...updateUserDto })
        .where('id = :id', { id: userId })
        .execute();
    },

    updateprofileImage: async (
      userId: number,
      profileImageDto: UpdateprofileImageDto,
    ) => {
      await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({ ...profileImageDto })
        .where('id = :id', { id: userId })
        .execute();
    },
  };
}
