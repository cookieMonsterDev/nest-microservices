import { Injectable, NotFoundException } from '@nestjs/common';
import { createSearchQuery, createSortQuery } from '@libs/common/utils';
import { CreatePostDto } from '@posts-micros/modules/posts/dto/create-post.dto';
import { UpdatePostDto } from '@posts-micros/modules/posts/dto/update-post.dto';
import { Prisma, Post, PrismaService } from '@posts-micros/modules/prisma';
import { FindPostsQuery, POSTS_SEARCH_FIELDS } from '@posts-micros/modules/posts/dto/find-posts.query';

type SubQuery = Prisma.PostWhereInput;

type Query = FindPostsQuery & Prisma.PostFindManyArgs;

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createPost(data: CreatePostDto): Promise<Post> {
    return this.prismaService.post.create({ data });
  }

  async findPosts(query: Query, subQuery: SubQuery = {}): Promise<Post[]> {
    const { sortBy, sortOrder, search, skip, take } = query;

    const orderBy = createSortQuery(sortBy, sortOrder);

    const searchQuery = createSearchQuery(search, POSTS_SEARCH_FIELDS);

    const where = { AND: [searchQuery, subQuery] };

    return this.prismaService.post.findMany({ where, orderBy, skip, take });
  }

  async findPostsCount(query: Query, subQuery: SubQuery = {}): Promise<number> {
    const { search } = query;

    const searchQuery = createSearchQuery(search, POSTS_SEARCH_FIELDS);

    const where = { AND: [searchQuery, subQuery] };

    return this.prismaService.post.count({ where });
  }

  async findPost(postId: string): Promise<Post> {
    const post = await this.prismaService.post.findFirst({ where: { id: postId } });

    if (!post) throw new NotFoundException('Post not found');

    return post;
  }

  async updatePost(postId: string, data: UpdatePostDto): Promise<Post> {
    const post = await this.prismaService.post.findFirst({ where: { id: postId } });

    if (!post) throw new NotFoundException('Post not found');

    return this.prismaService.post.update({ where: { id: postId }, data });
  }
}
