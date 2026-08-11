import { BaseExceptionFilter } from '@nestjs/core';
import { Catch, HttpStatus, ArgumentsHost, Logger } from '@nestjs/common';
import { PrismaClientUnknownRequestError } from '@prisma/client/runtime/client';

@Catch(PrismaClientUnknownRequestError)
export class PrismaUnknownRequestErrorFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(PrismaUnknownRequestErrorFilter.name);

  catch(exception: PrismaClientUnknownRequestError, host: ArgumentsHost) {
    this.logger.error(`Unknown Prisma request error: ${exception.message}`, exception.stack);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Internal Server Error',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'An unknown database error occurred',
    });
  }
}
