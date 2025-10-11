import { Module } from '@nestjs/common';
import { KafkaModule } from '@libs/kafka';
import { UsersService } from '@/users/users.service';
import { UsersController } from '@/users/users.controller';

@Module({
  imports: [KafkaModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
