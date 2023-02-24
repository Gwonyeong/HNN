import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlpha,
  IsAlphanumeric,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({
    example: 'example@gmail.com',
    description: 'The email address of the user',
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
  })
  @IsString()
  @MinLength(6, { message: '비밀번호를 확인해주세요.' })
  @MaxLength(20, { message: '비밀번호를 확인해주세요.' })
  password?: string;

  @ApiProperty({ example: 'nickname', description: 'The nickname of the user' })
  @IsString()
  @IsAlphanumeric()
  @MinLength(2, { message: '닉네임을 확인해주세요.' })
  @MaxLength(12, { message: '닉네임을 확인해주세요.' })
  nickname?: string;

  @ApiProperty({
    example: 'ISTJ',
    description: 'The MBTI personality type of the user',
  })
  @IsEnum({
    ENFJ: 'ENFJ',
    ENFP: 'ENFP',
    ENTJ: 'ENTJ',
    ENTP: 'ENTP',
    ESFJ: 'ESFJ',
    ESFP: 'ESFP',
    ESTJ: 'ESTJ',
    ESTP: 'ESTP',
    INFJ: 'INFJ',
    INFP: 'INFP',
    INTJ: 'INTJ',
    INTP: 'INTP',
    ISFJ: 'ISFJ',
    ISFP: 'ISFP',
    ISTJ: 'ISTJ',
    ISTP: 'ISTP',
  })
  MBTI?: string;
}
