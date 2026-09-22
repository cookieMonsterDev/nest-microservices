import { Global, Module } from '@nestjs/common';
import { KafkaService } from '@libs/kafka/kafka.service.js';

export const KafkaMockService = {
  connect: vi.fn().mockResolvedValue(undefined),
  emit: vi.fn().mockImplementation((topic, message) => ({ topic, message })),
  send: vi.fn().mockImplementation((topic, message) => Promise.resolve({ topic, message })),
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
