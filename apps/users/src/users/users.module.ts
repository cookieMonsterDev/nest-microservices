import { Module } from '@nestjs/common';
import { UsersService } from '@apps/users/users/users.service';
import { UsersController } from '@apps/users/users/users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
