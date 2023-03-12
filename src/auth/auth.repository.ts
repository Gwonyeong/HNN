import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Auth } from '../database/entites/auth.entity';
import { InsertAuthDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
  ) {}
  async findByEmail(email: string): Promise<Auth> {
    return await this.authRepository.findOne({ where: { email } });
  }

  async insert(insertAuthDto: InsertAuthDto) {
    return await this.authRepository.save({ ...insertAuthDto });
  }
}
