import { ApiProperty } from '@nestjs/swagger';
import { CommentDto } from './comments.dto';

export class CreateCommentDto extends CommentDto {
  comment;
}

export class RequestCommentByPostIdDto {
  @ApiProperty({ example: 6 })
  postId;
}
