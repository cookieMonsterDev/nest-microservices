import { join } from 'node:path';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersGrpcClientService } from '@libs/grpc/users-grpc-client.service.js';

@Global()
@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'USERS_GRPC_PACKAGE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'users',
            protoPath: join(import.meta.dirname, 'proto/users.proto'),
            url: configService.get<string>('USERS_GRPC_URL') ?? 'localhost:3023',
          },
        }),
      },
    ]),
  ],
  providers: [UsersGrpcClientService],
  exports: [UsersGrpcClientService],
})
export class UsersGrpcClientModule {}
