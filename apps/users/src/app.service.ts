import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaService } from '@libs/kafka';

@Injectable()
export class AppService implements OnModuleInit {
  private users: any[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  ];

  constructor(private readonly kafkaService: KafkaService) {}

  async onModuleInit() {
    // Listen to users-service topic
    await this.kafkaService.createConsumer(
      'users-consumer',
      ['users-service'],
      async ({ message }) => {
        const data = JSON.parse(message.value?.toString() || '{}');
        console.log('Users service received:', data);

        // Handle different actions
        switch (data.action) {
          case 'getAll':
            await this.kafkaService.sendMessage('users-response', {
              action: 'getAll',
              data: this.users,
              requestId: data.requestId,
            });
            break;
          case 'getById':
            const user = this.users.find((u) => u.id === data.data.id);
            await this.kafkaService.sendMessage('users-response', {
              action: 'getById',
              data: user,
              requestId: data.requestId,
            });
            break;
          case 'create':
            const newUser = {
              id: (this.users.length + 1).toString(),
              ...data.data,
            };
            this.users.push(newUser);
            await this.kafkaService.sendMessage('users-response', {
              action: 'create',
              data: newUser,
              requestId: data.requestId,
            });
            break;
          case 'update':
            const userIndex = this.users.findIndex(
              (u) => u.id === data.data.id,
            );
            if (userIndex !== -1) {
              this.users[userIndex] = {
                ...this.users[userIndex],
                ...data.data,
              };
              await this.kafkaService.sendMessage('users-response', {
                action: 'update',
                data: this.users[userIndex],
                requestId: data.requestId,
              });
            }
            break;
          case 'delete':
            const deleteIndex = this.users.findIndex(
              (u) => u.id === data.data.id,
            );
            if (deleteIndex !== -1) {
              this.users.splice(deleteIndex, 1);
              await this.kafkaService.sendMessage('users-response', {
                action: 'delete',
                data: { success: true },
                requestId: data.requestId,
              });
            }
            break;
        }
      },
    );
  }

  getHello(): string {
    return 'Users service is running!';
  }
}
