import { Module } from '@nestjs/common';
import { KafkaModule } from '@libs/kafka';
import { UsersModule } from '@/users/users.module';
import { DatabaseModule } from '@/database/database.module';

@Module({
  imports: [KafkaModule, DatabaseModule, UsersModule],
})
export class AppModule {}
