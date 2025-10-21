import { Global, Module } from '@nestjs/common';
import { KafkaService } from '@libs/kafka/kafka.service';

export const KafkaMockService = {
  connect: jest.fn().mockResolvedValue(undefined),
  emit: jest.fn().mockImplementation((topic, message) => ({ topic, message })),
  send: jest.fn().mockImplementation((topic, message) => Promise.resolve({ topic, message })),
};

@Global()
@Module({
  providers: [
    {
      provide: KafkaService,
      useValue: KafkaMockService,
    },
  ],
  exports: [KafkaService],
})
export class KafkaMockModule {}
