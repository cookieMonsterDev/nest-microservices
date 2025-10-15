import 'dotenv/config';
import { AppModule } from '@users-micros/app.module';
import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DatabaseExceptionFilter } from '@users-micros/database/databse.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalFilters(new DatabaseExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Users microservice')
    .setVersion('0.0.1')
    .setDescription('The users microservice API description')
    .build();

  SwaggerModule.setup('docs', app, () => SwaggerModule.createDocument(app, config));

  await app.listen(process.env.APP_PORT ?? 3021);
}
bootstrap();
