import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { GatewayService } from './gateway.service';

@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Get()
  getHello(): string {
    return this.gatewayService.getHello();
  }

  // Users routes
  @Get('users')
  async getUsers() {
    return await this.gatewayService.sendToUsersService('getAll', {});
  }

  @Get('users/:id')
  async getUser(@Param('id') id: string) {
    return await this.gatewayService.sendToUsersService('getById', { id });
  }

  @Post('users')
  async createUser(@Body() userData: any) {
    return await this.gatewayService.sendToUsersService('create', userData);
  }

  @Put('users/:id')
  async updateUser(@Param('id') id: string, @Body() userData: any) {
    return await this.gatewayService.sendToUsersService('update', {
      id,
      ...userData,
    });
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return await this.gatewayService.sendToUsersService('delete', { id });
  }

  // Posts routes
  @Get('posts')
  async getPosts() {
    return await this.gatewayService.sendToPostsService('getAll', {});
  }

  @Get('posts/:id')
  async getPost(@Param('id') id: string) {
    return await this.gatewayService.sendToPostsService('getById', { id });
  }

  @Post('posts')
  async createPost(@Body() postData: any) {
    return await this.gatewayService.sendToPostsService('create', postData);
  }

  @Put('posts/:id')
  async updatePost(@Param('id') id: string, @Body() postData: any) {
    return await this.gatewayService.sendToPostsService('update', {
      id,
      ...postData,
    });
  }

  @Delete('posts/:id')
  async deletePost(@Param('id') id: string) {
    return await this.gatewayService.sendToPostsService('delete', { id });
  }
}
