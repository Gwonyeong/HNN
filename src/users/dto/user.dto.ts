import {
  IsEnum,
  IsNumber,
  IsString,
  Length,
  Matches,
  Min,
} from 'class-validator';
import { MBTI, gender } from 'src/entites/enum/user.enum';
class UserDto {
  @IsString()
  @Length(2, 12, { message: '닉네임은 2글자이상 12자 이하여야합니다.' })
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: '닉네임을 확인해주세요.',
  })
  nickname?: string;

  @IsString()
  @IsEnum(MBTI, {
    message: 'MBTI형식이 올바르지 않습니다. => MBTI는 대문자로 입력해야합니다.',
  })
  MBTI?: string;

  @IsEnum(gender, { message: '성별 형식이 올바르지 않습니다. => man or women' })
  gender?: string;

  @IsNumber()
  authId?: number;

  @IsString()
  profilePicture?: string;
}

export class CreateUserDto extends UserDto {
  nickname?;
  MBTI?;
  gender?;
  profilePicture?: string;
}

export class UpdateUserDto extends UserDto {}

export class UpdateProfilePictureDto {
  profilePicture;
}
