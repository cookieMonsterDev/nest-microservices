import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaService } from '@libs/kafka';

@Injectable()
export class PostsService implements OnModuleInit {
  private posts: any[] = [
    {
      id: '1',
      title: 'First Post',
      content: 'This is the first post',
      userId: '1',
    },
    {
      id: '2',
      title: 'Second Post',
      content: 'This is the second post',
      userId: '2',
    },
  ];

  constructor(private readonly kafkaService: KafkaService) {}

  async onModuleInit() {
    // Listen to posts-service topic
    await this.kafkaService.createConsumer(
      'posts-consumer',
      ['posts-service'],
      async ({ message }) => {
        const data = JSON.parse(message.value?.toString() || '{}');
        console.log('Posts service received:', data);

        // Handle different actions
        switch (data.action) {
          case 'getAll':
            await this.kafkaService.sendMessage('posts-response', {
              action: 'getAll',
              data: this.posts,
              requestId: data.requestId,
            });
            break;
          case 'getById':
            const post = this.posts.find((p) => p.id === data.data.id);
            await this.kafkaService.sendMessage('posts-response', {
              action: 'getById',
              data: post,
              requestId: data.requestId,
            });
            break;
          case 'create':
            const newPost = {
              id: (this.posts.length + 1).toString(),
              ...data.data,
            };
            this.posts.push(newPost);
            await this.kafkaService.sendMessage('posts-response', {
              action: 'create',
              data: newPost,
              requestId: data.requestId,
            });
            break;
          case 'update':
            const postIndex = this.posts.findIndex(
              (p) => p.id === data.data.id,
            );
            if (postIndex !== -1) {
              this.posts[postIndex] = {
                ...this.posts[postIndex],
                ...data.data,
              };
              await this.kafkaService.sendMessage('posts-response', {
                action: 'update',
                data: this.posts[postIndex],
                requestId: data.requestId,
              });
            }
            break;
          case 'delete':
            const deleteIndex = this.posts.findIndex(
              (p) => p.id === data.data.id,
            );
            if (deleteIndex !== -1) {
              this.posts.splice(deleteIndex, 1);
              await this.kafkaService.sendMessage('posts-response', {
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
    return 'Posts service is running!';
  }
}
