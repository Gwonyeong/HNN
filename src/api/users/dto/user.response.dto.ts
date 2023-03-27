import { ApiProperty, PickType } from '@nestjs/swagger';
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

class ResponseUserDto {
  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 'nickname' })
  @IsString()
  userNickname?: string;

  @ApiProperty({ description: '모두 대문자로', example: 'INFP' })
  @IsString()
  userMBTI?: string;

  @ApiProperty({
    description: 'man or women으로 보내야함 ',
    example: 'man | women | 미정',
  })
  userGender?: string;

  @IsNumber()
  authId?: number;

  @ApiProperty({ description: '유저의 프로필 사진' })
  @IsMultibyte()
  userProfileImage?: string;

  @ApiProperty({ description: 'user role' })
  userRole: string;
}

export class randomNicknameResponseDto {
  @ApiProperty({ example: '자랑스러운 ENFJ' })
  nickname;
}

export class FindUserResponseDto extends PickType(ResponseUserDto, [
  `userId`,
  `userNickname`,
  `userMBTI`,
  `userGender`,
  `authId`,
  `userProfileImage`,
  `userRole`,
  `userId`,
]) {}
