import { BaseExceptionFilter } from '@nestjs/core';
import { Catch, HttpStatus, ArgumentsHost, HttpException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

function singularize(word: string): string {
  if (word.endsWith('ies')) return `${word.slice(0, -3)}y`;
  if (word.endsWith('s')) return word.slice(0, -1);
  return word;
}

@Catch(PrismaClientKnownRequestError)
export class PrismaKnownRequestErrorFilter extends BaseExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    switch (exception.code) {
      case 'P2001':
      case 'P2015':
      case 'P2018':
      case 'P2025':
        response.status(HttpStatus.NOT_FOUND).json({
          message: `${singularize((exception.meta?.modelName as string | undefined) ?? 'Record')} not found`,
          error: 'Not Found',
          statusCode: HttpStatus.NOT_FOUND,
        });
        break;

      case 'P2002':
        response.status(HttpStatus.CONFLICT).json({
          error: 'Conflict',
          statusCode: HttpStatus.CONFLICT,
          message: `${(exception.meta?.target as string[] | undefined)?.[0] ?? 'Field'} is taken`,
        });
        break;

      case 'P2000':
        response.status(HttpStatus.BAD_REQUEST).json({
          error: 'Bad Request',
          statusCode: HttpStatus.BAD_REQUEST,
          message: `Value too long for field: ${exception.meta?.column_name ?? 'unknown'}`,
        });
        break;

      case 'P2005':
      case 'P2006':
        response.status(HttpStatus.BAD_REQUEST).json({
          error: 'Bad Request',
          statusCode: HttpStatus.BAD_REQUEST,
          message: `Invalid value for field: ${exception.meta?.field_name ?? 'unknown'}`,
        });
        break;

      case 'P2007':
        response.status(HttpStatus.BAD_REQUEST).json({
          error: 'Bad Request',
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Data validation error',
        });
        break;

      case 'P2011':
        response.status(HttpStatus.BAD_REQUEST).json({
          message: `Field cannot be null: ${exception.meta?.constraint ?? 'unknown'}`,
          error: 'Bad Request',
          statusCode: HttpStatus.BAD_REQUEST,
        });
        break;

      case 'P2012':
        response.status(HttpStatus.BAD_REQUEST).json({
          error: 'Bad Request',
          statusCode: HttpStatus.BAD_REQUEST,
          message: `Missing required field: ${exception.meta?.path ?? 'unknown'}`,
        });
        break;

      case 'P2003':
        response.status(HttpStatus.CONFLICT).json({
          error: 'Conflict',
          statusCode: HttpStatus.CONFLICT,
          message: `Operation not allowed: related record constraint on ${exception.meta?.field_name ?? 'unknown'}`,
        });
        break;

      case 'P2004':
        response.status(HttpStatus.BAD_REQUEST).json({
          error: 'Bad Request',
          statusCode: HttpStatus.BAD_REQUEST,
          message: `Database constraint failed: ${exception.meta?.constraint ?? 'unknown'}`,
        });
        break;

      default:
        super.catch(new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR), host);
        break;
    }
  }
}
