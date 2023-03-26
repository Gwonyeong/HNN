import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ResponseInterceptor } from '@common/interceptor/response.interceptor';
import { HttpExceptionFilter } from '@common/middlewares/error/error.middleware';
import {
  CreateRequestPostDto,
  FindPostFilterDto,
  UpdatePostDto,
} from './dtos/posts.request.dto';
import {
  ResponsePostListPageDto,
  ResponsePostDetailPageDataDto,
} from './dtos/posts.response.dto';
import { CheckLoginAuthGuard } from '@root/common/guard/isLoginCheck.guard';

@Controller('posts')
@ApiTags('03.LoggedInPosts')
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
    const createPostData = await this.postsService.create.createPost(
      userId,
      postData,
      youtubeData,
    );
    this.postsService.create.createPostOfSearchData({
      postId: createPostData.id,
      title: postTitle,

      description: youtubeData.description,
      tags,
    });
    return { msg: '등록이 완료되었습니다.' };
  }

  @ApiOperation({
    summary: '게시물 업데이트(0324)',
    description: '게시물의 postTitle, postDescription을 수정합니다.',
  })
  @ApiParam({
    name: 'postId',
  })
  @ApiUnauthorizedResponse({
    description: '권한이 없습니다.(자신의 게시물이 아님)',
  })
  @Put('/:postId')
  async updateYoutubePost(
    @Req() req,
    @Param() param,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const { userId } = req.user;
    const { postId } = param;
    await this.postsService.update.updatePost(postId, userId, updatePostDto);
    return {};
  }

  @ApiOperation({
    summary: '게시물 삭제하기(0324)',
    description: '해당 번호의 게시물을 삭제합니다.',
  })
  @ApiParam({
    name: 'postId',
  })
  @ApiUnauthorizedResponse({
    description: '권한이 없습니다.(자신의 게시물이 아님)',
  })
  @Delete('/:postId')
  async deleteYotubePost(@Req() req, @Param() param) {
    const { userId } = req.user;
    const { postId } = param;
    await this.postsService.delete.deletePost(postId, userId);
  }
}

@Controller('posts')
@ApiTags('04.NotLoggedInposts')
@UseFilters(new HttpExceptionFilter())
@UseInterceptors(ResponseInterceptor)
export class notLoggedInPostsController {
  constructor(private postsService: PostsService) {}

  @ApiOperation({
    summary: '리스트 페이지 (3월 26일 수정)',
    description: `0321 필터기능 구현 
    <br> 0323 검색기능 구현
    <br> 0325 댓글 갯수, 좋아요 갯수 구현
    <br> 0325 query : sort 추가
    <br> 0326 0326 response userProfilePictre => userProfileImage`,
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
    summary: '상세 페이지 (3월 26일 수정)',
    description: `상세페이지(뭘 좋아하실지 몰라서 일단 다 넣었습니다.
      <br>0326 response userProfilePictre => userProfileImage `,
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
    const { userId } = req.user;
    const postDetailPageData = await this.postsService.find.findDetailPostData(
      postId,
      userId,
    );
    return postDetailPageData;
  }
}
