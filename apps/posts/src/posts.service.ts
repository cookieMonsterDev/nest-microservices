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
    // Listen to posts-service topic for gateway requests
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
          case 'getByUserId':
            const userPosts = this.posts.filter((p) => p.userId === data.data.userId);
            await this.kafkaService.sendMessage('posts-response', {
              action: 'getByUserId',
              data: userPosts,
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

  // REST API methods
  async getAllPosts() {
    return this.posts;
  }

  async getPostById(id: string) {
    return this.posts.find((p) => p.id === id);
  }

  async getPostsByUserId(userId: string) {
    return this.posts.filter((p) => p.userId === userId);
  }

  async createPost(postData: { title: string; content: string; userId: string }) {
    // Validate user exists by communicating with users service
    const userExists = await this.validateUserExists(postData.userId);
    if (!userExists) {
      throw new Error('User not found');
    }

    const newPost = {
      id: (this.posts.length + 1).toString(),
      ...postData,
    };
    this.posts.push(newPost);
    return newPost;
  }

  private async validateUserExists(userId: string): Promise<boolean> {
    try {
      const requestId = this.generateRequestId();
      
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('User validation timeout'));
        }, 5000);

        // Listen for user validation response
        this.kafkaService.createConsumer(`posts-user-validation-${requestId}`, ['users-response'], async ({ message }) => {
          const data = JSON.parse(message.value?.toString() || '{}');
          if (data.requestId === requestId) {
            clearTimeout(timeout);
            resolve(!!data.data);
          }
        });

        // Send user validation request
        this.kafkaService.sendMessage('users-service', {
          action: 'getById',
          data: { id: userId },
          requestId,
          timestamp: new Date().toISOString(),
        });
      });
    } catch (error) {
      console.error('Error validating user:', error);
      return false;
    }
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  async updatePost(id: string, postData: { title?: string; content?: string }) {
    const postIndex = this.posts.findIndex((p) => p.id === id);
    if (postIndex !== -1) {
      this.posts[postIndex] = {
        ...this.posts[postIndex],
        ...postData,
      };
      return this.posts[postIndex];
    }
    return null;
  }

  async deletePost(id: string) {
    const postIndex = this.posts.findIndex((p) => p.id === id);
    if (postIndex !== -1) {
      this.posts.splice(postIndex, 1);
      return true;
    }
    return false;
  }

  getHello(): string {
    return 'Posts service is running!';
  }
}
