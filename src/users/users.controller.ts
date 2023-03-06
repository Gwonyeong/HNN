import { MulterS3Service } from './../common/util/aws';
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
import { UpdateUserDto } from './dto/user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiTags('02.Users')
export class UsersController {
  constructor(
    private readonly userService: UsersService, // private readonly multerS3Service: MulterS3Service,
  ) {}

  // @Post('/profile')
  // async createUserProfile(@Req() req, @Body() createUserDto: CreateUserDto) {
  //   const { userId } = req.user;
  //   return await this.userService.createUser(userId, createUserDto);
  // }

  @ApiOperation({ summary: '유저의 프로필 업데이트' })
  @ApiResponse({ status: 201, description: '유저 정보 변경 성공' })
  @Put('/')
  async updateUserProfile(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const { userId } = req.user;
    return await this.userService.updateUser(userId, updateUserDto);
  }

  // @ApiOperation({ summary: '유저의 프로필 사진만 업데이트' })
  // @ApiResponse({ status: 201, description: '유저 프로필 사진 변경 성공' })
  // @Patch('picture')
  // @UseInterceptors(FileInterceptor('avatar'))
  // async updateUserProfilePicture(
  //   @Req() req,
  //   @UploadedFile() avatar: Express.Multer.File,
  // ) {
  //   const { userId, nickname } = req.user;
  //   const fileSavePath = await this.multerS3Service.uploadImageToS3(
  //     avatar,
  //     process.env.S3_AVATAR_PATH,
  //     nickname,
  //   );
  //   this.userService.updateUserProfile(userId, {
  //     profilePicture: fileSavePath,
  //   });
  //   return { success: true };
  // }
}
