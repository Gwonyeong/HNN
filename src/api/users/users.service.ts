import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/user.dto';
import {
  UpdateprofileImageDto,
  UpdateRandomNickname,
  UpdateUserDto,
} from './dto/request.user.dto';
import { randPrefix } from './dto/user.rnadom.nickname.object';
import { FindUserResponseDto } from './dto/response.user.dto';

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

  async findUserByUserId(userId: string): Promise<FindUserResponseDto> {
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
    profileImageDto: UpdateprofileImageDto,
  ) {
    this.userRepository.Mysql.updateprofileImage(userId, profileImageDto);
  }
}
