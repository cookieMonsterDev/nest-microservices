import { BaseExceptionFilter } from '@nestjs/core';
import { Catch, HttpStatus, ArgumentsHost } from '@nestjs/common';
import { PrismaClientValidationError } from '@prisma/client/runtime/client';

@Catch(PrismaClientValidationError)
export class PrismaValidationErrorFilter extends BaseExceptionFilter {
  catch(_exception: PrismaClientValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(HttpStatus.BAD_REQUEST).json({
      error: 'Bad Request',
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Invalid query arguments',
    });
  }
}
