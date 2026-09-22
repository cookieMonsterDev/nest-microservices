import { join } from 'node:path';
import { type ConfigService } from '@nestjs/config';
import { type MicroserviceOptions, Transport } from '@nestjs/microservices';

export const createUsersGrpcServerOptions = (configService: ConfigService): MicroserviceOptions => ({
  transport: Transport.GRPC,
  options: {
    package: 'users',
    protoPath: join(import.meta.dirname, 'proto/users.proto'),
    url: configService.get<string>('USERS_GRPC_URL') ?? 'localhost:3023',
  },
});
