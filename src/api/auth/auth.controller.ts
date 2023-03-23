import { HttpExceptionFilter } from '@common/middlewares/error/error.middleware';
import { JwtAuthGuard } from './jwt/jwt.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
  HttpStatus,
  UseInterceptors,
  Header,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { InsertAuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { GoogleAuthGuard } from './google/google.guard';
import { NaverAuthGuard } from './naver/naver.guard';
import { responseAppTokenDTO } from './dto/responses/response.dto';
import { ResponseInterceptor } from '@common/interceptor/response.interceptor';

@ApiTags('01.Auth(23/03/23)')
@Controller('auth')
@UseFilters(new HttpExceptionFilter())
@UseInterceptors(ResponseInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @ApiOperation({ summary: '회원가입(완)' })
  @ApiOkResponse({
    description: '회원가입 성공',
    type: responseAppTokenDTO,
  })
  @ApiBadRequestResponse({
    status: 401,
    description: '이미 가입된 이메일입니다.',
  })
  @UseInterceptors(ResponseInterceptor)
  @Post('/signup')
  async createUser(
    @Body() createAuthDto: InsertAuthDto,
  ): Promise<responseAppTokenDTO> {
    const appToken: responseAppTokenDTO =
      await this.authService.GroupSignUp.signUp(createAuthDto);
    return appToken;
  }

  @ApiOperation({ summary: '로그인(완)' })
  @ApiOkResponse({ description: '로그인 성공', type: responseAppTokenDTO })
  @ApiBadRequestResponse({
    description: '이메일 혹은 비밀번호를 확인해주세요!',
  })
  @Post()
  async login(
    @Body() createAuthDto: InsertAuthDto,
  ): Promise<responseAppTokenDTO> {
    const appToken = await this.authService.GroupLogin.login(createAuthDto);
    return appToken;
  }

  @UseGuards(GoogleAuthGuard)
  @ApiOperation({
    summary: '구글 로그인(완)',
    description: '이 경로로 요청을 보내면 구글 로그인페이지로 이동합니다.',
  })
  @Get('login/google')
  async googleLogin() {
    return;
  }

  @UseGuards(GoogleAuthGuard)
  @ApiOperation({
    summary: '구글 콜백(완)',
  })
  @ApiResponse({
    status: 302,
    description:
      process.env.NODE_ENV == 'dev'
        ? `redirect  http://localhost:3690/auth/callback?accessToken=token`
        : ``,
  })
  @Header('Access-Control-Allow-Origin', '*') // CORS 허용
  @Get('callback/google')
  async googleCallback(@Req() req, @Res() res: Response) {
    res.redirect(
      process.env.FRONT_SERVER_URI +
        `/auth/callback?accessToken=${req.user.appToken}`,
    );
    return;
  }

  @ApiOperation({
    summary: '네이버 로그인(완)',
    description: '이 경로로 요청을 보내면 네이버 로그인페이지로 이동합니다.',
  })
  @UseGuards(NaverAuthGuard)
  @Get('login/naver')
  async naverLogin() {
    return;
  }

  @UseGuards(NaverAuthGuard)
  @ApiOperation({
    summary: '네이버 콜백(완)',
  })
  @ApiResponse({
    status: 302,
    description:
      process.env.NODE_ENV == 'dev'
        ? `redirect  http://localhost:3690/auth/callback?accessToken=token`
        : ``,
  })
  @Header('Access-Control-Allow-Origin', '*') // CORS 허용
  @Get('callback/naver')
  async naverCallback(@Req() req, @Res() res: Response) {
    res.redirect(
      process.env.FRONT_SERVER_URI +
        `/auth/callback?accessToken=${req.user.appToken}`,
    );
    return;
  }
}
