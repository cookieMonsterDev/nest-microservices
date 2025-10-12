import { Module } from '@nestjs/common';
import { PostsModule } from '@posts-micros/posts/posts.module';
import { DatabaseModule } from '@posts-micros/database/database.module';

@Module({
  imports: [DatabaseModule, PostsModule],
})
export class AppModule {}
