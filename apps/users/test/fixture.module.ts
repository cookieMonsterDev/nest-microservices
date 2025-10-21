import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaMockModule } from '@libs/kafka/kafka.mock';
import { UsersModule } from '@users-micros/users/users.module';
import { createConfigModuleOptions } from '@libs/common/config';
import { DatabaseModule } from '@users-micros/database/database.module';
import { DatabaseService } from '@users-micros/database/database.service';

const configModuleOptions = createConfigModuleOptions('users');

@Module({
  imports: [ConfigModule.forRoot(configModuleOptions), DatabaseModule, KafkaMockModule, UsersModule],
  providers: [DatabaseService],
  exports: [DatabaseModule, UsersModule, KafkaMockModule],
})
export class FixtureModule {}
