import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  signin() {
    //throw new Error('What happened?');
    Logger.debug('Signing in user');
    return 'Signed in';
  }

  signout() {
    Logger.debug('User logged out');
    return 'Logged out';
  }
}
