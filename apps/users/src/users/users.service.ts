import { Prisma, User } from '@apps/users/generated/prisma';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '@apps/users/users/dto/create-user.dto';
import { createSearchQuery, createSortQuery } from '@libs/common/utils';
import { FindUsersQuery, USERS_SEARCH_FIELDS } from '@apps/users/users/dto/find-users.query';

type SubQuery = Prisma.UserWhereInput;

type Query = FindUsersQuery & Prisma.UserFindManyArgs;

@Injectable()
export class UsersService {
  constructor(private readonly databaseService) {}

  async createUser(data: CreateUserDto): Promise<User> {
    return this.databaseService.user.create({ data });
  }

  async findUsers(query: Query, subQuery: SubQuery = {}): Promise<User[]> {
    const { sortBy, sortOrder, search, ...rest } = query;

    const orderBy = createSortQuery(sortBy, sortOrder);

    const searchQuery = createSearchQuery(search, USERS_SEARCH_FIELDS);

    const where = { AND: [searchQuery, subQuery] };

    return this.databaseService.user.findMany({ where, orderBy, ...rest });
  }

  async findUsersCount(query: Query, subQuery: SubQuery = {}): Promise<number> {
    const { search } = query;

    const searchQuery = createSearchQuery(search, USERS_SEARCH_FIELDS);

    const where = { AND: [searchQuery, subQuery] };

    return this.databaseService.user.count({ where });
  }

  async findUser(userId: string): Promise<User> {
    const user = await this.databaseService.user.findFirst({ where: { id: userId } });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }
}
