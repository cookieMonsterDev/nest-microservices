import { Module } from '@nestjs/common';
import { UsersModule } from '@users-micros/users/users.module';
import { DatabaseModule } from '@users-micros/database/database.module';

@Module({
  imports: [DatabaseModule, UsersModule],
})
export class AppModule {}
