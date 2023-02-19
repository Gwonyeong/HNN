import { JwtService } from '@nestjs/jwt';
import { Injectable, UseGuards } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  @UseGuards(AuthGuard('jwt'))
  async login(user: CreateAuthDto) {
    const payload = { email: user.email, password: user.password };
    return { access_token: this.jwtService.sign(payload) };
  }
}
