import { Module } from '@nestjs/common';
import { UsersService } from '@users-micros/modules/users/users.service.js';
import { UsersController } from '@users-micros/modules/users/users.controller.js';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
