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
export class ResponsePostListPageDto {
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
  @ApiProperty({ example: 'postDescription writed for user' })
  postPostDescription?: string;

  @ApiProperty({ example: 'youtube original video id' })
  postYoutubeVideoId: string;
  @ApiProperty({ example: 'user id' })
  userId: number;
  @ApiProperty({ example: 'user profile picture' })
  userProfilePicture: string;
  @ApiProperty({ example: 'user nickname' })
  userNickname: string;
  @ApiProperty({ example: 'user MBTI' })
  userMBTI?: string;
  @ApiProperty({ example: 'user gender' })
  userGender: string;

  @ApiProperty({
    example:
      '로그인한 유저인 경우에만 존재, 해당 게시물을 팔로우 했다면 1 아니라면 0',
  })
  isPostLike: number;

  @ApiProperty({
    example: '3',
    description: '댓글 갯수',
  })
  countComment: number;

  @ApiProperty({
    example: '1',
    description: '좋아요 갯수',
  })
  countLike: number;

  @ApiProperty({
    example: '1',
    description: '조회수 (로그인을 한 유저, 안한 유저 모두 체크 ,중복 허용)',
  })
  postView: number;
}

export class ResponsePostDetailPageDataDto {
  @ApiProperty({ example: 1 })
  postId: number;

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
  @ApiProperty({ example: 'postDescription writed for user' })
  postPostDescription?: string;

  @ApiProperty({ example: 'youtube original video id' })
  postYoutubeVideoId: string;
  @ApiProperty({ example: 'user id' })
  userId: number;
  @ApiProperty({ example: 'user profile picture' })
  userProfilePicture: string;
  @ApiProperty({ example: 'user nickname' })
  userNickname: string;
  @ApiProperty({ example: 'user MBTI' })
  userMBTI?: string;
  @ApiProperty({ example: 'user gender' })
  userGender: string;

  @ApiProperty({
    example:
      '로그인한 유저인 경우에만 존재, 해당 게시물을 팔로우 했다면 1 아니라면 0',
  })
  isPostLike: number;
}
