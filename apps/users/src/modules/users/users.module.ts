import { Module } from '@nestjs/common';
import { UsersService } from '@users-micros/modules/users/users.service.js';
import { UsersController } from '@users-micros/modules/users/users.controller.js';
import { UsersGrpcController } from '@users-micros/modules/users/users-grpc.controller.js';

@Module({
  controllers: [UsersController, UsersGrpcController],
  providers: [UsersService],
})
export class UsersModule {}
