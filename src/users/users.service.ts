import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import {
  CreateUserDto,
  UpdateUserDto,
  UpdateProfilePictureDto,
} from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto) {
    return await this.userRepository.createUser(createUserDto);
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    return await this.userRepository.updateUser(userId, updateUserDto);
  }

  async updateUserProfile(
    userId: number,
    profilePictureDto: UpdateProfilePictureDto,
  ) {
    this.updateUserProfile(userId, profilePictureDto);
  }
}
