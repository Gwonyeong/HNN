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
