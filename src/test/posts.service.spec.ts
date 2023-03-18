import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from '@root/posts/posts.service';
import { PostsModule } from '@root/posts/posts.module';

import { Config } from '@root/app.module';
import { BadRequestException } from '@nestjs/common';

let service: PostsService;

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      Config.setENV(),
      Config.setMySQL(true),
      Config.setMongo(),
      PostsModule,
    ],
  }).compile();

  service = module.get<PostsService>(PostsService);
});

describe('findYoutubeData', () => {
  it('Should get several data in youtube api', () => {
    expect(
      service.find.findYoutubeData(
        'https://www.youtube.com/watch?v=80L6WDXeqaU',
      ),
    ).toBeInstanceOf(Object);
  });

  it('If not youtube uri, throw Error 400', async () => {
    await expect(
      service.find.findYoutubeData(
        'https://kyung-a.tistory.com/category/Javascript',
      ),
    ).rejects.toThrow(BadRequestException);
  });
});
