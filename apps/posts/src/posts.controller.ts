import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  HttpException, 
  HttpStatus 
} from '@nestjs/common';
import { PostsService } from '@/posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getAllPosts() {
    try {
      return await this.postsService.getAllPosts();
    } catch (error) {
      throw new HttpException('Failed to fetch posts', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('user/:userId')
  async getPostsByUserId(@Param('userId') userId: string) {
    try {
      return await this.postsService.getPostsByUserId(userId);
    } catch (error) {
      throw new HttpException('Failed to fetch posts for user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async getPostById(@Param('id') id: string) {
    try {
      const post = await this.postsService.getPostById(id);
      if (!post) {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
      }
      return post;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to fetch post', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async createPost(@Body() postData: { title: string; content: string; userId: string }) {
    try {
      if (!postData.title || !postData.content || !postData.userId) {
        throw new HttpException('Title, content, and userId are required', HttpStatus.BAD_REQUEST);
      }
      return await this.postsService.createPost(postData);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to create post', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  async updatePost(@Param('id') id: string, @Body() postData: { title?: string; content?: string }) {
    try {
      const post = await this.postsService.updatePost(id, postData);
      if (!post) {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
      }
      return post;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to update post', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    try {
      const result = await this.postsService.deletePost(id);
      if (!result) {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'Post deleted successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to delete post', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  getHello(): string {
    return this.postsService.getHello();
  }
}
