import { Module } from '@nestjs/common';
import { UsersService } from '@users-micros/modules/users/users.service';
import { UsersController } from '@users-micros/modules/users/users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
