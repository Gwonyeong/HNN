import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { HttpExceptionFilter } from '@root/common/middlewares/error/error.middleware';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseInterceptor } from '@root/common/interceptor/response.interceptor';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { CreateCommentDto } from './dtos/comments.request.dto';

@Controller('comments')
@ApiTags('06.Comments(구현중)')
@UseFilters(new HttpExceptionFilter())
@UseInterceptors(ResponseInterceptor)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class CommentsController {
  constructor(private commentService: CommentsService) {}

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
