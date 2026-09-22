import { status } from '@grpc/grpc-js';
import { of, throwError } from 'rxjs';
import { NotFoundException } from '@nestjs/common';
import { type ClientGrpc } from '@nestjs/microservices';
import { UsersGrpcClientService } from '@libs/grpc/users-grpc-client.service.js';

describe('UsersGrpcClientService', () => {
  let usersGrpcClientService: UsersGrpcClientService;
  let findOne: ReturnType<typeof vi.fn>;

  const mockUserResponse = {
    id: 'user-1',
    name: 'John Doe',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  };

  beforeEach(() => {
    findOne = vi.fn();

    const client = {
      getService: vi.fn().mockReturnValue({ findOne }),
    } as unknown as ClientGrpc;

    usersGrpcClientService = new UsersGrpcClientService(client);
    usersGrpcClientService.onModuleInit();
  });

  describe('findOne', () => {
    it('should return the user when the gRPC call resolves', async () => {
      findOne.mockReturnValue(of(mockUserResponse));

      const result = await usersGrpcClientService.findOne('user-1');

      expect(findOne).toHaveBeenCalledWith({ id: 'user-1' });
      expect(result).toEqual(mockUserResponse);
    });

    it('should throw NotFoundException when the gRPC call fails with NOT_FOUND', async () => {
      findOne.mockReturnValue(throwError(() => ({ code: status.NOT_FOUND, details: 'User not found' })));

      await expect(usersGrpcClientService.findOne('missing-user')).rejects.toThrow(NotFoundException);
    });

    it('should rethrow unrelated gRPC errors as-is', async () => {
      const unexpectedError = { code: status.UNAVAILABLE, details: 'connection lost' };
      findOne.mockReturnValue(throwError(() => unexpectedError));

      await expect(usersGrpcClientService.findOne('user-1')).rejects.toEqual(unexpectedError);
    });
  });
});
