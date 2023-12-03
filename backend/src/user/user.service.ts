import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  findUser(userQuery: Prisma.UserFindFirstArgs<DefaultArgs>) {
    return this.prisma.user.findFirst(userQuery);
  }
}
