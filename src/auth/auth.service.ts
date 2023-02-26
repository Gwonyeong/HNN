import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { Auth } from './entities/auth.entity';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private authRepository: AuthRepository,
  ) {}

  async socialLogin(
    email: string,
    profile: string,
    socialLoginId: string,
    platform: string,
  ) {
    const userData = await this.authRepository.findByEmail(email);
    if (userData) {
      const authToken = this.jwtService.sign(
        { id: userData.id },
        { secret: process.env.SECRET_KEY },
      );
      return authToken;
    } else {
      const authData = await this.authRepository.create({
        email,
        platform,
        socialLoginId,
      });
      const authToken = this.jwtService.sign(
        { id: authData.id },
        { secret: process.env.SECRET_KEY },
      );
      return authToken;
    }
  }

  async signUp(createAuthDto: CreateAuthDto): Promise<Auth> {
    const { email, password } = createAuthDto;

    // Generate salt and hash the password
    const salt = process.env.BCRYPT_SALT;
    const hashedPassword = await bcrypt.hash(password, parseInt(salt));

    // Create the user entity with the hashed password
    const user = this.authRepository.create({
      email,
      password: hashedPassword,
      platform: 'local',
    });
    return user;
  }

  async login(user: CreateAuthDto) {
    const userData = await this.authRepository.findByEmail(user.email);
    if (
      !userData ||
      !(await bcrypt.compare(userData.password, user.password))
    ) {
      throw new UnauthorizedException('이메일 혹은 비밀번호를 확인해주세요!');
    }
    const payload = { id: userData.id };
    return { access_token: this.jwtService.sign(payload) };
  }
}
