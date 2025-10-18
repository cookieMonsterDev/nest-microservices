import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '@nestjs/config';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@posts-micros/generated/prisma';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {
    const connectionString = configService.get<string>('DATABASE_URL') ?? '';

    const adapter = new PrismaPg({ connectionString });

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
