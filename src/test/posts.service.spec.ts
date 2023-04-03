import { FindPostFilterDto } from './../api/posts/dtos/posts.request.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from '@root/api/posts/posts.service';
import { PostsModule } from '@root/api/posts/posts.module';

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

describe('findPostData', () => {
  it(`Should not exist Error, Login user`, async () => {
    const userId = 1;
    const findPostFilterDto: FindPostFilterDto = {
      page: 1,
      limit: 20,
    };
    expect(
      await service.find.findPostData(userId, findPostFilterDto),
    ).toBeInstanceOf(Array);
  });

  it(`Should not exist Error, not LoggedIn user`, async () => {
    const userId = undefined;
    const findPostFilterDto: FindPostFilterDto = {
      page: 1,
      limit: 20,
    };
    expect(
      await service.find.findPostData(userId, findPostFilterDto),
    ).toBeInstanceOf(Array);
  });
});

describe('findDetailPostData', () => {
  it(`Should not exist Error, Login user`, async () => {
    const userId = 1;
    const findPostFilterDto: FindPostFilterDto = {
      page: 1,
      limit: 20,
    };
    expect(
      await service.find.findPostData(userId, findPostFilterDto),
    ).toBeInstanceOf(Array);
  });

  it(`Should not exist Error, not LoggedIn user`, async () => {
    const userId = undefined;
    const findPostFilterDto: FindPostFilterDto = {
      page: 1,
      limit: 20,
    };
    expect(
      await service.find.findPostData(userId, findPostFilterDto),
    ).toBeInstanceOf(Array);
  });
});
