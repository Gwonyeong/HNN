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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
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
import { ResponseInterceptor } from 'src/common/interceptor/response.interceptor';

@ApiTags('01.Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('/signup')
  @ApiOperation({ summary: '회원가입' })
  @ApiOkResponse({
    description: '회원가입 성공',
    type: responseAppTokenDTO,
  })
  @ApiBadRequestResponse({
    status: 401,
    description: '이미 가입된 이메일입니다.',
  })
  @UseInterceptors(ResponseInterceptor)
  async signup(
    @Body() createAuthDto: CreateAuthDto,
  ): Promise<responseAppTokenDTO> {
    const { appToken } = await this.authService.GroupSignUp.signUp(
      createAuthDto,
    );
    return { appToken };
  }

  @Post()
  @ApiOperation({ summary: '로그인' })
  @ApiOkResponse({ description: '로그인 성공', type: responseAppTokenDTO })
  @ApiBadRequestResponse({
    description: '이메일 혹은 비밀번호를 확인해주세요!',
  })
  async login(
    @Body() createAuthDto: CreateAuthDto,
  ): Promise<responseAppTokenDTO> {
    const { appToken } = await this.authService.GroupLogin.login(createAuthDto);
    return {
      appToken,
    };
  }

  @Get('login/google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({
    description: '이 경로로 요청을 보내면 구글 로그인페이지로 이동합니다.',
  })
  async googleLogin() {
    return;
  }

  @Get('callback/google')
  @UseGuards(GoogleAuthGuard)
  @ApiResponse({
    status: 302,
    description: 'redirect auth/callback?accessToken=token',
  })
  async googleCallback(@Req() req, @Res() res: Response) {
    res.redirect(
      process.env.FRONT_SERVER_URI +
        `/auth/callback?accessToken=${req.user.appToken}`,
    );
    return;
  }

  @Get('login/naver')
  @UseGuards(NaverAuthGuard)
  async naverLogin() {
    return;
  }

  @Get('callback/naver')
  @UseGuards(NaverAuthGuard)
  @ApiResponse({
    status: 302,
    description: 'redirect auth/callback?accessToken=token',
  })
  @ApiOperation({
    description: '이 경로로 요청을 보내면 네이버 로그인페이지로 이동합니다.',
  })
  async naverCallback(@Req() req, @Res() res: Response) {
    res.redirect(
      process.env.FRONT_SERVER_URI +
        `/auth/callback?accessToken=${req.user.appToken}`,
    );
    return;
  }
}
