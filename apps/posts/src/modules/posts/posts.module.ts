import { Module } from '@nestjs/common';
import { PostsService } from '@posts-micros/modules/posts/posts.service';
import { PostsController } from '@posts-micros/modules/posts/posts.controller';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
