import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaMockModule } from '@libs/kafka/kafka.mock';
import { UsersModule } from '@users-micros/modules/users/users.module';
import { PrismaModule } from '@users-micros/modules/prisma';
import { createConfigModuleOptions } from '@libs/common/config';

const configModuleOptions = createConfigModuleOptions('users');

@Module({
  imports: [ConfigModule.forRoot(configModuleOptions), PrismaModule, KafkaMockModule, UsersModule],
  exports: [PrismaModule, UsersModule, KafkaMockModule],
})
export class FixtureModule {}
