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

class PostDto {
  @IsString()
  channelId?: string;

  @IsString()
  title?: string;

  @IsString()
  description?: string;

  @IsString()
  channelTitle?: string;

  @IsDate()
  publishedAt?: Date;

  @IsArray()
  tags?: Array<string>;

  @IsString()
  channelThumbnail?: string;
}

export class CreatePostDto extends PostDto {
  channelId?;
  title?;
  description?;
  channelTitle?;
  publishedAt?;
  tags?;
  channelThumbnail;
}
