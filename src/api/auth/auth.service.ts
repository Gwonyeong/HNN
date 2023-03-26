import { User } from '@database/entites/user.entity';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { InsertAuthDto } from './dto/auth.dto';
import { Auth } from '../../database/entites/auth.entity';
import * as bcrypt from 'bcrypt';
import { responseAppTokenDTO } from './dto/response.dto';
import { UserRepository } from '@root/api/users/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private authRepository: AuthRepository,
    private userRepository: UserRepository,
  ) {}

  // jwt 관련
  public GroupJWT = {
    insertJwtToken: (authData) => {
      const payload = { id: authData.user_id };
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
      profileImage: string,
      socialLoginId: string,
      platform: string,
    ) => {
      const authData = await this.authRepository.findByEmail(email);
      if (authData) {
        const { appToken } = this.GroupJWT.insertJwtToken(authData);
        return { appToken };
      } else {
        const userData = await this.userRepository.Mysql.insertUser({
          profileImage: profileImage ? profileImage : 'default.png',
        });
        const authData = await this.authRepository.insert({
          email,
          platform,
          socialLoginId,
          user: userData.id,
        });

        const { appToken } = this.GroupJWT.insertJwtToken(authData);
        return { appToken };
      }
    },

    login: async (insertAuthDto: InsertAuthDto) => {
      const authData = await this.authRepository.findByEmail(
        insertAuthDto.email,
      );

      if (
        !authData ||
        !(await bcrypt.compare(insertAuthDto.password, authData.password))
      ) {
        throw new UnauthorizedException('이메일 혹은 비밀번호를 확인해주세요!');
      }

      const { appToken } = this.GroupJWT.insertJwtToken(authData);

      return { appToken };
    },
  };

  // 회원가입 관련
  public GroupSignUp = {
    signUp: async (insertAuthDto: InsertAuthDto): Promise<{ appToken }> => {
      const { email, password } = insertAuthDto;
      const dupAuthData = await this.authRepository.findByEmail(email);
      if (dupAuthData) {
        throw new BadRequestException('이미 가입된 이메일입니다.');
      }

      // Generate salt and hash the password
      const salt = process.env.BCRYPT_SALT;
      const hashedPassword = await bcrypt.hash(password, parseInt(salt));

      //일단 user데이터 만들어두기
      const userData = await this.userRepository.Mysql.insertUser({});
      // insert the user entity with the hashed password
      const authData = await this.authRepository.insert({
        email,
        password: hashedPassword,
        platform: 'local',
        user: userData.id,
      });

      const { appToken } = this.GroupJWT.insertJwtToken(authData);

      return { appToken };
    },
  };
}
