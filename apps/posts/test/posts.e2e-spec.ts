import request from 'supertest';
import { Test, type TestingModule } from '@nestjs/testing';
import { FixtureModule } from '@posts-micros/test/fixture.module.js';
import { PrismaService } from '@posts-micros/modules/prisma/index.js';
import { UsersGrpcClientService } from '@libs/grpc/users-grpc-client.service.js';
import { NotFoundException, type INestApplication, ValidationPipe } from '@nestjs/common';

const mockUserId = '11111111-1111-4111-8111-111111111111';

describe('PostsController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let usersGrpcClientService: { findOne: ReturnType<typeof vi.fn> };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [FixtureModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    prismaService = moduleFixture.get(PrismaService);
    usersGrpcClientService = moduleFixture.get(UsersGrpcClientService);
  });

  beforeEach(async () => {
    await prismaService.post.deleteMany();
  });

  afterAll(async () => {
    await prismaService.post.deleteMany();
    await app.close();
  });

  describe('POST /posts', () => {
    it('should create a post successfully', async () => {
      const postData = {
        title: 'Test Post',
        userId: mockUserId,
      };

      const response = await request(app.getHttpServer()).post('/posts').send(postData).expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        title: postData.title,
        userId: postData.userId,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
      expect(usersGrpcClientService.findOne).toHaveBeenCalledWith(mockUserId);

      const post = await prismaService.post.findUnique({
        where: { id: response.body.id },
      });
      expect(post).toBeTruthy();
      expect(post?.title).toBe(postData.title);
    });

    it('should return 400 when title is missing', async () => {
      const postData = { userId: mockUserId };
      await request(app.getHttpServer()).post('/posts').send(postData).expect(400);
    });

    it('should return 400 when title is empty', async () => {
      const postData = {
        title: '',
        userId: mockUserId,
      };
      await request(app.getHttpServer()).post('/posts').send(postData).expect(400);
    });

    it('should return 404 when the referenced user does not exist', async () => {
      usersGrpcClientService.findOne.mockRejectedValueOnce(new NotFoundException('User not found'));

      const postData = { title: 'Test Post', userId: mockUserId };
      await request(app.getHttpServer()).post('/posts').send(postData).expect(404);
    });
  });

  describe('GET /posts', () => {
    beforeEach(async () => {
      // Create test posts
      await prismaService.post.createMany({
        data: [
          { title: 'First Post', userId: mockUserId },
          { title: 'Second Post', userId: mockUserId },
          { title: 'Third Post', userId: mockUserId },
          { title: 'Fourth Post', userId: mockUserId },
          { title: 'Fifth Post', userId: mockUserId },
        ],
      });
    });

    it('should return paginated posts', async () => {
      const response = await request(app.getHttpServer()).get('/posts').query({ skip: 0, take: 10 }).expect(200);

      expect(response.body).toMatchObject({
        skip: 0,
        take: 10,
        total: 5,
        data: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            title: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        ]),
      });
      expect(response.body.data).toHaveLength(5);
    });

    it('should search posts by title', async () => {
      const response = await request(app.getHttpServer()).get('/posts').query({ search: 'first' }).expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].title).toBe('First Post');
    });

    it('should sort posts by title', async () => {
      const response = await request(app.getHttpServer())
        .get('/posts')
        .query({ sortBy: 'title', sortOrder: 'asc' })
        .expect(200);

      const titles = response.body.data.map((post) => post.title);
      expect(titles).toEqual([...titles].sort());
    });

    it('should return 400 for invalid sort field', async () => {
      await request(app.getHttpServer()).get('/posts').query({ sortBy: 'invalid' }).expect(400);
    });
  });

  describe('GET /posts/:postId', () => {
    let testPost;

    beforeEach(async () => {
      testPost = await prismaService.post.create({
        data: { title: 'Test Post', userId: mockUserId },
      });
    });

    it('should return a post by id', async () => {
      const response = await request(app.getHttpServer()).get(`/posts/${testPost.id}`).expect(200);

      expect(response.body).toMatchObject({
        id: testPost.id,
        title: testPost.title,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should return 404 for non-existing post', async () => {
      await request(app.getHttpServer()).get('/posts/non-existing-id').expect(404);
    });
  });

  describe('PATCH /posts/:postId', () => {
    let testPost;

    beforeEach(async () => {
      testPost = await prismaService.post.create({
        data: { title: 'Test Post', userId: mockUserId },
      });
    });

    it('should update a post successfully', async () => {
      const updateData = { title: 'Updated Post Title', userId: mockUserId };

      const response = await request(app.getHttpServer()).patch(`/posts/${testPost.id}`).send(updateData).expect(200);

      expect(response.body).toMatchObject({
        id: testPost.id,
        title: updateData.title,
        userId: updateData.userId,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
      expect(usersGrpcClientService.findOne).toHaveBeenCalledWith(mockUserId);

      const updatedPost = await prismaService.post.findUnique({
        where: { id: testPost.id },
      });
      expect(updatedPost).toBeTruthy();
      expect(updatedPost?.title).toBe(updateData.title);
    });

    it('should return 404 for non-existing post', async () => {
      await request(app.getHttpServer())
        .patch('/posts/non-existing-id')
        .send({ title: 'New Title', userId: mockUserId })
        .expect(404);
    });

    it('should return 400 when update data is invalid', async () => {
      await request(app.getHttpServer())
        .patch(`/posts/${testPost.id}`)
        .send({ title: '', userId: mockUserId })
        .expect(400);
    });

    it('should return 404 when the referenced user does not exist', async () => {
      usersGrpcClientService.findOne.mockRejectedValueOnce(new NotFoundException('User not found'));

      await request(app.getHttpServer())
        .patch(`/posts/${testPost.id}`)
        .send({ title: 'Updated Post Title', userId: mockUserId })
        .expect(404);
    });
  });
});
