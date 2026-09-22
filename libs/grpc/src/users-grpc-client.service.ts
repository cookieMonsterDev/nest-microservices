import { status } from '@grpc/grpc-js';
import { firstValueFrom } from 'rxjs';
import { type ClientGrpc } from '@nestjs/microservices';
import { Inject, Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { type UserResponse, type UsersGrpcService } from '@libs/grpc/users-grpc.interface.js';

@Injectable()
export class UsersGrpcClientService implements OnModuleInit {
  private usersGrpcService: UsersGrpcService;

  constructor(@Inject('USERS_GRPC_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.usersGrpcService = this.client.getService<UsersGrpcService>('UsersService');
  }

  async findOne(id: string): Promise<UserResponse> {
    try {
      return await firstValueFrom(this.usersGrpcService.findOne({ id }));
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code === status.NOT_FOUND) {
        throw new NotFoundException('User not found');
      }

      throw error;
    }
  }
}
