import { Module } from '@nestjs/common';
import {
  CommentsController,
  NotLoggedInCommentController,
} from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment } from '@root/database/entites/comments.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { CommentsRepository } from './comments.repository';
import { Post } from '@root/database/entites/post.entity';
import { CheckLoginAuthGuard } from '@root/common/guard/isLoginCheck.guard';
import { UserRepository } from '../users/user.repository';
import { User } from '@root/database/entites/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, Post, User]),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
    }),
  ],
  controllers: [CommentsController, NotLoggedInCommentController],
  providers: [
    CommentsService,
    CommentsRepository,
    UserRepository,
    CheckLoginAuthGuard,
  ],
})
export class CommentsModule {}
