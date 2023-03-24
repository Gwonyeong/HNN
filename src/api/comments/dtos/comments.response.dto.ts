import { ApiProperty } from '@nestjs/swagger';

export class ResponseCommentDto {
  @ApiProperty({ example: '' })
  commentId;

  @ApiProperty({ example: '' })
  commentComment;
  @ApiProperty({ example: '' })
  userId;
  @ApiProperty({ example: '' })
  userNickname;
  @ApiProperty({ example: '' })
  userMBTI;
  @ApiProperty({ example: '' })
  userGender;
  @ApiProperty({ example: '' })
  userProfilePicture;
}
