import { MulterS3Service } from './../common/util/aws';
import { JwtAuthGuard } from './../auth/jwt/jwt.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Put,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  UseFilters,
  HttpException,
  HttpStatus,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FindUserDto } from './dto/user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseDTO } from '@common/dtos/response.dto';
import { HttpExceptionFilter } from '@common/middlewares/error/error.middleware';
import { UpdateRandomNickname, UpdateUserDto } from './dto/request.user.dto';
import { randPrefix } from './dto/user.rnadom.nickname.object';
import { ResponseInterceptor } from '@root/common/interceptor/response.interceptor';
import { randomNicknameResponseDto } from './dto/response.user.dto';

@Controller('users')
@ApiTags('02.Users(완)')
@UseInterceptors(ResponseInterceptor)
@UseFilters(new HttpExceptionFilter())
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly multerS3Service: MulterS3Service,
  ) {}

  @ApiOperation({ summary: '랜덤 닉네임 가져오기(완)' })
  @ApiQuery({ type: UpdateRandomNickname })
  @ApiOkResponse({ type: randomNicknameResponseDto })
  @Get('/nickname')
  async findRandomNickname(@Query() query: UpdateRandomNickname) {
    const { MBTI } = query;
    return this.userService.findRandomNickname({ MBTI });
  }

  @ApiOperation({ summary: '유저 정보 가져오기(완)' })
  @ApiOkResponse({ type: FindUserDto })
  @Get('/')
  async findUserByUserId(@Req() req): Promise<FindUserDto> {
    const { userId } = req.user;
    const userData = await this.userService.findUserByUserId(userId);
    return userData;
  }

  @ApiOperation({
    summary: '유저의 프로필 업데이트(완)',
    description:
      '무조건 덮어씌우기 때문에 모든 변수가 유효한 값이여야 합니다. Ex : MBTI = null 이면 안됨.',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 201,
    description: '유저 정보 변경 성공',
    type: ResponseDTO,
  })
  @Put('/')
  async updateUserProfile(@Body() updateUserDto: UpdateUserDto, @Req() req) {
    const { userId } = req.user;
    return await this.userService.updateUser(userId, updateUserDto);
  }

  @ApiOperation({ summary: '유저의 프로필 사진만 업데이트(완)' })
  @ApiBody({
    description: 'avatar에 multi-formdata 이미지 파일을 넣어주세요.',
    schema: {
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: '유저 프로필 사진 변경 성공',
    type: ResponseDTO,
  })
  @Patch('picture')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateUserProfilePicture(
    @Req() req,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    const { userId } = req.user;
    const { fileSavePath } = await this.multerS3Service.uploadImageToS3(
      avatar,
      process.env.S3_AVATAR_PATH,
    );
    this.userService.updateUserProfile(userId, {
      profilePicture: fileSavePath,
    });
    return { success: true };
  }
}
