import { ParseIntPipe } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
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

export class CreateRequestPostDto {
  @ApiProperty({ example: 'youtube uri' })
  @IsUrl()
  uri;

  @ApiProperty({ example: 'postTitle writed for user' })
  @IsString()
  postTitle: string;

  @ApiProperty({ example: 'postDescription writed for user' })
  @IsString()
  postDescription: string;
}

export class FindPostFilterDto {
  @ApiProperty({
    example: 'recent',
    description: 'recent : 최신순',
    required: false,
  })
  order?: string = 'recent';

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
  keyword: string;

  postIds: number[];
}

export class UpdatePostDto {
  @ApiProperty({ example: 'postTitle writed for user' })
  @IsString()
  postTitle: string;

  @ApiProperty({ example: 'postDescription writed for user' })
  @IsString()
  postDescription: string;
}
