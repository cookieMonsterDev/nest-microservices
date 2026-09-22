import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaMockModule } from '@libs/kafka/kafka.mock.js';
import { UsersModule } from '@users-micros/modules/users/users.module.js';
import { PrismaModule } from '@users-micros/modules/prisma/index.js';
import { createConfigModuleOptions } from '@libs/common/config.js';

const configModuleOptions = createConfigModuleOptions('users');

@Module({
  imports: [ConfigModule.forRoot(configModuleOptions), PrismaModule, KafkaMockModule, UsersModule],
  exports: [PrismaModule, UsersModule, KafkaMockModule],
})
export class FixtureModule {}
