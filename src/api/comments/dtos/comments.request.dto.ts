import { ApiProperty } from '@nestjs/swagger';
import { CommentDto } from './comments.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class RequestCreateCommentDto {
  @ApiProperty({ example: 6 })
  @IsNotEmpty({ message: '댓글에 내용을 입력해주세요.' })
  comment: string;
}

export class RequestCommentByPostIdDto {
  @ApiProperty({ example: 6 })
  postId;
}

export class RequestUpdateCommentDto {
  @ApiProperty({ example: 6 })
  @IsNotEmpty({ message: '댓글에 내용을 입력해주세요.' })
  comment: string;
}
