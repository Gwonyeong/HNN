import { Injectable } from '@nestjs/common';

import { google } from 'googleapis';
import { ProcessUriService } from 'src/common/services/processUri.service';
import { CreatePostDto } from './posts.dto';

@Injectable()
export class PostsService {
  constructor(private processUriService: ProcessUriService) {}

  private readonly youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY,
  });

  async findYoutubeData(uri: string) {
    const { query } = this.processUriService.findDomain(uri);

    const youtubeData = await this.youtube.videos.list({
      part: ['snippet', 'contentDetails'],
      id: query.v,
    });
    console.log(youtubeData.data.items[0].contentDetails);

    const youtubeItems = {
      ...youtubeData.data.items[0].snippet,
    };
    const youtubeChannelData = await this.youtube.channels.list({
      part: ['snippet'],
      id: [youtubeItems.channelId],
    });

    const result: CreatePostDto = {
      channelId: youtubeItems.channelId,
      title: youtubeItems.title,
      description: youtubeItems.description,
      channelTitle: youtubeItems.channelTitle,
      publishedAt: youtubeItems.publishedAt,
      tags: youtubeItems.tags,
      channelThumbnail:
        youtubeChannelData.data.items[0].snippet.thumbnails.default,
    };

    return result;
  }

  async findYoutubeChannelAuthorData(youtube_channel_id: string) {}
}
