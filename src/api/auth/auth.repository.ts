import { Injectable, UseFilters } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Auth } from '../../database/entites/auth.entity';
import { InsertAuthDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MongoExceptionFilter,
  TypeOrmExceptionFilter,
} from '@common/middlewares/error/error.middleware';

@Injectable()
@UseFilters(new TypeOrmExceptionFilter())
@UseFilters(new MongoExceptionFilter())
export class AuthRepository {
  constructor(
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
  ) {}
  async findByEmail(email: string): Promise<Auth> {
    const authData = await this.authRepository
      .createQueryBuilder('auth')
      .select()
      .leftJoinAndSelect('user', 'user', `user.id = auth.userId`)
      .where(`auth.email = :email`, { email });

    return await authData.getRawOne();
  }

  async insert(insertAuthDto: InsertAuthDto) {
    return await this.authRepository.save({ ...insertAuthDto });
  }
}
