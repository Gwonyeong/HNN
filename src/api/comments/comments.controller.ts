import {
  Body,
  Controller,
  Get,
  Param,
  Post,
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
} from '@nestjs/swagger';
import { ResponseInterceptor } from '@root/common/interceptor/response.interceptor';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import {
  CreateCommentDto,
  RequestCommentByPostIdDto,
} from './dtos/comments.request.dto';
import { ResponseCommentDto } from './dtos/comments.response.dto';
import { CheckLoginAuthGuard } from '@root/common/guard/isLoginCheck.guard';

@Controller('comments')
@ApiTags('06.Comments(테스트 가능) 3월 22일')
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
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const { postId } = param;
    const { userId } = req.user;
    this.commentService.create.createComment(postId, userId, createCommentDto);
    return {};
  }
}

@Controller('comments')
@ApiTags('07 .NotLoggedInComment(테스트 가능) 3월 22일')
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
