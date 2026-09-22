import { Global, Module } from '@nestjs/common';
import { GlobalPrismaModule } from '@libs/prisma/global-prisma.module.js';
import { PrismaService } from '@posts-micros/modules/prisma/services/prisma.service.js';

@Global()
@Module({
  imports: [GlobalPrismaModule],
  providers: [PrismaService],
  exports: [PrismaService, GlobalPrismaModule],
})
export class PrismaModule {}
