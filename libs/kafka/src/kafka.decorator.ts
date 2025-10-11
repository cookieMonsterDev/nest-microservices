import { SetMetadata } from '@nestjs/common';

export const KAFKA_TOPIC_METADATA = 'kafka:topic';
export const KAFKA_GROUP_METADATA = 'kafka:group';

export const KafkaTopic = (topic: string) =>
  SetMetadata(KAFKA_TOPIC_METADATA, topic);
export const KafkaGroup = (group: string) =>
  SetMetadata(KAFKA_GROUP_METADATA, group);
