import { Injectable } from '@nestjs/common';
import { KafkaService } from '@libs/kafka';

@Injectable()
export class GatewayService {
  constructor(private readonly kafkaService: KafkaService) {}

  async sendToUsersService(action: string, data: any) {
    return await this.kafkaService.sendMessage('users-service', {
      action,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  async sendToPostsService(action: string, data: any) {
    return await this.kafkaService.sendMessage('posts-service', {
      action,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  getHello(): string {
    return 'Gateway is running!';
  }
}
