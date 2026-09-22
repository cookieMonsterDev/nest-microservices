import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaModule } from '@libs/kafka/kafka.module.js';
import { PostsModule } from '@posts-micros/modules/posts/posts.module.js';
import { PrismaModule } from '@posts-micros/modules/prisma/index.js';
import { createConfigModuleOptions } from '@libs/common/config.js';
import { UsersGrpcClientModule } from '@libs/grpc/users-grpc-client.module.js';

const configModuleOptions = createConfigModuleOptions('posts');

@Module({
  imports: [ConfigModule.forRoot(configModuleOptions), PrismaModule, KafkaModule, UsersGrpcClientModule, PostsModule],
})
export class AppModule {}
