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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Authorization } from 'src/common/decorator/Authorization.decorator';
import { AdminAuthGuard } from 'src/common/guard/isAdmin.guard';
import { Auth } from './entities/auth.entity';
import { ApiBadRequestResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { KakaoAuthGuard } from './kakao/kakao.guard';
import { GoogleAuthGuard } from './google/kakao.guard';
import { NaverAuthGuard } from './naver/naver.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('/signup')
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    type: Auth,
  })
  @ApiBadRequestResponse({ description: 'The email address is already taken.' })
  async signup(@Body() createAuthDto: CreateAuthDto, @Res() res: Response) {
    this.authService.signUp(createAuthDto);
    res.status(HttpStatus.CREATED).json({ msg: '회원가입 성공!' });
  }

  @Post()
  async login(@Body() createAuthDto: CreateAuthDto) {
    console.log(createAuthDto);
    return {
      access_token: this.jwtService.sign(
        { userId: 1, role: 'common' },
        { secret: process.env.SECRET_KEY },
      ),
    };
  }

  @Get('login/kakao')
  @UseGuards(KakaoAuthGuard)
  async kakaoLogin(@Req() req) {
    return req.user;
  }

  @Get('kakao/callback')
  @UseGuards(KakaoAuthGuard)
  async kakaoCallback(@Req() req) {
    console.log(req.user);
    return;
  }

  @Get('login/google')
  @UseGuards(GoogleAuthGuard)
  async googleLogin(@Req() req) {
    return req.user;
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req) {
    console.log(req.user);

    return req.user;
  }

  @Get('login/naver')
  @UseGuards(NaverAuthGuard)
  async naverLogin(@Req() req) {
    return req.user;
  }

  @Get('naver/callback')
  @UseGuards(NaverAuthGuard)
  async naverCallback(@Req() req) {
    console.log(req.user);

    return req.user;
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  check(@Authorization() userId) {
    return userId;
  }
}
