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

export class UpdateUserDto {
  @ApiProperty({ example: 'nickname' })
  @IsString()
  @Length(2, 12, { message: '닉네임은 2글자이상 12자 이하여야합니다.' })
  @Matches(/^[a-zA-Z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣\s]+$/, {
    message: '닉네임을 확인해주세요.',
  })
  nickname?;

  @ApiProperty({ description: '모두 대문자로', example: 'INFP' })
  @IsString()
  @IsEnum(MBTI, {
    message: 'MBTI형식이 올바르지 않습니다. => MBTI는 대문자로 입력해야합니다.',
  })
  MBTI?;

  @ApiProperty({
    description: 'man or women으로 보내야함 ',
    example: 'man | women',
  })
  @IsEnum(gender, { message: '성별 형식이 올바르지 않습니다. => man or women' })
  gender?;
}

export class UpdateProfilePictureDto {
  @ApiProperty({ description: '유저의 프로필 사진' })
  profileImage;
}

export class UpdateRandomNickname {
  @ApiProperty({ description: 'MBTI', example: 'ENFJ' })
  @IsString()
  @IsEnum(MBTI, {
    message: 'MBTI형식이 올바르지 않습니다. => MBTI는 대문자로 입력해야합니다.',
  })
  MBTI: string;
}
