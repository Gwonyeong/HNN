import { JwtAuthGuard } from './../auth/jwt/jwt.guard';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { InsertPostDto } from './dtos/posts.dto';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { ResponseInterceptor } from 'src/common/interceptor/response.interceptor';
import { HttpExceptionFilter } from 'src/common/middlewares/error/error.middleware';

@Controller('posts')
@ApiTags('03.Posts')
@UseFilters(new HttpExceptionFilter())
@UseInterceptors(ResponseInterceptor)
export class PostsController {
  constructor(private postsService: PostsService) {}

  @ApiOperation({
    description:
      '유튜브 uri를 넣으면 해당 uri를 분석해 제목, 설명 등을 db에 저장합니다.',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  async findYoutebeData(@Req() req, @Body() body: { uri: string }) {
    const { userId } = req.user;
    const { youtubeData, tags } = await this.postsService.find.findYoutubeData(
      body.uri,
    );
    const createPostData = await this.postsService.insert.insertPost(
      userId,
      youtubeData,
    );
    this.postsService.insert.insertPostOfSearchData({
      postId: createPostData.id,
      title: youtubeData.title,
      description: youtubeData.description,
      tags,
    });
    return;
  }
}
