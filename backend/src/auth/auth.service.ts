import {
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';

import { UserService } from '../user/user.service';
import { SigninDto } from './dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signin(dto: SigninDto) {
    const user = await this.userService.findUser({
      where: {
        email: dto.email,
      },
    });

    if (!user || !(await argon.verify(user.password, dto.password))) {
      throw new UnauthorizedException('Wrong credentials');
    }

    return this.genToken(user.id, user.email);
  }

  signout() {
    Logger.debug('User logged out');
    return 'Logged out';
  }

  async genToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const data = {
      sub: userId,
      email,
    };

    const token = await this.jwt.signAsync(data, {
      expiresIn: '10h',
      secret: this.config.get('JWT_SECRET'),
    });

    return {
      access_token: token,
    };
  }
}
