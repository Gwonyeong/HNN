import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Auth } from '../entites/auth.entity';
import * as bcrypt from 'bcryptjs';
import { responseAppTokenDTO } from './dto/responses/response.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private authRepository: AuthRepository,
  ) {}

  // jwt 관련
  public GroupJWT = {
    createJwtToken: (userData: Auth) => {
      const payload = { id: userData.id };
      return {
        appToken: this.jwtService.sign(payload, {
          secret: process.env.SECRET_KEY,
        }),
      };
    },
  };

  // 로그인 함수
  public GroupLogin = {
    socialLogin: async (
      email: string,
      profile: string,
      socialLoginId: string,
      platform: string,
    ) => {
      const userData = await this.authRepository.findByEmail(email);
      if (userData) {
        const { appToken } = this.GroupJWT.createJwtToken(userData);
        return { appToken };
      } else {
        const userData = await this.authRepository.create({
          email,
          platform,
          socialLoginId,
        });
        const { appToken } = this.GroupJWT.createJwtToken(userData);
        return { appToken };
      }
    },

    login: async (createAuthDto: CreateAuthDto) => {
      const userData = await this.authRepository.findByEmail(
        createAuthDto.email,
      );
      if (
        !userData ||
        !(await bcrypt.compare(userData.password, createAuthDto.password))
      ) {
        throw new UnauthorizedException('이메일 혹은 비밀번호를 확인해주세요!');
      }
      const { appToken } = this.GroupJWT.createJwtToken(userData);

      return { appToken };
    },
  };

  // 회원가입 관련
  public GroupSignUp = {
    signUp: async (
      createAuthDto: CreateAuthDto,
    ): Promise<responseAppTokenDTO> => {
      const { email, password } = createAuthDto;

      // Generate salt and hash the password
      const salt = process.env.BCRYPT_SALT;
      const hashedPassword = await bcrypt.hash(password, parseInt(salt));

      // Create the user entity with the hashed password
      const userData = await this.authRepository.create({
        email,
        password: hashedPassword,
        platform: 'local',
      });
      const { appToken } = this.GroupJWT.createJwtToken(userData);

      return { appToken };
    },
  };
}
