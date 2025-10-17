import { Global, Module } from '@nestjs/common';
import { KafkaService } from '@libs/kafka/kafka.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: process.env.APP_NAME,
            brokers: [process.env.APP_NAME!],
          },
          consumer: {
            groupId: `${process.env.APP_NAME}-consumer`,
          },
        },
      },
    ]),
  ],
  exports: [KafkaService],
})
export class KafkaModule {}
