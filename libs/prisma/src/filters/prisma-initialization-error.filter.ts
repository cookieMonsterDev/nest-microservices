import { BaseExceptionFilter } from '@nestjs/core';
import { Catch, HttpStatus, ArgumentsHost, Logger } from '@nestjs/common';
import { PrismaClientInitializationError } from '@prisma/client/runtime/client';

@Catch(PrismaClientInitializationError)
export class PrismaInitializationErrorFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(PrismaInitializationErrorFilter.name);

  catch(exception: PrismaClientInitializationError, host: ArgumentsHost) {
    this.logger.fatal(
      `Prisma failed to initialize [${exception.errorCode ?? 'unknown code'}]: ${exception.message}`,
      exception.stack,
    );

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(HttpStatus.SERVICE_UNAVAILABLE).json({
      error: 'Service Unavailable',
      statusCode: HttpStatus.SERVICE_UNAVAILABLE,
      message: 'Database connection could not be established',
    });
  }
}
