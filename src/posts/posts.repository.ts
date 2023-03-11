import { Post } from './../entites/post.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dtos/posts.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async create(userId: number, youtubeData: CreatePostDto) {
    this.postRepository.save(
      this.postRepository.create({
        ...youtubeData,
        user: { id: userId },
      }),
    );
  }
}
