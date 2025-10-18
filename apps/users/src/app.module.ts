import { join } from 'path';
import { Module } from '@nestjs/common';
import { KafkaModule } from '@libs/kafka/kafka.module';
import { UsersModule } from '@users-micros/users/users.module';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import { DatabaseModule } from '@users-micros/database/database.module';

const configModuleOptions: ConfigModuleOptions = {
  isGlobal: true,
  envFilePath: join(process.cwd(), '/apps/users/.env'),
};

@Module({
  imports: [ConfigModule.forRoot(configModuleOptions), DatabaseModule, KafkaModule, UsersModule],
})
export class AppModule {}
