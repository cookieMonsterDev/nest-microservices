import { KafkaService } from '@libs/kafka/kafka.service';
import { Prisma, User } from '@users-micros/generated/prisma';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersTopics } from '@libs/kafka/messages/users.messages';
import { createSearchQuery, createSortQuery } from '@libs/common/utils';
import { CreateUserDto } from '@users-micros/users/dto/create-user.dto';
import { UpdateUserDto } from '@users-micros/users/dto/update-user.dto';
import { DatabaseService } from '@users-micros/database/database.service';
import { FindUsersQuery, USERS_SEARCH_FIELDS } from '@users-micros/users/dto/find-users.query';

type SubQuery = Prisma.UserWhereInput;

type Query = FindUsersQuery & Prisma.UserFindManyArgs;

@Injectable()
export class UsersService {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly databaseService: DatabaseService,
  ) {}

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

  async updateUser(userId: string, data: UpdateUserDto): Promise<User> {
    const user = await this.databaseService.user.findFirst({ where: { id: userId } });

    if (!user) throw new NotFoundException('User not found');

    const updatedUser = await this.databaseService.user.update({ where: { id: userId }, data });

    this.kafkaService.emit(UsersTopics.USER_UPDATED, {
      name: updatedUser.name,
    });

    return updatedUser;
  }
}
