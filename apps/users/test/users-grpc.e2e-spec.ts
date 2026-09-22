import { status } from '@grpc/grpc-js';
import { firstValueFrom } from 'rxjs';
import { Test, type TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { GrpcExceptionFilter, ClientProxyFactory, type ClientGrpc, type GrpcOptions } from '@nestjs/microservices';
import { FixtureModule } from '@users-micros/test/fixture.module.js';
import { PrismaService } from '@users-micros/modules/prisma/index.js';
import { createUsersGrpcServerOptions } from '@libs/grpc/users-grpc.config.js';
import { type UsersGrpcService } from '@libs/grpc/users-grpc.interface.js';
import { type INestApplication } from '@nestjs/common';

describe('UsersGrpcController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let usersGrpcService: UsersGrpcService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [FixtureModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalFilters(new GrpcExceptionFilter());

    const configService = app.get(ConfigService);

    app.connectMicroservice(createUsersGrpcServerOptions(configService), { inheritAppConfig: true });

    await app.startAllMicroservices();
    await app.init();

    prismaService = moduleFixture.get(PrismaService);

    const grpcClientOptions = createUsersGrpcServerOptions(configService) as GrpcOptions;
    const client = ClientProxyFactory.create(grpcClientOptions) as unknown as ClientGrpc;
    usersGrpcService = client.getService<UsersGrpcService>('UsersService');
  });

  beforeEach(async () => {
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await prismaService.user.deleteMany();
    await app.close();
  });

  describe('FindOne', () => {
    it('should return the user over a real gRPC round trip', async () => {
      const user = await prismaService.user.create({ data: { name: 'Grpc User' } });

      const response = await firstValueFrom(usersGrpcService.findOne({ id: user.id }));

      expect(response).toMatchObject({
        id: user.id,
        name: user.name,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      });
    });

    it('should reject with a NOT_FOUND gRPC status for a missing user', async () => {
      await expect(firstValueFrom(usersGrpcService.findOne({ id: 'non-existing-id' }))).rejects.toMatchObject({
        code: status.NOT_FOUND,
      });
    });
  });
});
