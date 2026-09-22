import { Controller, NotFoundException } from '@nestjs/common';
import { GrpcMethod, GrpcNotFoundException } from '@nestjs/microservices';
import { UsersService } from '@users-micros/modules/users/users.service.js';
import { type FindOneUserRequest, type UserResponse } from '@libs/grpc/users-grpc.interface.js';

@Controller()
export class UsersGrpcController {
  constructor(private readonly usersService: UsersService) {}

  @GrpcMethod('UsersService', 'FindOne')
  async findOne(data: FindOneUserRequest): Promise<UserResponse> {
    try {
      const user = await this.usersService.findUser(data.id);

      return {
        id: user.id,
        name: user.name,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GrpcNotFoundException(error.message);
      }

      throw error;
    }
  }
}
