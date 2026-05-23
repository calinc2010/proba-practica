import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(username: string, password: string) {
    if (username !== 'admin' || password !== 'admin123') {
      throw new UnauthorizedException('Username sau parola gresita');
    }

    const payload = {
      username,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
