import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { FixtureModule } from '@posts-micros/test/fixture.module';
import { DatabaseService } from '@posts-micros/database/database.service';

describe('PostsController (e2e)', () => {
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
    await databaseService.post.deleteMany();
  });

  afterAll(async () => {
    await databaseService.post.deleteMany();
    await app.close();
  });

  describe('POST /posts', () => {
    it('should create a post successfully', async () => {
      const postData = {
        title: 'Test Post',
      };

      const response = await request(app.getHttpServer()).post('/posts').send(postData).expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        title: postData.title,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });

      const post = await databaseService.post.findUnique({
        where: { id: response.body.id },
      });
      expect(post).toBeTruthy();
      expect(post?.title).toBe(postData.title);
    });

    it('should return 400 when title is missing', async () => {
      const postData = {};
      await request(app.getHttpServer()).post('/posts').send(postData).expect(400);
    });

    it('should return 400 when title is empty', async () => {
      const postData = {
        title: '',
      };
      await request(app.getHttpServer()).post('/posts').send(postData).expect(400);
    });
  });

  describe('GET /posts', () => {
    beforeEach(async () => {
      // Create test posts
      await databaseService.post.createMany({
        data: [
          { title: 'First Post' },
          { title: 'Second Post' },
          { title: 'Third Post' },
          { title: 'Fourth Post' },
          { title: 'Fifth Post' },
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
      testPost = await databaseService.post.create({
        data: { title: 'Test Post' },
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
      testPost = await databaseService.post.create({
        data: { title: 'Test Post' },
      });
    });

    it('should update a post successfully', async () => {
      const updateData = { title: 'Updated Post Title' };

      const response = await request(app.getHttpServer()).patch(`/posts/${testPost.id}`).send(updateData).expect(200);

      expect(response.body).toMatchObject({
        id: testPost.id,
        title: updateData.title,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });

      const updatedPost = await databaseService.post.findUnique({
        where: { id: testPost.id },
      });
      expect(updatedPost).toBeTruthy();
      expect(updatedPost?.title).toBe(updateData.title);
    });

    it('should return 404 for non-existing post', async () => {
      await request(app.getHttpServer()).patch('/posts/non-existing-id').send({ title: 'New Title' }).expect(404);
    });

    it('should return 400 when update data is invalid', async () => {
      await request(app.getHttpServer()).patch(`/posts/${testPost.id}`).send({ title: '' }).expect(400);
    });
  });
});
