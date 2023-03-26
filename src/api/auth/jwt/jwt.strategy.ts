import { AuthService } from '../auth.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from '@root/api/users/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.SECRET_KEY,
    });
  }

  async validate(payload: any) {
    const userData = await this.userRepository.Mysql.findById(payload.id);
    return {
      userId: userData.userId,
      nickname: userData.userNickname,
      role: userData.userRole,
      gender: userData.userGender,
      MBTI: userData.userMBTI,
    };
  }
}
