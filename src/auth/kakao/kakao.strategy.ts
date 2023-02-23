import { AuthRepository } from './../auth.repository';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private authRepostory: AuthRepository) {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/kakao/callback',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    console.log(profile);
    const { email } = profile;
    const userData = await this.authRepostory.findByEmail(email);
    const { id, provider } = profile;
    return { id, provider, accessToken };
  }
}
