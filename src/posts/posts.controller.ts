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
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseInterceptor } from 'src/common/interceptor/response.interceptor';
import { HttpExceptionFilter } from 'src/common/middlewares/error/error.middleware';
import { FindPostFilterDto } from './dtos/posts.findFilter.dto';
import { CreateRequestPostDto } from './dtos/posts.request.dto';
import { ResponsePostDto } from './dtos/posts.response.dto';

@Controller('posts')
@ApiTags('03.Posts(구현중)')
@UseFilters(new HttpExceptionFilter())
@UseInterceptors(ResponseInterceptor)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @ApiOperation({
    summary: '리스트 페이지 (테스트 가능)',
    description: '필터기능은 아직 구현하지 않았습니다.',
  })
  @ApiOkResponse({
    type: ResponsePostDto,
  })
  @Get('/')
  async findPostData(@Query() postFilterDto: FindPostFilterDto) {
    const postListPageData = await this.postsService.find.findPostData(
      postFilterDto,
    );
    return postListPageData;
  }

  @ApiOperation({
    summary: '게시물 저장 (테스트 가능)',
    description:
      '유튜브 uri를 넣으면 해당 uri를 분석해 제목, 설명 등을 db에 저장합니다.',
  })
  @ApiBody({
    description: 'youtube uri',
    type: CreateRequestPostDto,
  })
  @ApiBadRequestResponse({
    description: '유튜브 URI만 등록가능합니다.',
  })
  @UseGuards(JwtAuthGuard)
  @Post('/')
  async createYoutebeData(@Req() req, @Body() body: CreateRequestPostDto) {
    const { userId } = req.user;
    const { uri, postTitle } = body;
    const { youtubeData, tags } = await this.postsService.find.findYoutubeData(
      uri,
    );

    const createPostData = await this.postsService.insert.insertPost(
      userId,
      postTitle,
      youtubeData,
    );
    this.postsService.insert.insertPostOfSearchData({
      postId: createPostData.id,
      title: postTitle,
      description: youtubeData.description,
      tags,
    });
    return { msg: '등록이 완료되었습니다.' };
  }
}
