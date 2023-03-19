import {
  Body,
  Controller,
  Post,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseInterceptor } from '@root/common/interceptor/response.interceptor';
import { HttpExceptionFilter } from '@root/common/middlewares/error/error.middleware';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { CreateLikeDto } from './dtos/like.request.dto';
import { UsersService } from '../users/users.service';
import { LikesService } from './likes.service';

@Controller('likes')
@ApiTags('05.Likes(구현중)')
@UseInterceptors(ResponseInterceptor)
@UseFilters(new HttpExceptionFilter())
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class LikesController {
  constructor(private likesService: LikesService) {}

  @Post()
  async createLike(@Req() req, @Body() createLikeDto: CreateLikeDto) {
    const { userId } = req.user;
    const { postId } = createLikeDto;
    const likeData = await this.likesService.find.findOneLike({
      userId,
      postId,
    });
    console.log(likeData);
    likeData
      ? this.likesService.delete.deleteOne({ userId, postId })
      : this.likesService.create.create({ userId, postId });

    return likeData;
  }
}
