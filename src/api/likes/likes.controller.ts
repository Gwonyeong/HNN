import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseInterceptor } from '@root/common/interceptor/response.interceptor';
import { HttpExceptionFilter } from '@root/common/middlewares/error/error.middleware';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { CreateLikeDto } from './dtos/like.request.dto';
import { UsersService } from '../users/users.service';
import { LikesService } from './likes.service';

@Controller('likes')
@ApiTags('05.Likes(23/03/23)')
@UseInterceptors(ResponseInterceptor)
@UseFilters(new HttpExceptionFilter())
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class LikesController {
  constructor(private likesService: LikesService) {}

  @ApiOperation({
    summary: '좋아요 기능 (4월 1일 버그 수정)',
    description: '좋아요 등록 ,좋아요를 한 상태면 취소',
  })
  @Post('/:postId')
  async createLike(@Req() req, @Param('postId', ParseIntPipe) postId) {
    const { userId } = req.user;
    const likeData = await this.likesService.find.findOneLike({
      userId,
      postId,
    });
    likeData
      ? this.likesService.delete.deleteOne({ userId, postId })
      : this.likesService.create.create({ userId, postId });

    return likeData;
  }
}
