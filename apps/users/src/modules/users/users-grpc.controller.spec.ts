import type { Mocked } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { GrpcNotFoundException } from '@nestjs/microservices';
import { type UsersService } from '@users-micros/modules/users/users.service.js';
import { UsersGrpcController } from '@users-micros/modules/users/users-grpc.controller.js';

describe('UsersGrpcController', () => {
  let usersGrpcController: UsersGrpcController;
  let usersService: Mocked<UsersService>;

  const mockUser = {
    id: '1',
    name: 'John Doe',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-02T00:00:00.000Z'),
  };

  beforeEach(() => {
    usersService = {
      findUser: vi.fn().mockResolvedValue(mockUser),
    } as any;

    usersGrpcController = new UsersGrpcController(usersService);
  });

  describe('findOne', () => {
    it('should return the user mapped to the gRPC response shape', async () => {
      const result = await usersGrpcController.findOne({ id: mockUser.id });

      expect(usersService.findUser).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        createdAt: mockUser.createdAt.toISOString(),
        updatedAt: mockUser.updatedAt.toISOString(),
      });
    });

    it('should translate NotFoundException into GrpcNotFoundException', async () => {
      usersService.findUser.mockRejectedValueOnce(new NotFoundException('User not found'));

      await expect(usersGrpcController.findOne({ id: 'no-id' })).rejects.toThrow(GrpcNotFoundException);
    });

    it('should rethrow unrelated errors as-is', async () => {
      const unexpectedError = new Error('boom');
      usersService.findUser.mockRejectedValueOnce(unexpectedError);

      await expect(usersGrpcController.findOne({ id: mockUser.id })).rejects.toThrow(unexpectedError);
    });
  });
});
