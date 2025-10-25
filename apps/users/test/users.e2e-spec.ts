import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { FixtureModule } from '@users-micros/test/fixture.module';
import { DatabaseService } from '@users-micros/database/database.service';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let databaseService: DatabaseService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [FixtureModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    databaseService = moduleFixture.get(DatabaseService);
  });

  beforeEach(async () => {
    await databaseService.user.deleteMany();
  });

  afterAll(async () => {
    await databaseService.user.deleteMany();
    await app.close();
  });

  describe('POST /users', () => {
    it('should create a user successfully', async () => {
      const userData = { name: 'John Doe' };

      const response = await request(app.getHttpServer()).post('/users').send(userData).expect(200);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        name: userData.name,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });

      const user = await databaseService.user.findUnique({
        where: { id: response.body.id },
      });
      expect(user).toBeTruthy();
      expect(user?.name).toBe(userData.name);
    });

    it('should return 400 when name is missing', async () => {
      await request(app.getHttpServer()).post('/users').send({}).expect(400);
    });

    it('should return 400 when name is empty', async () => {
      await request(app.getHttpServer()).post('/users').send({ name: '' }).expect(400);
    });

    it('should return 400 when name is too long', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({ name: 'a'.repeat(65) })
        .expect(400);
    });
  });

  describe('GET /users', () => {
    beforeEach(async () => {
      // Create test users
      await databaseService.user.createMany({
        data: [
          { name: 'Alice Smith' },
          { name: 'Bob Johnson' },
          { name: 'Carol Davis' },
          { name: 'David Wilson' },
          { name: 'Eve Brown' },
        ],
      });
    });

    it('should return paginated users', async () => {
      const response = await request(app.getHttpServer()).get('/users').query({ skip: 0, take: 10 }).expect(200);

      expect(response.body).toMatchObject({
        skip: 0,
        take: 10,
        total: 5,
        data: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        ]),
      });
      expect(response.body.data).toHaveLength(5);
    });

    it('should search users by name', async () => {
      const response = await request(app.getHttpServer()).get('/users').query({ search: 'alice' }).expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('Alice Smith');
    });

    it('should sort users by name', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .query({ sortBy: 'name', sortOrder: 'asc' })
        .expect(200);

      const names = response.body.data.map((user) => user.name);
      expect(names).toEqual([...names].sort());
    });

    it('should return 400 for invalid sort field', async () => {
      await request(app.getHttpServer()).get('/users').query({ sortBy: 'invalid' }).expect(400);
    });
  });

  describe('GET /users/:userId', () => {
    let testUser;

    beforeEach(async () => {
      testUser = await databaseService.user.create({
        data: { name: 'Test User' },
      });
    });

    it('should return a user by id', async () => {
      const response = await request(app.getHttpServer()).get(`/users/${testUser.id}`).expect(200);

      expect(response.body).toMatchObject({
        id: testUser.id,
        name: testUser.name,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should return 404 for non-existing user', async () => {
      await request(app.getHttpServer()).get('/users/non-existing-id').expect(404);
    });
  });

  describe('PATCH /users/:userId', () => {
    let testUser;

    beforeEach(async () => {
      testUser = await databaseService.user.create({
        data: { name: 'Test User' },
      });
    });

    it('should update a user successfully', async () => {
      const updateData = { name: 'Updated Name' };

      const response = await request(app.getHttpServer()).patch(`/users/${testUser.id}`).send(updateData).expect(200);

      expect(response.body).toMatchObject({
        id: testUser.id,
        name: updateData.name,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });

      const updatedUser = await databaseService.user.findUnique({
        where: { id: testUser.id },
      });
      expect(updatedUser).toBeTruthy();
      expect(updatedUser?.name).toBe(updateData.name);
    });

    it('should return 404 for non-existing user', async () => {
      await request(app.getHttpServer()).patch('/users/non-existing-id').send({ name: 'New Name' }).expect(404);
    });

    it('should return 400 when update data is invalid', async () => {
      await request(app.getHttpServer()).patch(`/users/${testUser.id}`).send({ name: '' }).expect(400);

      await request(app.getHttpServer())
        .patch(`/users/${testUser.id}`)
        .send({ name: 'a'.repeat(65) })
        .expect(400);
    });
  });
});
