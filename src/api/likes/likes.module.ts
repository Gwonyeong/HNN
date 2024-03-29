import { Module } from '@nestjs/common';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { LikesRepository } from './likes.repository';
import { Like } from '@root/database/entites/like.entity';
import { User } from '@root/database/entites/user.entity';
import { Post } from '@root/database/entites/post.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Like])],
  controllers: [LikesController],
  providers: [LikesService, LikesRepository],
})
export class LikesModule {}
