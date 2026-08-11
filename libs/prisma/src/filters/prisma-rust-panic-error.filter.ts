import { BaseExceptionFilter } from '@nestjs/core';
import { Catch, HttpStatus, ArgumentsHost, Logger } from '@nestjs/common';
import { PrismaClientRustPanicError } from '@prisma/client/runtime/client';

@Catch(PrismaClientRustPanicError)
export class PrismaRustPanicErrorFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(PrismaRustPanicErrorFilter.name);

  catch(exception: PrismaClientRustPanicError, host: ArgumentsHost) {
    this.logger.fatal(`Prisma Rust panic — engine crashed: ${exception.message}`, exception.stack);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Internal Server Error',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'A critical prisma engine error occurred',
    });
  }
}
