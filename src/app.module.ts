import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './api/users/users.module';
import { AuthModule } from './api/auth/auth.module';
import { Auth } from './database/entites/auth.entity';
import { User } from './database/entites/user.entity';

import { PostsModule } from '@root/api/posts/posts.module';
import { Post } from './database/entites/post.entity';
import { LikesModule } from './api/likes/likes.module';
import { Like } from './database/entites/like.entity';
import { CommentsModule } from './api/comments/comments.module';
import { Comment } from './database/entites/comments.entity';

export class Config {
  static setENV = () => {
    let envFilePath: string;
    switch (process.env.NODE_ENV) {
      case 'production':
        envFilePath = '.prod.env';
        break;
      case 'test':
        envFilePath = '.test.env';
        break;
      default:
        envFilePath = '.dev.env';
        break;
    }
    return ConfigModule.forRoot({ envFilePath });
  };

  static setMySQL(synchronize: boolean) {
    return TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: 3306,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [Auth, User, Post, Like, Comment],
      synchronize,
    });
  }

  static setMongo() {
    return MongooseModule.forRoot(process.env.MONGO_URI);
  }
}

@Module({
  imports: [
    Config.setENV(),
    Config.setMySQL(process.env.NODE_ENV == 'production' ? false : true),
    Config.setMongo(),
    AuthModule,
    UsersModule,
    PostsModule,
    LikesModule,
    CommentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
