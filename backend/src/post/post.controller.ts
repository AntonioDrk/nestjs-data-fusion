import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { PostService } from './post.service';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  getAllposts() {
    return this.postService.getAllPublicPosts();
  }

  @Get('user/:id')
  getUserPosts(@Param('id') userId: string) {
    return this.postService.getPostsOfUser(userId);
  }
}
