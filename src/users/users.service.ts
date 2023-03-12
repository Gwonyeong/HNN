import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import {
  CreateUserDto,
  UpdateUserDto,
  UpdateProfilePictureDto,
  FindUserDto,
} from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

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
