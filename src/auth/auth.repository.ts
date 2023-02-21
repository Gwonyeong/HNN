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
    return this.authRepository.create(createAuthDto);
  }
}
