import { Injectable, UseFilters } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MongoExceptionFilter,
  TypeOrmExceptionFilter,
} from '@common/middlewares/error/error.middleware';
import { Like } from '@root/database/entites/like.entity';
import { UserIdAndPostIdDTO } from './dtos/like.dto';

@Injectable()
@UseFilters(new TypeOrmExceptionFilter())
@UseFilters(new MongoExceptionFilter())
export class LikesRepository {
  constructor(
    @InjectRepository(Like) private likeRepository: Repository<Like>,
  ) {}

  mysql = {
    findOneByUserIdAndPostId: async (
      userIdAndPostIdDTO: UserIdAndPostIdDTO,
    ) => {
      return await this.likeRepository.findOne({
        where: {
          // user: userIdAndPostIdDTO.userId,
          post: { id: userIdAndPostIdDTO.postId },
          user: { id: userIdAndPostIdDTO.userId },
        },
      });
    },

    createLike: async (userIdAndPostIdDTO: UserIdAndPostIdDTO) => {
      return this.likeRepository.save(
        this.likeRepository.create({
          user: userIdAndPostIdDTO.userId,
          post: userIdAndPostIdDTO.postId,
        }),
      );
    },

    deleteLike: async (userIdAndPostIdDTO: UserIdAndPostIdDTO) => {
      this.likeRepository.delete({
        user: userIdAndPostIdDTO.userId,
        post: userIdAndPostIdDTO.postId,
      });
    },
  };

  mongo = {};
}
