import { ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { createPagination } from '@libs/common/utils';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUsersQuery } from './dto/find-users.query';
import { UserPaginationEntity } from './entities/user-pagination.entity';
import { Controller, Get, Post, Query, Param, Body, HttpCode } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(200)
  @ApiResponse({ status: 201, description: 'Users', type: UserEntity })
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

    const usersCount = await this.usersService.findUsersCount(query);

    const pagination = createPagination(usersCount, query.skip, query.take);

    return new UserPaginationEntity({ ...pagination, data: users });
  }

  @Get(':userId')
  @ApiResponse({ status: 201, description: 'Users', type: UserEntity })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async findUser(@Param('userId') userId: string) {
    const user = await this.usersService.findUser(userId);

    return new UserEntity(user);
  }
}
