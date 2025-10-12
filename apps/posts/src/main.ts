import 'dotenv/config';
import { AppModule } from '@posts-micros/app.module';
import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DatabaseExceptionFilter } from '@posts-micros/database/databse.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalFilters(new DatabaseExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Posts microservice')
    .setVersion('0.0.1')
    .setDescription('The posts microservice API description')
    .build();

  SwaggerModule.setup('docs', app, () => SwaggerModule.createDocument(app, config));

  await app.startAllMicroservices();
  await app.listen(process.env.APP_PORT ?? 3031);
}
bootstrap();
