import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { SigninDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async signin(dto: SigninDto) {
    const hash = await argon.hash(dto.password);
    const user = await this.userService.findUser({
      where: {
        email: dto.email,
      },
    });

    //TODO: remove sensible log
    Logger.error({ dto, hash });

    if (!user || !(await argon.verify(user.password, dto.password))) {
      throw new ForbiddenException('Wrong credentials');
    }

    delete user.password;
    return user;
  }

  signout() {
    Logger.debug('User logged out');
    return 'Logged out';
  }
}
