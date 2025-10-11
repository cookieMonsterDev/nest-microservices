import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaService } from '@libs/kafka';

@Injectable()
export class GatewayService implements OnModuleInit {
  private pendingRequests: Map<string, { resolve: Function; reject: Function }> = new Map();

  constructor(private readonly kafkaService: KafkaService) {}

  async onModuleInit() {
    // Listen for responses from users service
    await this.kafkaService.createConsumer('gateway-consumer', ['users-response'], async ({ message }) => {
      const data = JSON.parse(message.value?.toString() || '{}');
      const requestId = data.requestId;
      const pendingRequest = this.pendingRequests.get(requestId);
      
      if (pendingRequest) {
        this.pendingRequests.delete(requestId);
        pendingRequest.resolve(data.data);
      }
    });

    // Listen for responses from posts service
    await this.kafkaService.createConsumer('gateway-consumer', ['posts-response'], async ({ message }) => {
      const data = JSON.parse(message.value?.toString() || '{}');
      const requestId = data.requestId;
      const pendingRequest = this.pendingRequests.get(requestId);
      
      if (pendingRequest) {
        this.pendingRequests.delete(requestId);
        pendingRequest.resolve(data.data);
      }
    });
  }

  async sendToUsersService(action: string, data: any) {
    const requestId = this.generateRequestId();
    
    return new Promise((resolve, reject) => {
      this.pendingRequests.set(requestId, { resolve, reject });
      
      this.kafkaService.sendMessage('users-service', {
        action,
        data,
        requestId,
        timestamp: new Date().toISOString(),
      });

      // Set timeout for request
      setTimeout(() => {
        if (this.pendingRequests.has(requestId)) {
          this.pendingRequests.delete(requestId);
          reject(new Error('Request timeout'));
        }
      }, 10000);
    });
  }

  async sendToPostsService(action: string, data: any) {
    const requestId = this.generateRequestId();
    
    return new Promise((resolve, reject) => {
      this.pendingRequests.set(requestId, { resolve, reject });
      
      this.kafkaService.sendMessage('posts-service', {
        action,
        data,
        requestId,
        timestamp: new Date().toISOString(),
      });

      // Set timeout for request
      setTimeout(() => {
        if (this.pendingRequests.has(requestId)) {
          this.pendingRequests.delete(requestId);
          reject(new Error('Request timeout'));
        }
      }, 10000);
    });
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  getHello(): string {
    return 'Gateway is running!';
  }
}
