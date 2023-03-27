import { CommentsRepository } from './../comments/comments.repository';
import {
  FindPostFilterDto,
  UpdateRequestPostDto,
} from './dtos/posts.request.dto';
import { PostsRepository } from './posts.repository';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { google } from 'googleapis';
import { ProcessUriService } from '@common/services/processUri.service';
import { InsertPostDto, SearchPostDto } from './dtos/posts.dto';
import { Post } from '@database/entites/post.entity';
import { User } from '@root/database/entites/user.entity';
import { ResponsePostListPageDto } from './dtos/posts.response.dto';

@Injectable()
export class PostsService {
  constructor(
    private processUriService: ProcessUriService,
    private postsRepository: PostsRepository,
  ) {}

  private readonly youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY,
  });

  public common = {
    verifyPostOwner: (userEntity: User, userId: number) => {
      if (userEntity.id !== userId) {
        throw new UnauthorizedException(`권한이 없습니다.`);
      }
    },
  };

  public find = {
    findDetailPostData: async (postId, userId) => {
      const findDetailPostData =
        await this.postsRepository.Mysql.findDetailPost(postId);

      if (!findDetailPostData) {
        throw new BadRequestException('잘못된 접근입니다.');
      }
      await this.postsRepository.Mongo.createPostView(
        postId,
        userId ? userId : 0,
      );
      const postViewData = await this.postsRepository.Mongo.findCountPostView(
        postId,
      );
      this.postsRepository.Mysql.updatePostCountView(postId, postViewData);
      return findDetailPostData;
    },

    findPostData: async (userId, findPostFilterDto: FindPostFilterDto) => {
      if (!findPostFilterDto.keyword) {
        return this.postsRepository.Mysql.findPost(userId, findPostFilterDto);
      }
      findPostFilterDto.postIds =
        await this.postsRepository.Mongo.findBySearchKeyword(
          findPostFilterDto.keyword,
        );
      return this.postsRepository.Mysql.findPost(userId, findPostFilterDto);
    },

    findYoutubeData: async (uri: string) => {
      const { youtubeUri, host, query } =
        this.processUriService.findDomain(uri);
      if (host !== 'www.youtube.com') {
        throw new BadRequestException('유튜브 URI만 등록가능합니다.');
      }
      const youtubeData = await this.youtube.videos.list({
        part: ['snippet', 'contentDetails'],
        id: query.v,
      });
      const youtubeItems = youtubeData.data.items[0];
      const youtubeItemsSnippet = youtubeItems.snippet;

      const youtubeChannelData = await this.youtube.channels.list({
        part: ['snippet'],
        id: [youtubeItemsSnippet.channelId],
      });
      const result: InsertPostDto = {
        youtubeVideoId: youtubeItems.id,
        youtubeVideoThumbnail: youtubeItemsSnippet.thumbnails.standard.url,
        youtubeUri,
        channelId: youtubeItemsSnippet.channelId,
        youtubeTitle: youtubeItemsSnippet.title,
        youtubeDescription: youtubeItemsSnippet.description,
        channelTitle: youtubeItemsSnippet.channelTitle,
        publishedAt: youtubeItemsSnippet.publishedAt,
        channelThumbnail:
          youtubeChannelData.data.items[0].snippet.thumbnails.default.url,
      };
      return { youtubeData: result, tags: youtubeItemsSnippet.tags };
    },
  };

  public create = {
    createPost: async (
      userId: number,
      postData: object,
      youtubeData: InsertPostDto,
    ): Promise<Post> => {
      return await this.postsRepository.Mysql.insertPost(
        userId,
        postData,
        youtubeData,
      );
    },

    createPostOfSearchData: async (searchPostDto: SearchPostDto) => {
      await this.postsRepository.Mongo.createPostOfSearch(searchPostDto);
    },
  };

  public update = {
    updatePost: async (
      postId: number,
      userId: number,
      updatePostDto: UpdateRequestPostDto,
    ) => {
      const postData = await this.postsRepository.Mysql.findById(postId);

      this.common.verifyPostOwner(postData.user, userId);

      await this.postsRepository.Mysql.updatePost(postId, updatePostDto);
    },
  };

  public delete = {
    deletePost: async (postId: number, userId: number) => {
      const postData = await this.postsRepository.Mysql.findById(postId);
      this.common.verifyPostOwner(postData.user, userId);
      this.postsRepository.Mysql.deletePost(postId);
    },
  };
}
