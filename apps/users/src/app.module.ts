import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaModule } from '@libs/kafka/kafka.module';
import { UsersModule } from '@users-micros/users/users.module';
import { createConfigModuleOptions } from '@libs/common/config';
import { DatabaseModule } from '@users-micros/database/database.module';

const configModuleOptions = createConfigModuleOptions('users');

@Module({
  imports: [ConfigModule.forRoot(configModuleOptions), DatabaseModule, KafkaModule, UsersModule],
})
export class AppModule {}
