import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    console.log(createAuthDto);
    return await this.authRepository.save({ ...createAuthDto });
  }

  async findByEmail(email: string): Promise<Auth> {
    return await this.authRepository.findOne({ where: { email } });
  }
}
