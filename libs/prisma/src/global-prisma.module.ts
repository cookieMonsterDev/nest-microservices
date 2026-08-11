import { ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { PrismaQueryBuilderService } from '@libs/prisma/services/prisma-query-builder.service';
import { PrismaRustPanicErrorFilter } from '@libs/prisma/filters/prisma-rust-panic-error.filter';
import { PrismaValidationErrorFilter } from '@libs/prisma/filters/prisma-validation-error.filter';
import { PrismaKnownRequestErrorFilter } from '@libs/prisma/filters/prisma-known-request-error.filter';
import { PrismaInitializationErrorFilter } from '@libs/prisma/filters/prisma-initialization-error.filter';
import { PrismaUnknownRequestErrorFilter } from '@libs/prisma/filters/prisma-unknown-request-error.filter';
import { APP_FILTER } from '@nestjs/core';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    PrismaQueryBuilderService,
    { provide: APP_FILTER, useClass: PrismaRustPanicErrorFilter },
    { provide: APP_FILTER, useClass: PrismaValidationErrorFilter },
    { provide: APP_FILTER, useClass: PrismaKnownRequestErrorFilter },
    { provide: APP_FILTER, useClass: PrismaUnknownRequestErrorFilter },
    { provide: APP_FILTER, useClass: PrismaInitializationErrorFilter },
  ],
  exports: [PrismaQueryBuilderService],
})
export class GlobalPrismaModule {}
