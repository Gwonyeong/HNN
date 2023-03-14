import { JwtAuthGuard } from './../auth/jwt/jwt.guard';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { InsertPostDto } from './dtos/posts.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseInterceptor } from 'src/common/interceptor/response.interceptor';
import { HttpExceptionFilter } from 'src/common/middlewares/error/error.middleware';
import { FindPostFilterDto } from './dtos/posts.findFilter.dto';

@Controller('posts')
@ApiTags('03.Posts')
@UseFilters(new HttpExceptionFilter())
@UseInterceptors(ResponseInterceptor)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get('/')
  async findPostData(@Query() postFilterDto: FindPostFilterDto) {
    const postListPageData = await this.postsService.find.findPostData(
      postFilterDto,
    );
    return postListPageData;
  }

  @ApiOperation({
    description:
      '유튜브 uri를 넣으면 해당 uri를 분석해 제목, 설명 등을 db에 저장합니다.',
  })
  @ApiBody({
    description: 'youtube uri',
    schema: {
      properties: {
        uri: {
          type: 'string',
          example: 'https://www.youtube.com/watch?v=wcIf3huwFhc&t=4076s',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: '유튜브 URI만 등록가능합니다.',
  })
  @UseGuards(JwtAuthGuard)
  @Post('/')
  async createYoutebeData(@Req() req, @Body() body: { uri: string }) {
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
