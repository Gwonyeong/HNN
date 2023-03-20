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

class RequestPostDto {
  @ApiProperty({ example: 'youtube uri' })
  @IsUrl()
  uri: string;

  @ApiProperty({ example: 'postTitle writed for user' })
  @IsString()
  postTitle: string;
}

export class CreateRequestPostDto extends RequestPostDto {
  uri;
  postTitle: string;
}

enum order {
  'recent',
}

export class FindPostFilterDto {
  @ApiProperty({ example: 'recent : 최신순 : ' })
  @IsEnum(order)
  order?: string = 'recent';

  @IsString()
  MBTI? = '';

  page? = 1;

  limit? = 10;
}
