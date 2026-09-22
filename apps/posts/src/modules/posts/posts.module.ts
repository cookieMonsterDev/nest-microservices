import { Module } from '@nestjs/common';
import { PostsService } from '@posts-micros/modules/posts/posts.service.js';
import { PostsController } from '@posts-micros/modules/posts/posts.controller.js';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
