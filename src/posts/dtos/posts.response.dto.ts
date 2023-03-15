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
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class ResponsePostDto {
  @ApiProperty({ example: 1 })
  postId: number;

  @ApiProperty({ example: 'youtube original uri' })
  postYoutubeUri: string;
  @ApiProperty({ example: 'youtube original title' })
  postYoutubeTitle: string;
  @ApiProperty({ example: 'youtube original title' })
  postYoutubeDescription: string;
  @ApiProperty({ example: 'youtube original created date(작성 날짜)' })
  postPublishedAt: string;
  @ApiProperty({ example: 'youtube original video Thumbnail' })
  postYoutubeVideoThumbnail: string;
  @ApiProperty({ example: 'postTitle writed for user' })
  postPostTitle: string;
  @ApiProperty({ example: 'youtube original video id' })
  postYoutubeVideoId: string;
  @ApiProperty({ example: 'user id' })
  userId: number;
  @ApiProperty({ example: 'user profile picture' })
  userProfilePicture: string;
  @ApiProperty({ example: 'user nickname' })
  userNickname: string;
  @ApiProperty({ example: 'user MBTI' })
  userMBTI: string;
  @ApiProperty({ example: 'user gender' })
  userGender: string;
}
