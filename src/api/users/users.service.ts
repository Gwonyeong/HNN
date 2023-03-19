import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto, FindUserDto } from './dto/user.dto';
import {
  UpdateProfilePictureDto,
  UpdateRandomNickname,
  UpdateUserDto,
} from './dto/request.user.dto';
import { randPrefix } from './dto/user.rnadom.nickname.object';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  async findRandomNickname(updateRandomNickname: UpdateRandomNickname) {
    const { MBTI } = updateRandomNickname;
    const randPrefixNickname = randPrefix;
    const prefixNicknameRandomNumber = Math.floor(
      Math.random() * randPrefixNickname.length,
    );
    return {
      nickname: randPrefixNickname[prefixNicknameRandomNumber] + ' ' + MBTI,
    };
  }

  async findUserByUserId(userId: number): Promise<FindUserDto> {
    return await this.userRepository.Mysql.findById(userId);
  }

  async createUser(createUserDto: CreateUserDto) {
    return await this.userRepository.Mysql.insertUser(createUserDto);
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    return await this.userRepository.Mysql.updateUser(userId, updateUserDto);
  }

  async updateUserProfile(
    userId: number,
    profilePictureDto: UpdateProfilePictureDto,
  ) {
    this.userRepository.Mysql.updateProfilePicture(userId, profilePictureDto);
  }
}
