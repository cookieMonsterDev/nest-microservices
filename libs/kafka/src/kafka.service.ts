import { ClientKafka } from '@nestjs/microservices';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersEvents, PostsEvents } from '@libs/kafka/messages';

type KafkaEvents = UsersEvents & PostsEvents;

@Injectable()
export class KafkaService implements OnModuleInit {
  constructor(private readonly kafkaClient: ClientKafka) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  emit<Topic extends keyof KafkaEvents>(topic: Topic, message: KafkaEvents[Topic]) {
    return this.kafkaClient.emit(topic, message);
  }

  send<Topic extends keyof KafkaEvents>(topic: Topic, message: KafkaEvents[Topic]) {
    return this.kafkaClient.send<Topic, KafkaEvents[Topic]>(topic, message);
  }
}
