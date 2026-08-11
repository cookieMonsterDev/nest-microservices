import { Global, Module } from '@nestjs/common';
import { GlobalPrismaModule } from '@libs/prisma/global-prisma.module';
import { PrismaService } from '@users-micros/modules/prisma/services/prisma.service';

@Global()
@Module({
  imports: [GlobalPrismaModule],
  providers: [PrismaService],
  exports: [PrismaService, GlobalPrismaModule],
})
export class PrismaModule {}
