import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from './user.repository';
import { User } from 'src/entites/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterS3Service } from 'src/common/util/aws';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, MulterS3Service],
  exports: [UserRepository],
})
export class UsersModule {}
