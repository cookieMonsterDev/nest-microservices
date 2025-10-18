import * as utils from '@libs/common/utils';
import { KafkaMock } from '@libs/kafka/kafka.mock';
import { NotFoundException } from '@nestjs/common';
import { User } from '@users-micros/generated/prisma';
import { UsersService } from '@users-micros/users/users.service';
import { UsersTopics } from '@libs/kafka/messages/users.messages';
import { DatabaseService } from '@users-micros/database/database.service';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockUser = mockUsers[0];

describe('UsersService', () => {
  let usersService: UsersService;
  let databaseService: jest.Mocked<DatabaseService>;
  let kafkaService: typeof KafkaMock;

  beforeEach(() => {
    databaseService = {
      user: {
        create: jest.fn().mockResolvedValue(mockUser),
        findFirst: jest.fn((args) =>
          args.where.id === mockUser.id ? Promise.resolve(mockUser) : Promise.resolve(null),
        ),
        findMany: jest.fn().mockResolvedValue(mockUsers),
        count: jest.fn().mockResolvedValue(mockUsers.length),
        update: jest.fn((args) =>
          args.where.id === mockUser.id ? Promise.resolve({ ...mockUser, ...args.data }) : Promise.resolve(null),
        ),
      },
    } as any;

    kafkaService = { ...KafkaMock };

    usersService = new UsersService(kafkaService as any, databaseService);

    jest.spyOn(utils, 'createSearchQuery');
    jest.spyOn(utils, 'createSortQuery');
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const data = { name: 'John Doe', email: 'john@example.com' };
      const result = await usersService.createUser(data as any);
      expect(databaseService.user.create).toHaveBeenCalledWith({ data });
      expect(result).toBe(mockUser);
    });
  });

  describe('findUsers', () => {
    it('should return users with filters', async () => {
      const query = { skip: 0, take: 10, search: 'John', sortBy: 'name', sortOrder: 'asc' } as any;
      const result = await usersService.findUsers(query);
      expect(utils.createSearchQuery).toHaveBeenCalledWith(query.search, expect.anything());
      expect(utils.createSortQuery).toHaveBeenCalledWith(query.sortBy, query.sortOrder);
      expect(databaseService.user.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findUsersCount', () => {
    it('should return count of users', async () => {
      const query = { search: 'John' } as any;
      const result = await usersService.findUsersCount(query);
      expect(utils.createSearchQuery).toHaveBeenCalledWith(query.search, expect.anything());
      expect(databaseService.user.count).toHaveBeenCalled();
      expect(result).toBe(mockUsers.length);
    });
  });

  describe('findUser', () => {
    it('should return user if found', async () => {
      const result = await usersService.findUser(mockUser.id);
      expect(databaseService.user.findFirst).toHaveBeenCalledWith({ where: { id: mockUser.id } });
      expect(result).toBe(mockUser);
    });

    it('should throw NotFoundException if not found', async () => {
      await expect(usersService.findUser('no-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateUser', () => {
    it('should update user and emit kafka event', async () => {
      const data = { name: 'Updated Name' };
      const result = await usersService.updateUser(mockUser.id, data);
      expect(databaseService.user.update).toHaveBeenCalledWith({ where: { id: mockUser.id }, data });
      expect(kafkaService.emit).toHaveBeenCalledWith(UsersTopics.USER_UPDATED, { name: 'Updated Name' });
      expect(result.name).toBe('Updated Name');
    });

    it('should throw NotFoundException if user does not exist', async () => {
      await expect(usersService.updateUser('no-id', { name: 'test' })).rejects.toThrow(NotFoundException);
    });
  });
});
