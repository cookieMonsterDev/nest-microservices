import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaMockModule } from '@libs/kafka/kafka.mock';
import { PostsModule } from '@posts-micros/posts/posts.module';
import { createConfigModuleOptions } from '@libs/common/config';
import { DatabaseModule } from '@posts-micros/database/database.module';
import { DatabaseService } from '@posts-micros/database/database.service';

const configModuleOptions = createConfigModuleOptions('posts');

@Module({
  imports: [ConfigModule.forRoot(configModuleOptions), DatabaseModule, KafkaMockModule, PostsModule],
  providers: [DatabaseService],
  exports: [DatabaseModule, PostsModule, KafkaMockModule],
})
export class FixtureModule {}
