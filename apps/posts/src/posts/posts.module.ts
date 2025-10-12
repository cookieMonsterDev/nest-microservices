import { Module } from '@nestjs/common';
import { PostsService } from '@posts-micros/posts/posts.service';
import { PostsController } from '@posts-micros/posts/posts.controller';
import { DatabaseModule } from '@posts-micros/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
