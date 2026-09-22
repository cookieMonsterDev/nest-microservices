import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaModule } from '@libs/kafka/kafka.module.js';
import { UsersModule } from '@users-micros/modules/users/users.module.js';
import { PrismaModule } from '@users-micros/modules/prisma/index.js';
import { createConfigModuleOptions } from '@libs/common/config.js';

const configModuleOptions = createConfigModuleOptions('users');

@Module({
  imports: [ConfigModule.forRoot(configModuleOptions), PrismaModule, KafkaModule, UsersModule],
})
export class AppModule {}
