import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaModule } from '@libs/kafka/kafka.module';
import { PostsModule } from '@posts-micros/posts/posts.module';
import { createConfigModuleOptions } from '@libs/common/config';
import { DatabaseModule } from '@posts-micros/database/database.module';

const configModuleOptions = createConfigModuleOptions('posts');

// just test

@Module({
  imports: [ConfigModule.forRoot(configModuleOptions), DatabaseModule, KafkaModule, PostsModule],
})
export class AppModule {}
