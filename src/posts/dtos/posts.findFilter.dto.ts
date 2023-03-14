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
import { MBTI } from 'src/database/entites/enum/user.enum';

enum order {
  id = 'recent',
}

class PostFilterDto {
  @IsEnum(order)
  order?: string = 'recent';

  @IsEnum(MBTI)
  MBTI?: string = '미정';
}

export class FindPostFilterDto extends PostFilterDto {
  order?;
  MBTI?;
}
