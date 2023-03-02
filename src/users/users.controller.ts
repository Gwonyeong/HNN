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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { multerOptions } from 'src/common/util/multer.option';

@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiTags('02.Users(미완)')
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

  @Patch('picture')
  @UseInterceptors(FileInterceptor('avatar', multerOptions('avatars')))
  async updateUserProfilePicture(@UploadedFile() avatar: Express.Multer.File) {
    console.log(avatar);
  }
}
