import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '@root/database/entites/comments.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dtos/comments.request.dto';

export class CommentsRepository {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
  ) {}

  mysql = {
    create: async (postId, userId, createCommentDto: CreateCommentDto) => {
      this.commentRepository
        .save(
          this.commentRepository.create({
            post: { id: postId },
            user: { id: userId },
            ...createCommentDto,
          }),
        )
        .catch((err) => {
          console.error(err);
        });
    },
  };
}
