import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer, Consumer, EachMessagePayload } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private consumers: Map<string, Consumer> = new Map();

  constructor() {
    this.kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID || 'nestjs-microservice',
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    });
  }

  async onModuleInit() {
    this.producer = this.kafka.producer();
    await this.producer.connect();
  }

  async onModuleDestroy() {
    await this.producer?.disconnect();

    for (const consumer of this.consumers.values()) {
      await consumer.disconnect();
    }
  }

  async sendMessage(topic: string, message: any, key?: string) {
    try {
      await this.producer.send({
        topic,
        messages: [
          {
            key: key || Math.random().toString(36).substring(7),
            value: JSON.stringify(message),
          },
        ],
      });
    } catch (error) {
      console.error('Error sending Kafka message:', error);
      throw error;
    }
  }

  async createConsumer(
    groupId: string,
    topics: string[],
    handler: (payload: EachMessagePayload) => Promise<void>,
  ) {
    const consumer = this.kafka.consumer({ groupId });
    this.consumers.set(groupId, consumer);

    await consumer.connect();
    await consumer.subscribe({ topics, fromBeginning: false });

    await consumer.run({
      eachMessage: handler,
    });

    return consumer;
  }

  async disconnectConsumer(groupId: string) {
    const consumer = this.consumers.get(groupId);
    if (consumer) {
      await consumer.disconnect();
      this.consumers.delete(groupId);
    }
  }
}
