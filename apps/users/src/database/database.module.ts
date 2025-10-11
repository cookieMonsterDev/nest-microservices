import { Module } from '@nestjs/common';
import { DatabaseService } from '@users-micros/database/database.service';

@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
