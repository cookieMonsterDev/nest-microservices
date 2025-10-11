import 'dotenv/config';
import { AppModule } from '@/app.module';
import { readFile } from 'node:fs/promises';
import { NestFactory, Reflector } from '@nestjs/core';
import { DatabaseExceptionFilter } from '@libs/database';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
      },
      consumer: {
        groupId: 'users-consumer',
      },
    },
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalFilters(new DatabaseExceptionFilter());

  const contentString = await readFile('../../package.json', 'utf-8');
  const { version } = JSON.parse(contentString);

  const config = new DocumentBuilder()
    .setTitle('Users microservice')
    .setVersion(version)
    .setDescription('The users microservice API description')
    .build();

  SwaggerModule.setup('api/docs', app, () => SwaggerModule.createDocument(app, config));

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3021);
}
bootstrap();
