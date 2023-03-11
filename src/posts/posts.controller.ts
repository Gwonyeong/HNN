import { Controller, Get } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  async findYoutebeData() {
    try {
      return await this.postsService.findYoutubeData(
        'https://www.youtube.com/watch?v=89LZP67R_ec',
      );
    } catch (err) {
      console.log(err);
    }
  }
}
