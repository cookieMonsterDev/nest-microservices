import { join } from 'path';
import { Module } from '@nestjs/common';
import { KafkaModule } from '@libs/kafka/kafka.module';
import { PostsModule } from '@posts-micros/posts/posts.module';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import { DatabaseModule } from '@posts-micros/database/database.module';

const configModuleOptions: ConfigModuleOptions = {
  isGlobal: true,
  envFilePath: join(process.cwd(), '/apps/posts/.env'),
};

@Module({
  imports: [ConfigModule.forRoot(configModuleOptions), DatabaseModule, KafkaModule, PostsModule],
})
export class AppModule {}
