import { FindPostFilterDto } from './dtos/posts.request.dto';
import { PostsRepository } from './posts.repository';
import { BadRequestException, Injectable } from '@nestjs/common';

import { google } from 'googleapis';
import { ProcessUriService } from '@common/services/processUri.service';
import { InsertPostDto, SearchPostDto } from './dtos/posts.dto';
import { Post } from '@database/entites/post.entity';

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

  public find = {
    findPostData: async (userId, findPostFilterDto: FindPostFilterDto) => {
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
      // console.log(youtubeItems);
      const result: InsertPostDto = {
        youtubeVideoId: youtubeItems.id,
        youtubeVideoThumbnail: youtubeItemsSnippet.thumbnails.standard.url,
        youtubeUri,
        channelId: youtubeItemsSnippet.channelId,
        youtubeTitle: youtubeItemsSnippet.title,
        description: youtubeItemsSnippet.description,
        channelTitle: youtubeItemsSnippet.channelTitle,
        publishedAt: youtubeItemsSnippet.publishedAt,
        channelThumbnail:
          youtubeChannelData.data.items[0].snippet.thumbnails.default.url,
      };
      return { youtubeData: result, tags: youtubeItemsSnippet.tags };
    },
  };

  public insert = {
    insertPost: async (
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

    insertPostOfSearchData: async (searchPostDto: SearchPostDto) => {
      await this.postsRepository.Mongo.insertPostOfSearc(searchPostDto);
    },
  };
}
