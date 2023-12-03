import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  getPostsOfUser(userid: string) {
    return this.prisma.posts.findMany({
      where: { author: { id: userid } },
    });
  }

  getAllPublicPosts() {
    return this.prisma.posts.findMany();
  }
}
