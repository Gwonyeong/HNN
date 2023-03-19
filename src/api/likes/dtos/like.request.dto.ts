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

export class CreateLikeDto {
  @ApiProperty({
    example: 1,
    description: '해당 포스트를 좋아요 또는 좋아요 취소',
  })
  postId: number;
}
