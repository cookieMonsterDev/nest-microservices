import { Prisma, Post } from '@posts-micros/generated/prisma';
import { Injectable, NotFoundException } from '@nestjs/common';
import { createSearchQuery, createSortQuery } from '@libs/common/utils';
import { CreatePostDto } from '@posts-micros/posts/dto/create-post.dto';
import { UpdatePostDto } from '@posts-micros/posts/dto/update-post.dto';
import { DatabaseService } from '@users-micros/database/database.service';
import { FindPostsQuery, POSTS_SEARCH_FIELDS } from '@posts-micros/posts/dto/find-posts.query';

type SubQuery = Prisma.PostWhereInput;

type Query = FindPostsQuery & Prisma.PostFindManyArgs;

@Injectable()
export class PostsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createPost(data: CreatePostDto): Promise<Post> {
    return this.databaseService.post.create({ data });
  }

  async findPosts(query: Query, subQuery: SubQuery = {}): Promise<Post[]> {
    const { sortBy, sortOrder, search, ...rest } = query;

    const orderBy = createSortQuery(sortBy, sortOrder);

    const searchQuery = createSearchQuery(search, POSTS_SEARCH_FIELDS);

    const where = { AND: [searchQuery, subQuery] };

    return this.databaseService.post.findMany({ where, orderBy, ...rest });
  }

  async findPostsCount(query: Query, subQuery: SubQuery = {}): Promise<number> {
    const { search } = query;

    const searchQuery = createSearchQuery(search, POSTS_SEARCH_FIELDS);

    const where = { AND: [searchQuery, subQuery] };

    return this.databaseService.post.count({ where });
  }

  async findPost(postId: string): Promise<Post> {
    const post = await this.databaseService.post.findFirst({ where: { id: postId } });

    if (!post) throw new NotFoundException('Post not found');

    return post;
  }

  async updatePost(postId: string, data: UpdatePostDto): Promise<Post> {
    const post = await this.databaseService.post.findFirst({ where: { id: postId } });

    if (!post) throw new NotFoundException('Post not found');

    return this.databaseService.post.update({ where: { id: postId }, data });
  }
}
