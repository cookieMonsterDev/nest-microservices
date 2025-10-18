import { Global, Module } from '@nestjs/common';
import { KafkaService } from '@libs/kafka/kafka.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Global()
@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_CLIENT',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const appName = configService.get<string>('APP_NAME');
          const kafkaUrl = configService.get<string>('KAFKA_URL');

          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: appName ?? 'default-client',
                brokers: kafkaUrl ? [kafkaUrl] : ['localhost:9092'],
              },
              consumer: {
                groupId: `${appName ?? 'default'}-consumer`,
              },
            },
          };
        },
      },
    ]),
  ],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
