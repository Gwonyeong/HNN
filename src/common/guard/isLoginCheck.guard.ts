import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  CanActivate,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '@root/api/users/user.repository';

@Injectable()
export class CheckLoginAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userRepository: UserRepository,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    // CanActivate를 implements 하였으므로, canActivate 함수를 구현해야 합니다.
    const request = context.switchToHttp().getRequest();
    // 클라이언트에서 보낸 request 정보를 읽어옵니다.

    const { authorization } = request.headers;
    if (!authorization) {
      return true;
    }

    // 사용자가 헤더에 보낸 access_token key값의 토큰값.
    const [key, val] = authorization.split(' ');
    if (!key || key !== 'Bearer') {
      return true;
    }
    const token = this.jwtService.verify(val, {
      secret: process.env.SECRET_KEY,
    });
    const userData = await this.userRepository.Mysql.findById(token.id);
    request.user = {
      userId: userData.id,
      nickname: userData.nickname,
      role: userData.role,
      gender: userData.gender,
      MBTI: userData.MBTI,
    };
    return true;
  }
}
