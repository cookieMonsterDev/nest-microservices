import { Module } from '@nestjs/common';
import { KafkaModule } from '@libs/kafka';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [KafkaModule, UsersModule],
})
export class AppModule {}
