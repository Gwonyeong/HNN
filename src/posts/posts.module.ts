import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { ProcessUriService } from '@common/services/processUri.service';
import { PostsRepository } from './posts.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '@database/entites/post.entity';
import {
  SearchPost,
  SearchPostSchema,
} from '@database/schema/searchPosh.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    MongooseModule.forFeature([
      { name: SearchPost.name, schema: SearchPostSchema },
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository, ProcessUriService],
})
export class PostsModule {}
