import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt/jwt.strategy';
import { AuthRepository } from './auth.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { KakaoStrategy } from './kakao/kakao.strategy';
import { GoogleStrategy } from './google/google.strategy';
import { NaverStrategy } from './naver/naver.strategy';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([Auth]),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    JwtStrategy,
    KakaoStrategy,
    GoogleStrategy,
    NaverStrategy,
  ],
})
export class AuthModule {}
