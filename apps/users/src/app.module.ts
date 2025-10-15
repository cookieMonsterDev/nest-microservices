import { Module } from '@nestjs/common';
import { KafkaModule } from '@libs/kafka/kafka.module';
import { UsersModule } from '@users-micros/users/users.module';
import { DatabaseModule } from '@users-micros/database/database.module';

@Module({
  imports: [DatabaseModule, KafkaModule, UsersModule],
})
export class AppModule {}
