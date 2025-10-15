import { ApiResponse } from '@nestjs/swagger';
import { createPagination } from '@libs/common/utils';
import { PostsService } from '@posts-micros/posts/posts.service';
import { PostEntity } from '@posts-micros/posts/entities/post.entity';
import { CreatePostDto } from '@posts-micros/posts/dto/create-post.dto';
import { UpdatePostDto } from '@posts-micros/posts/dto/update-post.dto';
import { PostPaginationEntity } from './entities/post-pagination.entity';
import { FindPostsQuery } from '@posts-micros/posts/dto/find-posts.query';
import { Controller, Get, Post, Query, Param, Body, HttpCode, Patch } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersTopics, UserUpdatedEvent } from '@libs/kafka/messages/users.messages';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @MessagePattern(UsersTopics.USER_UPDATED)
  async handleUserUpdated(@Payload() message: UserUpdatedEvent) {
    // Handle user update event here
    console.log('User updated:', message);
    // You can update related posts or perform any necessary actions
  }

  @Post()
  @HttpCode(200)
  @ApiResponse({ status: 201, description: 'Post', type: PostEntity })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async createPost(@Body() body: CreatePostDto) {
    const post = await this.postsService.createPost(body);

    return new PostEntity(post);
  }

  @Get()
  @ApiResponse({ status: 201, description: 'Posts', type: PostPaginationEntity })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async findUsers(@Query() query: FindPostsQuery) {
    const posts = await this.postsService.findPosts(query);

    const postsCount = await this.postsService.findPostsCount(query);

    const pagination = createPagination(postsCount, query.skip, query.take);

    return new PostPaginationEntity({ ...pagination, data: posts });
  }

  @Get(':postId')
  @ApiResponse({ status: 201, description: 'Post', type: PostEntity })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async findUser(@Param('postId') postId: string) {
    const post = await this.postsService.findPost(postId);

    return new PostEntity(post);
  }

  @Patch(':postId')
  @ApiResponse({ status: 201, description: 'Post', type: PostEntity })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async updateUser(@Param('postId') postId: string, @Body() body: UpdatePostDto) {
    const post = await this.postsService.updatePost(postId, body);

    return new PostEntity(post);
  }
}
