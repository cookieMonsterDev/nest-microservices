import { BaseExceptionFilter } from '@nestjs/core';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Catch, HttpStatus, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch(PrismaClientKnownRequestError)
export class DatabaseExceptionFilter extends BaseExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    switch (exception.code) {
      case 'P2025': // Not found error code
        response.status(HttpStatus.NOT_FOUND).json({
          message: `${(exception.meta?.modelName as string).slice(0, -1)} not found`,
          error: 'Not Found',
          statusCode: HttpStatus.NOT_FOUND,
        });
        break;

      case 'P2002': // Unique constraint error code
        response.status(HttpStatus.CONFLICT).json({
          message: `${exception.meta?.target?.[0]} is taken`,
          error: 'Conflict',
          statusCode: HttpStatus.CONFLICT,
        });
        break;

      default:
        super.catch(new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR), host);
        break;
    }
  }
}
