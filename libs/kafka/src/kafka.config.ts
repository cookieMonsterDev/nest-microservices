import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

export const createKafkaMicroserviceOptions = (configService: ConfigService): MicroserviceOptions => ({
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: configService.get('APP_NAME') ?? 'default-client',
      brokers: [configService.get('KAFKA_URL') ?? 'localhost:9092'],
    },
    consumer: {
      groupId: `${configService.get('APP_NAME') ?? 'default'}-consumer`,
    },
  },
});
