import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '@root/database/entites/comments.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dtos/comments.request.dto';
import { Post } from '@root/database/entites/post.entity';
import { ResponseCommentDto } from './dtos/comments.response.dto';

export class CommentsRepository {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,

    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
  ) {}

  mysql = {
    findCommentByPostId: async (postId): Promise<ResponseCommentDto[]> => {
      const findCommentDataQuery = this.postRepository
        .createQueryBuilder('post')
        .select([
          `comment.id AS commentId`,
          `comment.comment AS comment`,
          `user.id AS userId`,
          `user.nickname AS userNickname`,
          `user.MBTI AS userMBTI`,
          `user.gender AS userGender`,
          `CASE WHEN LEFT(user.profilePicture, 4) = 'HTTP' 
            THEN user.profilePicture 
            ELSE CONCAT('${process.env.AWS_S3_CLOUDFRONT_DOMAIN}${process.env.S3_AVATAR_PATH}', user.profilePicture)
            END AS userProfilePicture `,
        ])
        .innerJoin(`comment`, 'comment')
        .innerJoin(`user`, `user`, `comment.userId = user.id`)
        .where(`post.id = :postId`, { postId });
      return await findCommentDataQuery.getRawMany();
    },

    create: async (postId, userId, createCommentDto: CreateCommentDto) => {
      await this.commentRepository.save(
        this.commentRepository.create({
          post: postId,
          user: userId,
          ...createCommentDto,
        }),
      );
    },
  };
}
