import { Injectable } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { async } from 'rxjs';
import { CreateCommentDto } from './dtos/comments.request.dto';

@Injectable()
export class CommentsService {
  constructor(private commentsRepository: CommentsRepository) {}

  find = {
    findCommentByPostId: async (postId) => {
      return this.commentsRepository.mysql.findCommentByPostId(postId);
    },
  };

  create = {
    createComment: async (
      postId,
      userId,
      createCommentDto: CreateCommentDto,
    ) => {
      this.commentsRepository.mysql
        .create(postId, userId, createCommentDto)
        .catch((err) => {
          console.error(err);
        });
    },
  };
}
