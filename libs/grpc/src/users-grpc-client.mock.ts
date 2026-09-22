import { Global, Module } from '@nestjs/common';
import { UsersGrpcClientService } from '@libs/grpc/users-grpc-client.service.js';

export const UsersGrpcClientMockService = {
  findOne: vi.fn().mockImplementation((id: string) =>
    Promise.resolve({
      id,
      name: 'Mock User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
  ),
};

@Global()
@Module({
  providers: [
    {
      provide: UsersGrpcClientService,
      useValue: UsersGrpcClientMockService,
    },
  ],
  exports: [UsersGrpcClientService],
})
export class UsersGrpcClientMockModule {}
