import { Repository } from 'typeorm';
import { Injectable, UseFilters } from '@nestjs/common';
import { InsertPostDto } from './dtos/posts.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  SearchPost,
  SearchPostDocument,
} from '@database/schema/searchPosh.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '@database/entites/post.entity';
import {
  MongoExceptionFilter,
  TypeOrmExceptionFilter,
} from '@common/middlewares/error/error.middleware';
import { FindPostFilterDto, UpdatePostDto } from './dtos/posts.request.dto';

@Injectable()
@UseFilters(new TypeOrmExceptionFilter())
@UseFilters(new MongoExceptionFilter())
export class PostsRepository {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectModel(SearchPost.name)
    private searchPostModel: Model<SearchPost>,
  ) {}

  public Mysql = {
    findById: async (postId) => {
      return await this.postRepository.findOne({
        where: { id: postId },
        relations: ['user'],
      });
    },

    findDetailPost: async (postId) => {
      const findPostDetailDataQuery = this.postRepository
        .createQueryBuilder('post')
        .select([
          'post.id AS postId',
          'post.youtubeUri AS postYoutubeUri',
          'post.youtubeTitle AS postYoutubeTitle',
          'post.description AS postYoutubeDescription',
          'post.publishedAt AS postPublishedAt',
          `post.youtubeVideoThumbnail AS postYoutubeVideoThumbnail`,
          `post.postTitle AS postPostTitle`,
          `post.youtubeVideoId AS postYoutubeVideoId`,

          `user.id AS userId`,
          `CASE WHEN LEFT(user.profilePicture, 4) = 'HTTP' 
            THEN user.profilePicture 
            ELSE CONCAT('${process.env.AWS_S3_CLOUDFRONT_DOMAIN}${process.env.S3_AVATAR_PATH}', user.profilePicture)
            END AS userProfilePicture `,
          `user.nickname AS userNickname`,
          `user.MBTI AS userMBTI`,
          `user.gender AS userGender`,
        ])
        .leftJoin('post.user', 'user')
        .where(`post.id = :postId`, { postId });

      return await findPostDetailDataQuery.getRawMany();
    },

    findPost: async (userId, findPostFilterDto: FindPostFilterDto) => {
      const findPostQuery = this.postRepository
        .createQueryBuilder('post')
        .select([
          'post.id AS postId',
          'post.youtubeUri AS postYoutubeUri',
          'post.youtubeTitle AS postYoutubeTitle',
          'post.description AS postYoutubeDescription',
          'post.publishedAt AS postPublishedAt',
          `post.youtubeVideoThumbnail AS postYoutubeVideoThumbnail`,
          `post.postTitle AS postPostTitle`,
          `post.youtubeVideoId AS postYoutubeVideoId`,

          `user.id AS userId`,
          `CASE WHEN LEFT(user.profilePicture, 4) = 'HTTP' 
            THEN user.profilePicture 
            ELSE CONCAT('${process.env.AWS_S3_CLOUDFRONT_DOMAIN}${process.env.S3_AVATAR_PATH}', user.profilePicture)
            END AS userProfilePicture `,
          `user.nickname AS userNickname`,
          `user.MBTI AS userMBTI`,
          `user.gender AS userGender`,
        ])
        .innerJoin('post.user', 'user');

      if (findPostFilterDto.MBTI) {
        findPostQuery.where('user.MBTI = :MBTI', {
          MBTI: findPostFilterDto.MBTI,
        });
      }
      if (userId) {
        findPostQuery
          .addSelect(
            `CASE WHEN like.id IS NULL THEN '0' ELSE '1' END AS isPostLike `,
          )
          .leftJoin(
            'like',
            'like',
            `like.post = post.id AND like.userId = ${userId}`,
          );
      }

      if (findPostFilterDto.postIds) {
        findPostQuery.where(`post.id LIKE :postIds`, {
          postIds: findPostFilterDto.postIds,
        });
      }

      const offset = (findPostFilterDto.page - 1) * findPostFilterDto.limit;
      findPostQuery.limit(findPostFilterDto.limit).offset(offset);
      findPostQuery.orderBy(
        findPostFilterDto.order == 'recent'
          ? 'post.id'
          : findPostFilterDto.order,
      );
      return await findPostQuery.getRawMany();
    },

    insertPost: async (
      userId: number,
      postData: object,
      youtubeData: InsertPostDto,
    ): Promise<Post> => {
      return await this.postRepository.save(
        this.postRepository.create({
          ...youtubeData,
          ...postData,
          user: { id: userId },
        }),
      );
    },

    updatePost: async (postId: number, updatePostDto: UpdatePostDto) => {
      await this.postRepository.update({ id: postId }, { ...updatePostDto });
    },

    deletePost: async (postId) => {
      await this.postRepository.delete({ id: postId });
    },
  };

  public Mongo = {
    findBySearchKeyword: async (searchKeyword) => {
      const postSearchMongoData = await this.searchPostModel
        .find({
          $or: [
            { title: { $regex: searchKeyword } },
            { description: { $regex: searchKeyword } },
            { tags: { $regex: searchKeyword } },
          ],
        })
        .select('postId')
        .lean();
      const postIds = Object.values(postSearchMongoData).map(
        (item) => item.postId,
      );
      return postIds;
    },

    insertPostOfSearc: async (SearchPostDto) => {
      const insertSearchPost = new this.searchPostModel(SearchPostDto);
      insertSearchPost.save();
    },

    deleteByPostId: async (postId) => {
      await this.searchPostModel.deleteOne({
        postId,
      });
    },
  };
}
