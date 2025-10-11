import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { KafkaModule } from '@libs/kafka';

@Module({
  imports: [KafkaModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
