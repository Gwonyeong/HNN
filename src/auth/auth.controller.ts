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
import { responseAppTokenDTO } from './dto/response.dto';
import { ResponseInterceptor } from 'src/common/interceptor/response.interceptor';

@ApiTags('Auth')
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
    description: '',
  })
  @UseInterceptors(ResponseInterceptor)
  async signup(
    @Body() createAuthDto: CreateAuthDto,
  ): Promise<responseAppTokenDTO> {
    this.authService.signUp(createAuthDto);
    return { appToken: '회원가입 성공!' };
  }

  @Post()
  @ApiOperation({ summary: '로그인' })
  async login(
    @Body() createAuthDto: CreateAuthDto,
  ): Promise<responseAppTokenDTO> {
    return {
      appToken: this.jwtService.sign(
        { userId: 1, role: 'common' },
        { secret: process.env.SECRET_KEY },
      ),
    };
  }

  @Get('login/google')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {
    return;
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiResponse({
    status: 302,
    description: 'redirect auth/callback?accessToken=token',
  })
  async googleCallback(@Req() req, @Res() res: Response) {
    res.redirect(
      process.env.REDIRECT_URI + `?accessToken=${req.user.authToken}`,
    );
    return;
  }

  @Get('login/naver')
  @UseGuards(NaverAuthGuard)
  async naverLogin() {
    return;
  }

  @Get('naver/callback')
  @UseGuards(NaverAuthGuard)
  @ApiResponse({
    status: 302,
    description: 'redirect auth/callback?accessToken=token',
  })
  async naverCallback(@Req() req, @Res() res: Response) {
    res.redirect(
      process.env.REDIRECT_URI + `?accessToken=${req.user.authToken}`,
    );
    return;
  }
}
