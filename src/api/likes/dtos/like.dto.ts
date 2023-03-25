import { ApiProperty } from '@nestjs/swagger';
import { User } from '@root/database/entites/user.entity';
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

export class UserIdAndPostIdDTO {
  postId;
  userId;
}
