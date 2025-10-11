import 'dotenv/config';
// import { readFile } from 'node:fs/promises';
import { AppModule } from '@users-micros/app.module';
import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DatabaseExceptionFilter } from '@users-micros/database/databse.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalFilters(new DatabaseExceptionFilter());

  // const contentString = await readFile('../../package.json', 'utf-8');
  // const { version } = JSON.parse(contentString);

  const config = new DocumentBuilder()
    .setTitle('Users microservice')
    // .setVersion(version)
    .setDescription('The users microservice API description')
    .build();

  SwaggerModule.setup('docs', app, () => SwaggerModule.createDocument(app, config));

  await app.startAllMicroservices();
  await app.listen(process.env.API_PORT ?? 3021);
}
bootstrap();
