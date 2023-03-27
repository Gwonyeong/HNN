import { ParseIntPipe } from '@nestjs/common';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { MBTI } from '@root/database/entites/enum/user.enum';
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

class RequestPostDto {
  @ApiProperty({ example: 'only youtube URI' })
  @IsString()
  uri: string;

  @ApiProperty({ example: 'postTitle writed for user' })
  @IsString()
  postTitle: string;

  @ApiProperty({ example: 'postDescription writed for user' })
  @IsString()
  postDescription?: string;

  @ApiProperty({
    example: 'recent',
    description: 'recent : 최신순, view : 조회순',
    required: false,
  })
  order?: string;

  @ApiProperty({
    example: 'DESC',
    description: 'DESC : 내림차순 ASC : 오름차순',
    required: false,
  })
  sort?: 'DESC' | 'ASC';

  @ApiProperty({
    example: 'ENFJ',
    description:
      '해당하는 MBTI의 작성자가 작성한 게시물 필터링(아직은 하나만 가능)',
    required: false,
  })
  MBTI?: string = '';

  @ApiProperty({ example: '1', description: 'default: 1', required: false })
  page?: number = 1;

  @ApiProperty({ example: '10', description: 'default: 10', required: false })
  limit?: number = 10;

  @ApiProperty({ example: '', description: '검색 키워드', required: false })
  keyword?: string;

  postIds?: number[];
}

export class CreateRequestPostDto extends PickType(RequestPostDto, [
  'postTitle',
  `uri`,
  `postDescription`,
] as const) {}

export class UpdateRequestPostDto extends PickType(RequestPostDto, [
  'postTitle',
  `postDescription`,
] as const) {}

export class FindPostFilterDto extends PickType(RequestPostDto, [
  'order',
  `sort`,
  `MBTI`,
  `page`,
  `limit`,
  `keyword`,
  `postIds`,
] as const) {}
