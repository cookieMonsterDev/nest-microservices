import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FixtureModule } from '@users-micros/test/fixture.module';
import { DatabaseService } from '@users-micros/database/database.service';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [FixtureModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    databaseService = moduleFixture.get(DatabaseService);

    await app.init();
  });

  it('/ (GET)', async () => {
    console.log(await databaseService.user.create({ data: { name: 'Test User' } }));

    return request(app.getHttpServer()).get('/').expect(200).expect('Hello World!');
  });
});
