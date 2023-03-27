import { ApiProperty, PickType } from '@nestjs/swagger';
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
import { Post } from '@database/entites/post.entity';

export class PostDto {
  postId?: number;

  youtubeVideoId;

  youtubeVideoThumbnail;

  youtubeTitle;

  @ApiProperty({ example: 'only youtube URI' })
  @IsString()
  youtubeUri: string;

  @IsString()
  channelId: string;

  @ApiProperty({ example: 'postTitle writed for user' })
  @IsString()
  postTitle: string;

  @IsString()
  postDescription?: string;

  @IsString()
  youtubeDescription?: string;

  @IsString()
  channelTitle: string;

  publishedAt: string;

  @IsArray()
  tags?: string[];

  @IsString()
  channelThumbnail: string;
}

export class InsertPostDto extends PickType(PostDto, [
  'youtubeVideoId',
  'youtubeVideoThumbnail',
  'channelId',
  'youtubeUri',
  'youtubeTitle',
  'youtubeDescription',
  'channelTitle',
  'publishedAt',
  'channelThumbnail',
] as const) {}

export class SearchPostDto extends PickType(PostDto, [
  'postId',
  'postTitle',
  'postDescription',
  'tags',
]) {}
