import { ApiResponse } from '@nestjs/swagger';
import { UsersService } from '@users-micros/users/users.service';
import { UserEntity } from '@users-micros/users/entities/user.entity';
import { CreateUserDto } from '@users-micros/users/dto/create-user.dto';
import { UpdateUserDto } from '@users-micros/users/dto/update-user.dto';
import { UserPaginationEntity } from './entities/user-pagination.entity';
import { FindUsersQuery } from '@users-micros/users/dto/find-users.query';
import { Controller, Get, Post, Query, Param, Body, HttpCode, Patch } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(200)
  @ApiResponse({ status: 201, description: 'User', type: UserEntity })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.usersService.createUser(body);

    return new UserEntity(user);
  }

  @Get()
  @ApiResponse({ status: 201, description: 'Users', type: UserPaginationEntity })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async findUsers(@Query() query: FindUsersQuery) {
    const users = await this.usersService.findUsers(query);

    const total = await this.usersService.findUsersCount(query);

    const { skip, take } = query;

    return new UserPaginationEntity({ skip, take, total, data: users });
  }

  @Get(':userId')
  @ApiResponse({ status: 201, description: 'User', type: UserEntity })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async findUser(@Param('userId') userId: string) {
    const user = await this.usersService.findUser(userId);

    return new UserEntity(user);
  }

  @Patch(':userId')
  @ApiResponse({ status: 201, description: 'User', type: UserEntity })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async updateUser(@Param('userId') userId: string, @Body() body: UpdateUserDto) {
    const user = await this.usersService.updateUser(userId, body);

    return new UserEntity(user);
  }
}
