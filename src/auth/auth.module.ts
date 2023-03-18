import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt/jwt.strategy';
import { AuthRepository } from './auth.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from '@database/entites/auth.entity';
import { GoogleStrategy } from './google/google.strategy';
import { NaverStrategy } from './naver/naver.strategy';
import { UserRepository } from '@root/users/user.repository';
import { UsersModule } from '@root/users/users.module';
import { User } from '@database/entites/user.entity';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    TypeOrmModule.forFeature([Auth, User]),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    JwtStrategy,
    GoogleStrategy,
    NaverStrategy,
    UserRepository,
  ],
})
export class AuthModule {}
