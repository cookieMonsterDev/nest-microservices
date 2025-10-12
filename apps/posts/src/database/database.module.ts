import { Module } from '@nestjs/common';
import { DatabaseService } from '@posts-micros/database/database.service';

@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
