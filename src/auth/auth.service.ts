import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UseGuards } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { Auth } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private authRepository: AuthRepository,
  ) {}

  async socialLogin(email: string, profile: string) {
    const userData = await this.authRepository.findByEmail(email);
    if (userData) {
      const authToken = this.jwtService.sign(
        { id: userData.id },
        { secret: process.env.SECRET_KEY },
      );
      return authToken;
    } else {
      const authData = await this.authRepository.create({ email });
      const authToken = this.jwtService.sign(
        { id: authData.id },
        { secret: process.env.SECRET_KEY },
      );
      return authToken;
    }
  }

  async signUp(createAuthDto: CreateAuthDto): Promise<Auth> {
    const { email, password, nickname, MBTI } = createAuthDto;

    // Generate salt and hash the password
    const salt = process.env.BCRYPT_SALT;
    const hashedPassword = await bcrypt.hash(password, parseInt(salt));

    // Create the user entity with the hashed password
    const user = this.authRepository.create({
      email,
      password: hashedPassword,
      nickname,
      MBTI,
    });
    return user;
  }

  @UseGuards(AuthGuard('jwt'))
  async login(user: CreateAuthDto) {
    const payload = { email: user.email, password: user.password };
    return { access_token: this.jwtService.sign(payload) };
  }
}
