import { Injectable } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { async } from 'rxjs';
import { RequestCreateCommentDto } from './dtos/comments.request.dto';
import { User } from '@root/database/entites/user.entity';

@Injectable()
export class CommentsService {
  constructor(private commentsRepository: CommentsRepository) {}

  public common = {
    verifyCommentOwner: (userEntity: User, userId: number) => {
      return userEntity.id == userId;
    },
  };

  find = {
    findCommentByPostId: async (postId) => {
      return this.commentsRepository.mysql.findCommentByPostId(postId);
    },
  };

  create = {
    createComment: async (
      postId,
      userId,
      createCommentDto: RequestCreateCommentDto,
    ) => {
      this.commentsRepository.mysql
        .createComment(postId, userId, createCommentDto)
        .catch((err) => {
          console.error(err);
        });
    },
  };

  update = {
    updateComment: async (userId, commentId, comment) => {
      const commentData =
        await this.commentsRepository.mysql.findCommentByCommentId(commentId);
      this.common.verifyCommentOwner(commentData.user, userId);

      await this.commentsRepository.mysql.updateComment(commentId, comment);
    },
  };

  delete = {
    deleteComment: async (commentId, userId) => {
      const commenData =
        await this.commentsRepository.mysql.findCommentByCommentId(commentId);
      this.common.verifyCommentOwner(commenData.user, userId);
      await this.commentsRepository.mysql.deleteCommentByCommentId(commentId);
    },
  };
}
