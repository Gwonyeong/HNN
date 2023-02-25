// naver.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';
import { AuthService } from '../auth.service';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET_KEY,
      callbackURL: process.env.SERVER_URI + '/auth/naver/callback',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ) {
    const { email, profile_image } = profile._json;

    const authToken = await this.authService.socialLogin(email, profile_image);
    done(null, authToken);
  }
}
