import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
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
  ApiParam,
  ApiProperty,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseInterceptor } from '@common/interceptor/response.interceptor';
import { HttpExceptionFilter } from '@common/middlewares/error/error.middleware';
import {
  CreateRequestPostDto,
  FindPostFilterDto,
} from './dtos/posts.request.dto';
import {
  ResponsePostListPageDto,
  ResponsePostDetailPageDataDto,
} from './dtos/posts.response.dto';
import { CheckLoginAuthGuard } from '@root/common/guard/isLoginCheck.guard';

@Controller('posts')
@ApiTags('03.LoggedInPosts(구현중)')
@UseFilters(new HttpExceptionFilter())
@UseInterceptors(ResponseInterceptor)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class PostsController {
  constructor(private postsService: PostsService) {}

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
    const { uri, postTitle, postDescription } = body;
    const { youtubeData, tags } = await this.postsService.find.findYoutubeData(
      uri,
    );
    const postData = {
      postTitle,
      postDescription,
    };
    const createPostData = await this.postsService.insert.insertPost(
      userId,
      postData,
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

@Controller('posts')
@ApiTags('04.NotLoggedInposts(테스트 가능)')
@UseFilters(new HttpExceptionFilter())
@UseInterceptors(ResponseInterceptor)
export class notLoggedInPostsController {
  constructor(private postsService: PostsService) {}

  @ApiOperation({
    summary: '리스트 페이지 (3월 21일 수정)',
    description: '필터기능 구현',
  })
  @ApiOkResponse({
    type: ResponsePostListPageDto,
  })
  @Get('/')
  @UseGuards(CheckLoginAuthGuard)
  @UsePipes(new ValidationPipe())
  async findPostData(@Req() req, @Query() postFilterDto: FindPostFilterDto) {
    const userId = req?.user?.userId;
    const postListPageData = await this.postsService.find.findPostData(
      userId,
      postFilterDto,
    );
    return postListPageData;
  }

  @ApiOperation({
    summary: '상세 페이지 (3월 22일 수정)',
    description: '상세페이지(뭘 좋아하실지 몰라서 일단 다 넣었습니다.)',
  })
  @ApiParam({
    name: 'postId',
    type: 'string',
  })
  @ApiOkResponse({
    type: ResponsePostDetailPageDataDto,
  })
  @Get('/:postId/detail')
  @UseGuards(CheckLoginAuthGuard)
  @UsePipes(new ValidationPipe())
  async findPostDetailData(@Req() req, @Param() params: { postId }) {
    const { postId } = params;
    const postDetailPageData = await this.postsService.find.findDetailPostData(
      postId,
    );
    return postDetailPageData;
  }
}
