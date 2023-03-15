import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlpha,
  IsAlphanumeric,
  IsArray,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Post } from 'src/database/entites/post.entity';

class PostDto extends Post {
  postId?: number;

  youtubeVideoId;

  youtubeVideoThumnail;

  @IsString()
  youtubeUri: string;

  @IsString()
  channelId: string;

  @IsString()
  postTitle: string;

  @IsString()
  description?: string;

  @IsString()
  channelTitle: string;

  @IsDate()
  publishedAt: Date;

  @IsArray()
  tags?: Array<string>;

  @IsString()
  channelThumbnail: string;
}

export class InsertPostDto {
  youtubeVideoId;
  youtubeVideoThumnail: string;
  channelId;
  youtubeUri;
  youtubeTitle: string;
  description?;
  channelTitle;
  publishedAt;
  channelThumbnail;
}

export class SearchPostDto {
  postId: number;
  title: string;
  description?: string;
  tags?: string[];
}
