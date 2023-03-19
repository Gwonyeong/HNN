import { UserIdAndPostIdDTO } from './dtos/like.dto';
import { Injectable } from '@nestjs/common';
import { LikesRepository } from './likes.repository';

@Injectable()
export class LikesService {
  constructor(private likeRepository: LikesRepository) {}

  find = {
    findOneLike: async (userIdAndPostIdDTO: UserIdAndPostIdDTO) => {
      return await this.likeRepository.mysql.findOneByUserIdAndPostId(
        userIdAndPostIdDTO,
      );
    },
  };

  create = {
    create: async (userIdAndPostIdDTO: UserIdAndPostIdDTO) => {
      this.likeRepository.mysql.createLike(userIdAndPostIdDTO).catch((err) => {
        console.error(err);
      });
    },
  };

  delete = {
    deleteOne: async (userIdAndPostIdDTO: UserIdAndPostIdDTO) => {
      this.likeRepository.mysql.deleteLike(userIdAndPostIdDTO).catch((err) => {
        console.error(err);
      });
    },
  };
}
