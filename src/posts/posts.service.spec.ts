import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { ProcessUriService } from 'src/common/services/processUri.service';
import { PostsRepository } from './posts.repository';

describe('PostsService', () => {
  let postsService: PostsService;
  ProcessUriService;
  beforeEach(async () => {
    postsService = new PostsService(new ProcessUriService(), PostsRepository);
  });

  it('Should get several data in youtube api', () => {
    expect(
      service.find.findYoutubeData(
        'https://www.youtube.com/watch?v=80L6WDXeqaU',
      ),
    ).toBeInstanceOf(Object);
  });
});
