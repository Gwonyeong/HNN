import { JwtAuthGuard } from './../auth/jwt/jwt.guard';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/posts.dto';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { ResponseInterceptor } from 'src/common/interceptor/response.interceptor';

@Controller('posts')
@ApiTags('03.Posts')
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
    const { youtubeData, tags } = await this.postsService.findYoutubeData(
      body.uri,
    );
    await this.postsService.createPost(userId, youtubeData);
    return;
  }
}
