import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import {
  PostsController,
  notLoggedInPostsController,
} from './posts.controller';
import { PostsService } from './posts.service';
import { ProcessUriService } from '@common/services/processUri.service';
import { PostsRepository } from './posts.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '@database/entites/post.entity';
import {
  SearchPost,
  SearchPostSchema,
} from '@database/schema/searchPosh.schema';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from '../users/user.repository';
import { User } from '@root/database/entites/user.entity';
import {
  PostView,
  PostViewSchema,
} from '@root/database/schema/postView.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Post]),
    MongooseModule.forFeature([
      { name: SearchPost.name, schema: SearchPostSchema },
      { name: PostView.name, schema: PostViewSchema },
    ]),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
    }),
  ],
  controllers: [PostsController, notLoggedInPostsController],
  providers: [PostsService, PostsRepository, UserRepository, ProcessUriService],
})
export class PostsModule {}
