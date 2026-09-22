import type { Mocked } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { PostsService } from '@posts-micros/modules/posts/posts.service.js';
import { createSearchQuery, createSortQuery } from '@libs/common/utils.js';
import { type Post, type PrismaService } from '@posts-micros/modules/prisma/index.js';
import { type UsersGrpcClientService } from '@libs/grpc/users-grpc-client.service.js';

vi.mock('@libs/common/utils.js', () => ({ createSearchQuery: vi.fn(), createSortQuery: vi.fn() }));

export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'First Post',
    userId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Second Post',
    userId: 'user-2',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockPost = mockPosts[0];

describe('PostsService', () => {
  let postsService: PostsService;
  let prismaService: Mocked<PrismaService>;
  let usersGrpcClientService: Mocked<UsersGrpcClientService>;

  beforeEach(() => {
    prismaService = {
      post: {
        create: vi.fn().mockResolvedValue(mockPost),
        findFirst: vi.fn((args) => (args.where.id === mockPost.id ? Promise.resolve(mockPost) : Promise.resolve(null))),
        findMany: vi.fn().mockResolvedValue(mockPosts),
        count: vi.fn().mockResolvedValue(mockPosts.length),
        update: vi.fn((args) =>
          args.where.id === mockPost.id ? Promise.resolve({ ...mockPost, ...args.data }) : Promise.resolve(null),
        ),
      },
    } as any;

    usersGrpcClientService = {
      findOne: vi.fn().mockResolvedValue({
        id: mockPost.userId,
        name: 'Some User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    } as any;

    postsService = new PostsService(prismaService, usersGrpcClientService);

    vi.mocked(createSearchQuery).mockClear();
    vi.mocked(createSortQuery).mockClear();
  });

  describe('createPost', () => {
    it('should validate the user via gRPC and create a post', async () => {
      const data = { title: 'New Post', userId: mockPost.userId };
      const result = await postsService.createPost(data);
      expect(usersGrpcClientService.findOne).toHaveBeenCalledWith(mockPost.userId);
      expect(prismaService.post.create).toHaveBeenCalledWith({ data });
      expect(result).toBe(mockPost);
    });

    it('should propagate NotFoundException when the user does not exist', async () => {
      usersGrpcClientService.findOne.mockRejectedValueOnce(new NotFoundException('User not found'));

      const data = { title: 'New Post', userId: 'no-user' };

      await expect(postsService.createPost(data)).rejects.toThrow(NotFoundException);
      expect(prismaService.post.create).not.toHaveBeenCalled();
    });
  });

  describe('findPosts', () => {
    it('should return posts with filters', async () => {
      const query = { skip: 0, take: 10, search: 'First', sortBy: 'title', sortOrder: 'asc' } as any;
      const result = await postsService.findPosts(query);
      expect(createSearchQuery).toHaveBeenCalledWith(query.search, expect.anything());
      expect(createSortQuery).toHaveBeenCalledWith(query.sortBy, query.sortOrder);
      expect(prismaService.post.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockPosts);
    });
  });

  describe('findPostsCount', () => {
    it('should return count of posts', async () => {
      const query = { search: 'First' } as any;
      const result = await postsService.findPostsCount(query);
      expect(createSearchQuery).toHaveBeenCalledWith(query.search, expect.anything());
      expect(prismaService.post.count).toHaveBeenCalled();
      expect(result).toBe(mockPosts.length);
    });
  });

  describe('findPost', () => {
    it('should return post if found', async () => {
      const result = await postsService.findPost(mockPost.id);
      expect(prismaService.post.findFirst).toHaveBeenCalledWith({ where: { id: mockPost.id } });
      expect(result).toBe(mockPost);
    });

    it('should throw NotFoundException if post not found', async () => {
      await expect(postsService.findPost('no-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updatePost', () => {
    it('should validate the user via gRPC and update post', async () => {
      const data = { title: 'Updated Title', userId: mockPost.userId };
      const result = await postsService.updatePost(mockPost.id, data);
      expect(usersGrpcClientService.findOne).toHaveBeenCalledWith(mockPost.userId);
      expect(prismaService.post.update).toHaveBeenCalledWith({ where: { id: mockPost.id }, data });
      expect(result.title).toBe('Updated Title');
    });

    it('should propagate NotFoundException when the user does not exist', async () => {
      usersGrpcClientService.findOne.mockRejectedValueOnce(new NotFoundException('User not found'));

      const data = { title: 'Updated Title', userId: 'no-user' };

      await expect(postsService.updatePost(mockPost.id, data)).rejects.toThrow(NotFoundException);
      expect(prismaService.post.update).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if post does not exist', async () => {
      await expect(postsService.updatePost('no-id', { title: 'test', userId: mockPost.userId } as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
