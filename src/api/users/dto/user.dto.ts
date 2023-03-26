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

export class CreateUserDto {
  nickname?;
  MBTI?;
  gender?;
  profilePicture?: string;
  authId;
}
