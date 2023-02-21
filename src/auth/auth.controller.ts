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
  ExecutionContext,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Authorization } from 'src/common/decorator/Authorization.decorator';
import { AdminAuthGuard } from 'src/common/guard/isAdmin.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post()
  async signup(@Body() createAuthDto: CreateAuthDto) {}

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

  @Get()
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  check(@Authorization() userId) {
    return userId;
  }
}
