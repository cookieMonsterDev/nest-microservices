import { Module } from '@nestjs/common';
import { KafkaModule } from '@libs/kafka/kafka.module';
import { PostsModule } from '@posts-micros/posts/posts.module';
import { DatabaseModule } from '@posts-micros/database/database.module';

@Module({
  imports: [DatabaseModule, KafkaModule, PostsModule],
})
export class AppModule {}
