import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { HttpExceptionFilter } from '@root/common/middlewares/error/error.middleware';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ResponseInterceptor } from '@root/common/interceptor/response.interceptor';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import {
  RequestCreateCommentDto,
  RequestCommentByPostIdDto,
  RequestUpdateCommentDto,
} from './dtos/comments.request.dto';
import { ResponseCommentDto } from './dtos/comments.response.dto';
import { CheckLoginAuthGuard } from '@root/common/guard/isLoginCheck.guard';

@Controller('comments')
@ApiTags('06.Comments(23/03/23)')
@UseFilters(new HttpExceptionFilter())
@UseInterceptors(ResponseInterceptor)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class CommentsController {
  constructor(private commentService: CommentsService) {}

  @ApiOperation({
    summary: '해당 포스트에 댓글 작성하기',
  })
  @ApiParam({
    name: 'postId',
    type: 'string',
  })
  @Post('/:postId')
  async createComment(
    @Req() req,
    @Param() param,
    @Body() createCommentDto: RequestCreateCommentDto,
  ) {
    const { postId } = param;
    const { userId } = req.user;
    this.commentService.create.createComment(postId, userId, createCommentDto);
    return {};
  }

  @ApiOperation({
    summary: '해당 댓글 수정하기(0324)',
  })
  @ApiParam({
    name: 'commentId',
  })
  @ApiUnauthorizedResponse({
    description: '권한이 없습니다.(자신의 게시물이 아님)',
  })
  @Put('/:commentId')
  async updateComment(
    @Req() req,
    @Param() param,
    @Body() updateCommentDto: RequestUpdateCommentDto,
  ) {
    const { userId } = req.user;
    const { commentId } = param;
    const { comment } = updateCommentDto;
    await this.commentService.update.updateComment(userId, commentId, comment);
  }

  @ApiOperation({
    summary: '해당 댓글 삭제하기(0325)',
  })
  @ApiParam({
    name: 'commentId',
  })
  @ApiUnauthorizedResponse({
    description: '권한이 없습니다.(자신의 게시물이 아님)',
  })
  @Delete('/:commentId')
  async deleteComment(@Req() req, @Param() param) {
    const { userId } = req.user;
    const { commentId } = param;
    await this.commentService.delete.deleteComment(commentId, userId);
  }
}

@Controller('comments')
@ApiTags('07 .NotLoggedInComment(23/03/23)')
@UseFilters(new HttpExceptionFilter())
@UseInterceptors(ResponseInterceptor)
@UseGuards(CheckLoginAuthGuard)
export class NotLoggedInCommentController {
  constructor(private commentService: CommentsService) {}

  @ApiOperation({
    summary: '해당 포스트 아이디의 코멘트 가져오기',
  })
  @ApiParam({
    name: 'postId',
    type: 'string',
  })
  @ApiOkResponse({
    type: ResponseCommentDto,
  })
  @Get('/post/:postId')
  async findCommentByPostId(
    @Param() param: RequestCommentByPostIdDto,
  ): Promise<ResponseCommentDto[]> {
    const { postId } = param;
    const commentData = this.commentService.find.findCommentByPostId(postId);
    return commentData;
  }
}
