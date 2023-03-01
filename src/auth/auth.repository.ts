import { UpdateAuthDto } from './dto/update-auth.dto';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Auth } from '../entites/auth.entity';
import { CreateAuthDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
  ) {}

  async findByEmail(email: string): Promise<Auth> {
    return await this.authRepository.findOne({ where: { email } });
  }

  async create(createAuthDto: CreateAuthDto) {
    return await this.authRepository.save({ ...createAuthDto });
  }
}
