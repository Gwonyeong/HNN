import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/auth.dto';
import { Auth } from '../entites/auth.entity';
import * as bcrypt from 'bcrypt';
import { responseAppTokenDTO } from './dto/responses/response.dto';
import { UserRepository } from 'src/users/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private authRepository: AuthRepository,
    private userRepository: UserRepository,
  ) {}

  // jwt 관련
  public GroupJWT = {
    createJwtToken: (authData: Auth) => {
      const payload = { id: authData.id, role: authData.role };
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
      profilePicture: string,
      socialLoginId: string,
      platform: string,
    ) => {
      const authData = await this.authRepository.findByEmail(email);
      if (authData) {
        const { appToken } = this.GroupJWT.createJwtToken(authData);
        return { appToken };
      } else {
        const authData = await this.authRepository.create({
          email,
          platform,
          socialLoginId,
        });
        await this.userRepository.createUser({
          profilePicture,
        });
        const { appToken } = this.GroupJWT.createJwtToken(authData);
        return { appToken };
      }
    },

    login: async (createAuthDto: CreateAuthDto) => {
      const authData = await this.authRepository.findByEmail(
        createAuthDto.email,
      );

      if (
        !authData ||
        !(await bcrypt.compare(createAuthDto.password, authData.password))
      ) {
        throw new UnauthorizedException('이메일 혹은 비밀번호를 확인해주세요!');
      }

      const { appToken } = this.GroupJWT.createJwtToken(authData);

      return { appToken };
    },
  };

  // 회원가입 관련
  public GroupSignUp = {
    signUp: async (
      createAuthDto: CreateAuthDto,
    ): Promise<responseAppTokenDTO> => {
      const { email, password } = createAuthDto;
      const dupAuthData = await this.authRepository.findByEmail(email);
      if (dupAuthData) {
        throw new BadRequestException('이미 가입된 이메일입니다.');
      }

      // Generate salt and hash the password
      const salt = process.env.BCRYPT_SALT;
      const hashedPassword = await bcrypt.hash(password, parseInt(salt));

      // Create the user entity with the hashed password
      const authData = await this.authRepository.create({
        email,
        password: hashedPassword,
        platform: 'local',
      });
      //일단 user데이터 만들어두기
      await this.userRepository.createUser({});
      const { appToken } = this.GroupJWT.createJwtToken(authData);

      return { appToken };
    },
  };
}
