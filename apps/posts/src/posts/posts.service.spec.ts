import * as utils from '@libs/common/utils';
import { NotFoundException } from '@nestjs/common';
import { Post } from '@posts-micros/generated/prisma';
import { PostsService } from '@posts-micros/posts/posts.service';
import { DatabaseService } from '@posts-micros/database/database.service';

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
  let databaseService: jest.Mocked<DatabaseService>;

  beforeEach(() => {
    databaseService = {
      post: {
        create: jest.fn().mockResolvedValue(mockPost),
        findFirst: jest.fn((args) =>
          args.where.id === mockPost.id ? Promise.resolve(mockPost) : Promise.resolve(null),
        ),
        findMany: jest.fn().mockResolvedValue(mockPosts),
        count: jest.fn().mockResolvedValue(mockPosts.length),
        update: jest.fn((args) =>
          args.where.id === mockPost.id ? Promise.resolve({ ...mockPost, ...args.data }) : Promise.resolve(null),
        ),
      },
    } as any;

    postsService = new PostsService(databaseService);

    jest.spyOn(utils, 'createSearchQuery');
    jest.spyOn(utils, 'createSortQuery');
  });

  describe('createPost', () => {
    it('should create a post', async () => {
      const data = { title: 'New Post', content: 'Some content' };
      const result = await postsService.createPost(data as any);
      expect(databaseService.post.create).toHaveBeenCalledWith({ data });
      expect(result).toBe(mockPost);
    });
  });

  describe('findPosts', () => {
    it('should return posts with filters', async () => {
      const query = { skip: 0, take: 10, search: 'First', sortBy: 'title', sortOrder: 'asc' } as any;
      const result = await postsService.findPosts(query);
      expect(utils.createSearchQuery).toHaveBeenCalledWith(query.search, expect.anything());
      expect(utils.createSortQuery).toHaveBeenCalledWith(query.sortBy, query.sortOrder);
      expect(databaseService.post.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockPosts);
    });
  });

  describe('findPostsCount', () => {
    it('should return count of posts', async () => {
      const query = { search: 'First' } as any;
      const result = await postsService.findPostsCount(query);
      expect(utils.createSearchQuery).toHaveBeenCalledWith(query.search, expect.anything());
      expect(databaseService.post.count).toHaveBeenCalled();
      expect(result).toBe(mockPosts.length);
    });
  });

  describe('findPost', () => {
    it('should return post if found', async () => {
      const result = await postsService.findPost(mockPost.id);
      expect(databaseService.post.findFirst).toHaveBeenCalledWith({ where: { id: mockPost.id } });
      expect(result).toBe(mockPost);
    });

    it('should throw NotFoundException if post not found', async () => {
      await expect(postsService.findPost('no-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updatePost', () => {
    it('should update post', async () => {
      const data = { title: 'Updated Title' };
      const result = await postsService.updatePost(mockPost.id, data as any);
      expect(databaseService.post.update).toHaveBeenCalledWith({ where: { id: mockPost.id }, data });
      expect(result.title).toBe('Updated Title');
    });

    it('should throw NotFoundException if post does not exist', async () => {
      await expect(postsService.updatePost('no-id', { title: 'test' } as any)).rejects.toThrow(NotFoundException);
    });
  });
});
