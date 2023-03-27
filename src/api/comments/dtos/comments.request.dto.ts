import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

class CommentDto {
  @ApiProperty({ example: 6 })
  @IsNotEmpty({ message: '댓글에 내용을 입력해주세요.' })
  comment: string;

  @ApiProperty({ example: 6 })
  postId;
}

export class RequestCreateCommentDto extends PickType(CommentDto, [
  `comment`,
]) {}

export class RequestCommentByPostIdDto extends PickType(CommentDto, [
  `postId`,
]) {}

export class RequestUpdateCommentDto extends PickType(CommentDto, [
  `comment`,
]) {}
