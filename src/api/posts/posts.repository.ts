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
import {
  FindPostFilterDto,
  UpdateRequestPostDto,
} from './dtos/posts.request.dto';
import { PostView } from '@root/database/schema/postView.schema';
import { ResponsePostListPageDto } from './dtos/posts.response.dto';

const postRepositoryAlias = {
  postId: 'post.id AS postId',
  postYoutubeUri: 'post.youtubeUri AS postYoutubeUri',
  postYoutubeTitle: 'post.youtubeTitle AS postYoutubeTitle',
  postYoutubeDescription: 'post.description AS postYoutubeDescription',
  postPublishedAt: 'post.publishedAt AS postPublishedAt',
  postYoutubeVideoThumbnail:
    'post.youtubeVideoThumbnail AS postYoutubeVideoThumbnail',
  postPostTitle: 'post.postTitle AS postPostTitle',
  postYoutubeVideoId: 'post.youtubeVideoId AS postYoutubeVideoId',

  userId: 'user.id AS userId',
  userProfileImage: `CASE WHEN LEFT(user.profileImage, 4) = 'HTTP' 
      THEN user.profileImage 
      ELSE CONCAT('${process.env.AWS_S3_CLOUDFRONT_DOMAIN}${process.env.S3_AVATAR_PATH}', user.profileImage)
      END AS userProfileImage`,
  userNickname: 'user.nickname AS userNickname',
  userMBTI: 'user.MBTI AS userMBTI',
  userGender: 'user.gender AS userGender',

  countView: `post.countView AS countPostView`,
};

@Injectable()
@UseFilters(new TypeOrmExceptionFilter())
@UseFilters(new MongoExceptionFilter())
export class PostsRepository {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectModel(SearchPost.name)
    private searchPostModel: Model<SearchPost>,
    @InjectModel(PostView.name)
    private postViewModel: Model<PostView>,
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
          postRepositoryAlias.postId,
          postRepositoryAlias.postYoutubeUri,
          postRepositoryAlias.postYoutubeTitle,
          postRepositoryAlias.postYoutubeDescription,
          postRepositoryAlias.postPublishedAt,
          postRepositoryAlias.postYoutubeVideoThumbnail,
          postRepositoryAlias.postPostTitle,
          postRepositoryAlias.postYoutubeVideoId,

          postRepositoryAlias.userId,
          `CASE WHEN LEFT(user.profileImage, 4) = 'HTTP' 
          THEN user.profileImage 
          ELSE CONCAT('${process.env.AWS_S3_CLOUDFRONT_DOMAIN}${process.env.S3_AVATAR_PATH}', user.profileImage)
          END AS userProfileImage`,
          postRepositoryAlias.userNickname,
          postRepositoryAlias.userMBTI,
          postRepositoryAlias.userGender,
        ])
        .leftJoin('post.user', 'user')

        .where(`post.id = :postId`, { postId });

      return await findPostDetailDataQuery.getRawMany();
    },

    findMaxPageNumber: async (userId, findPostFilterDto: FindPostFilterDto) => {
      const findPostMaxPageQuery = this.postRepository
        .createQueryBuilder('post')
        .select(['COUNT ( post.id) AS maxPageNumber'])
        .innerJoin('post.user', 'user');

      if (findPostFilterDto.MBTI) {
        findPostMaxPageQuery.where('user.MBTI = :MBTI', {
          MBTI: findPostFilterDto.MBTI,
        });
      }
      if (findPostFilterDto.postIds) {
        findPostMaxPageQuery.where(`post.id LIKE :postIds`, {
          postIds: findPostFilterDto.postIds,
        });
      }
      return await findPostMaxPageQuery.getRawMany();
    },

    findPost: async (userId, findPostFilterDto: FindPostFilterDto) => {
      // post테이블에 countComment와 countLike를 넣는게 더 효율적이겠지만 서브쿼리 연습을 위해 아래와 같이 구현
      const findCommentCountSubQuery = this.postRepository
        .createQueryBuilder('post')
        .select([`C10.postId AS postId`, `COUNT(C10.id) AS commentCount`])
        .innerJoin('comment', 'C10', `post.id = C10.postId`)
        .groupBy(`C10.postId`);

      const findLikeCountSubQuery = this.postRepository
        .createQueryBuilder('post')
        .select([`L10.postId AS postId`, `COUNT(L10.id) AS likeCount`])
        .innerJoin('like', 'L10', `post.id = L10.postId`)
        .groupBy(`L10.postId`);

      const findPostQuery = this.postRepository
        .createQueryBuilder('post')
        .select([
          postRepositoryAlias.postId,
          postRepositoryAlias.postYoutubeUri,
          postRepositoryAlias.postYoutubeTitle,
          postRepositoryAlias.postYoutubeDescription,
          postRepositoryAlias.postPublishedAt,
          postRepositoryAlias.postYoutubeVideoThumbnail,
          postRepositoryAlias.postPostTitle,
          postRepositoryAlias.postYoutubeVideoId,
          postRepositoryAlias.countView,

          postRepositoryAlias.userId,
          `CASE WHEN LEFT(user.profileImage, 4) = 'HTTP' 
      THEN user.profileImage 
      ELSE CONCAT('${process.env.AWS_S3_CLOUDFRONT_DOMAIN}${process.env.S3_AVATAR_PATH}', user.profileImage)
      END AS userProfileImage`,
          postRepositoryAlias.userNickname,
          postRepositoryAlias.userMBTI,
          postRepositoryAlias.userGender,

          `CASE WHEN commentCount.commentCount IS NULL 
            THEN 0
            ELSE commentCount.commentCount
            END AS countComment`,
          `CASE WHEN likeCount.likeCount IS NULL 
            THEN 0
            ELSE likeCount.likeCount
            END AS countLike`,
        ])
        .innerJoin('post.user', 'user')
        .leftJoin(
          '(' + findCommentCountSubQuery.getQuery() + ')',
          'commentCount',
          `post.id = commentCount.postId`,
        )
        .leftJoin(
          '(' + findLikeCountSubQuery.getQuery() + ')',
          'likeCount',
          `post.id = likeCount.postId`,
        );

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

      switch (findPostFilterDto.order) {
        case 'view': {
          findPostQuery.orderBy(`post.countView`, findPostFilterDto.sort);
          break;
        }
        default: {
          findPostQuery.orderBy(`post.id`, findPostFilterDto.sort);
          break;
        }
      }

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

    updatePost: async (postId: number, updatePostDto: UpdateRequestPostDto) => {
      await this.postRepository.update({ id: postId }, { ...updatePostDto });
    },

    updatePostCountView: async (postId, countView) => {
      await this.postRepository.update({ id: postId }, { countView });
    },

    deletePost: async (postId) => {
      await this.postRepository.delete({ id: postId });
    },
  };

  public Mongo = {
    findCountPostView: async (postId) => {
      const postCountViewData = await this.postViewModel
        .count({ postId })
        .count()
        .exec();
      return postCountViewData;
    },

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

    createPostOfSearch: async (SearchPostDto) => {
      const createSearchPost = new this.searchPostModel(SearchPostDto);
      createSearchPost.save();
    },

    createPostView: async (postId, userId) => {
      const createPostView = new this.postViewModel({ postId, userId });
      await createPostView.save();
    },

    deleteByPostId: async (postId) => {
      await this.searchPostModel.deleteOne({
        postId,
      });
    },
  };
}
