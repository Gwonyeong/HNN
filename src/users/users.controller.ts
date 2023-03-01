import { JwtAuthGuard } from './../auth/jwt/jwt.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { Request } from 'express';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // @Post('/profile')
  // async createUserProfile(@Req() req, @Body() createUserDto: CreateUserDto) {
  //   const { userId } = req.user;
  //   return await this.userService.createUser(userId, createUserDto);
  // }

  @Put('/')
  async updateUserProfile(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const { userId } = req.user;
    return await this.userService.updateUser(userId, updateUserDto);
  }
}
