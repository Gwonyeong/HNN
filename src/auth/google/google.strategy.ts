import { AuthRepository } from './../auth.repository';
// google.strategy.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private jwtService: JwtService,
    private authRepository: AuthRepository,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET_KEY,
      callbackURL: process.env.SERVER_URI + '/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const email: string = emails[0].value;
    const userData = await this.authRepository.findByEmail(email);
    if (userData) {
      const authToken = this.jwtService.sign(
        { id: userData.id },
        { secret: process.env.SECRET_KEY },
      );
      done(null, { authToken });
    } else {
      const authData = await this.authRepository.create({ email });
      const authToken = this.jwtService.sign(
        { id: authData.id },
        { secret: process.env.SECRET_KEY },
      );

      done(null, { authToken });
    }
  }
}
