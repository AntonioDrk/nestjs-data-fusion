import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // Prevents lazy loading on first db request
  async onModuleInit() {
    await this.$connect();
  }
}
