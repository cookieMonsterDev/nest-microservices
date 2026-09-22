import { ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { PrismaQueryBuilderService } from '@libs/prisma/services/prisma-query-builder.service.js';
import { PrismaRustPanicErrorFilter } from '@libs/prisma/filters/prisma-rust-panic-error.filter.js';
import { PrismaValidationErrorFilter } from '@libs/prisma/filters/prisma-validation-error.filter.js';
import { PrismaKnownRequestErrorFilter } from '@libs/prisma/filters/prisma-known-request-error.filter.js';
import { PrismaInitializationErrorFilter } from '@libs/prisma/filters/prisma-initialization-error.filter.js';
import { PrismaUnknownRequestErrorFilter } from '@libs/prisma/filters/prisma-unknown-request-error.filter.js';
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
