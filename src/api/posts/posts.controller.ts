import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
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
import { ResponsePostDto } from './dtos/posts.response.dto';
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
    type: ResponsePostDto,
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

  // @Post('/test')
  // async find(@Body() body) {
  //   const { message } = body;
  //   const generatePrompt = (name) => {
  //     return [
  //       {
  //         role: 'system',
  //         content: '빨간색을 추천해줘',
  //       },
  //     ];
  //   };

  //   const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
  //   const openai = new OpenAIApi(config);
  //   const me = [{ role: 'system', content: 'dd' }];
  //   const completion = await openai.createChatCompletion({
  //     model: 'gpt-3.5-turbo',
  //     messages: [
  //       {
  //         role: 'system',
  //         content:
  //           '이 사람은 백앤드 개발자로 1년을 근무했고 mysql에 강점이 있다고 이력서를 작성했어. 이 사람에게 면접에서 마주할 수 있는 면접문제를 내줘',
  //       },
  //       {
  //         role: 'user',
  //         content: '안녕하십니까! 백앤드 개발자 조권영입니다!',
  //       },
  //     ],
  //     temperature: 1,
  //   });
  //   console.log(completion.data.choices);
  //   return completion.data.choices;
  // }
}
