import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaMockModule } from '@libs/kafka/kafka.mock';
import { PostsModule } from '@posts-micros/modules/posts/posts.module';
import { PrismaModule } from '@posts-micros/modules/prisma';
import { createConfigModuleOptions } from '@libs/common/config';

const configModuleOptions = createConfigModuleOptions('posts');

@Module({
  imports: [ConfigModule.forRoot(configModuleOptions), PrismaModule, KafkaMockModule, PostsModule],
  exports: [PrismaModule, PostsModule, KafkaMockModule],
})
export class FixtureModule {}
