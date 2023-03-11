import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { ProcessUriService } from 'src/common/services/processUri.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService, ProcessUriService],
})
export class PostsModule {}
