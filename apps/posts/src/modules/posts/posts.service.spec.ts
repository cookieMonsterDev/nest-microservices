import type { Mocked } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { PostsService } from '@posts-micros/modules/posts/posts.service.js';
import { createSearchQuery, createSortQuery } from '@libs/common/utils.js';
import { type Post, type PrismaService } from '@posts-micros/modules/prisma/index.js';

vi.mock('@libs/common/utils.js', () => ({ createSearchQuery: vi.fn(), createSortQuery: vi.fn() }));

export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'First Post',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Second Post',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockPost = mockPosts[0];

describe('PostsService', () => {
  let postsService: PostsService;
  let prismaService: Mocked<PrismaService>;

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

    postsService = new PostsService(prismaService);

    vi.mocked(createSearchQuery).mockClear();
    vi.mocked(createSortQuery).mockClear();
  });

  describe('createPost', () => {
    it('should create a post', async () => {
      const data = { title: 'New Post', content: 'Some content' };
      const result = await postsService.createPost(data);
      expect(prismaService.post.create).toHaveBeenCalledWith({ data });
      expect(result).toBe(mockPost);
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
    it('should update post', async () => {
      const data = { title: 'Updated Title' };
      const result = await postsService.updatePost(mockPost.id, data);
      expect(prismaService.post.update).toHaveBeenCalledWith({ where: { id: mockPost.id }, data });
      expect(result.title).toBe('Updated Title');
    });

    it('should throw NotFoundException if post does not exist', async () => {
      await expect(postsService.updatePost('no-id', { title: 'test' } as any)).rejects.toThrow(NotFoundException);
    });
  });
});
