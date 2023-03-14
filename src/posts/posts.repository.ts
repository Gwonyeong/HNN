import { Repository } from 'typeorm';
import { Injectable, UseFilters } from '@nestjs/common';
import { InsertPostDto } from './dtos/posts.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  SearchPost,
  SearchPostDocument,
  SearchPostSchema,
} from 'src/database/schema/searchPosh.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from 'src/database/entites/post.entity';
import {
  MongoExceptionFilter,
  TypeOrmExceptionFilter,
} from 'src/common/middlewares/error/error.middleware';
import { FindPostFilterDto } from './dtos/posts.findFilter.dto';

@Injectable()
@UseFilters(new TypeOrmExceptionFilter())
@UseFilters(new MongoExceptionFilter())
export class PostsRepository {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectModel(SearchPost.name)
    private searchPostModel: Model<SearchPostDocument>,
  ) {}

  public Mysql = {
    findPost: async (findPostFilterDto: FindPostFilterDto) => {
      return (
        this.postRepository
          .createQueryBuilder('post')
          .select([
            'post.id AS postId',
            'post.youtubeUri AS youtubeUri',
            'post.youtubeTitle AS youtubeTitle',
            'post.description AS youtubeDescription',
            'post.publishedAt AS publishedAt',
            'user.id',
          ])
          .innerJoin('post.user', 'user')

          // .getMany();
          .getRawMany()
      );
    },

    insertPost: async (
      userId: number,
      youtubeData: InsertPostDto,
    ): Promise<Post> => {
      return await this.postRepository.save(
        this.postRepository.create({
          ...youtubeData,
          user: { id: userId },
        }),
      );
    },
  };

  public Mongo = {
    insertPostOfSearc: async (SearchPostDto) => {
      const insertSearchPost = new this.searchPostModel(SearchPostDto);
      insertSearchPost.save();
    },
  };
}
