import { PostsRepository } from './posts.repository';
import { BadRequestException, Injectable } from '@nestjs/common';

import { google } from 'googleapis';
import { ProcessUriService } from 'src/common/services/processUri.service';
import { CreatePostDto } from './dtos/posts.dto';

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

  async findYoutubeData(uri: string) {
    const { youtubeUri, host, query } = this.processUriService.findDomain(uri);
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

    const result: CreatePostDto = {
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
  }

  async findYoutubeChannelAuthorData(youtube_channel_id: string) {}

  async createPost(userId: number, youtubeData: CreatePostDto) {
    await this.postsRepository.create(userId, youtubeData);
  }
}
