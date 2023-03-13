import { HttpExceptionFilter } from 'src/common/middlewares/error/error.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { Auth } from './database/entites/auth.entity';
import { PostsController } from './posts/posts.controller';
import { User } from './database/entites/user.entity';
import { MulterModule } from '@nestjs/platform-express';
import { MulterS3Service } from './common/util/aws';
import { PostsModule } from './posts/posts.module';
import { Post } from './database/entites/post.entity';

class Config {
  static setENV() {
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
  }

  static setMySQL() {
    return TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: 3306,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [Auth, User, Post],
      synchronize: true,
    });
  }

  static setMongo() {
    return MongooseModule.forRoot(process.env.MONGO_URI);
  }
}

@Module({
  imports: [
    Config.setENV(),
    Config.setMySQL(),
    Config.setMongo(),
    AuthModule,
    UsersModule,
    PostsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
