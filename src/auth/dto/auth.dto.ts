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

class AuthDto {
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

  @IsString()
  @IsNotEmpty()
  platform?: string = 'local';

  @IsString()
  socialLoginId?: string = '';

  @IsString()
  role?: string = 'common';
}

export class InsertAuthDto extends AuthDto {
  email;
  password?;
  platform;
  socialLoginId?;
  role?;
}
