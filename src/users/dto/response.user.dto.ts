import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsMultibyte,
  IsNumber,
  IsString,
  Length,
  Matches,
  Min,
} from 'class-validator';
import { MBTI, gender } from '@database/entites/enum/user.enum';

export class randomNicknameResponseDto {
  @ApiProperty({ example: '자랑스러운 ENFJ' })
  nickname;
}
