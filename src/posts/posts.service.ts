import { PostsRepository } from './posts.repository';
import { BadRequestException, Injectable } from '@nestjs/common';

import { google } from 'googleapis';
import { ProcessUriService } from 'src/common/services/processUri.service';
import { InsertPostDto, SearchPostDto } from './dtos/posts.dto';
import { Post } from 'src/database/entites/post.entity';

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

      const youtubeItems = {
        ...youtubeData.data.items[0].snippet,
      };
      const youtubeChannelData = await this.youtube.channels.list({
        part: ['snippet'],
        id: [youtubeItems.channelId],
      });

      const result: InsertPostDto = {
        youtubeUri,
        channelId: youtubeItems.channelId,
        title: youtubeItems.title,
        description: youtubeItems.description,
        channelTitle: youtubeItems.channelTitle,
        publishedAt: youtubeItems.publishedAt,
        channelThumbnail:
          youtubeChannelData.data.items[0].snippet.thumbnails.default.url,
      };

      return { youtubeData: result, tags: youtubeItems.tags };
    },

    findYoutubeChannelAuthorData: async (youtube_channel_id: string) => {},
  };

  public insert = {
    insertPost: async (
      userId: number,
      youtubeData: InsertPostDto,
    ): Promise<Post> => {
      return await this.postsRepository.Mysql.insertPost(userId, youtubeData);
    },

    insertPostOfSearchData: async (searchPostDto: SearchPostDto) => {
      await this.postsRepository.Mongo.insertPostOfSearc(searchPostDto);
    },
  };
}
