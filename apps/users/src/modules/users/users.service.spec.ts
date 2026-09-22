import type { Mocked } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { KafkaMockService } from '@libs/kafka/kafka.mock.js';
import { UsersTopics } from '@libs/kafka/messages/users.messages.js';
import { UsersService } from '@users-micros/modules/users/users.service.js';
import { createSearchQuery, createSortQuery } from '@libs/common/utils.js';
import { type User, type PrismaService } from '@users-micros/modules/prisma/index.js';

vi.mock('@libs/common/utils.js', () => ({ createSearchQuery: vi.fn(), createSortQuery: vi.fn() }));

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
  let prismaService: Mocked<PrismaService>;
  let kafkaService: typeof KafkaMockService;

  beforeEach(() => {
    prismaService = {
      user: {
        create: vi.fn().mockResolvedValue(mockUser),
        findFirst: vi.fn((args) => (args.where.id === mockUser.id ? Promise.resolve(mockUser) : Promise.resolve(null))),
        findMany: vi.fn().mockResolvedValue(mockUsers),
        count: vi.fn().mockResolvedValue(mockUsers.length),
        update: vi.fn((args) =>
          args.where.id === mockUser.id ? Promise.resolve({ ...mockUser, ...args.data }) : Promise.resolve(null),
        ),
      },
    } as any;

    kafkaService = { ...KafkaMockService };

    usersService = new UsersService(kafkaService as any, prismaService);

    vi.mocked(createSearchQuery).mockClear();
    vi.mocked(createSortQuery).mockClear();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const data = { name: 'John Doe', email: 'john@example.com' };
      const result = await usersService.createUser(data);
      expect(prismaService.user.create).toHaveBeenCalledWith({ data });
      expect(result).toBe(mockUser);
    });
  });

  describe('findUsers', () => {
    it('should return users with filters', async () => {
      const query = { skip: 0, take: 10, search: 'John', sortBy: 'name', sortOrder: 'asc' } as any;
      const result = await usersService.findUsers(query);
      expect(createSearchQuery).toHaveBeenCalledWith(query.search, expect.anything());
      expect(createSortQuery).toHaveBeenCalledWith(query.sortBy, query.sortOrder);
      expect(prismaService.user.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findUsersCount', () => {
    it('should return count of users', async () => {
      const query = { search: 'John' } as any;
      const result = await usersService.findUsersCount(query);
      expect(createSearchQuery).toHaveBeenCalledWith(query.search, expect.anything());
      expect(prismaService.user.count).toHaveBeenCalled();
      expect(result).toBe(mockUsers.length);
    });
  });

  describe('findUser', () => {
    it('should return user if found', async () => {
      const result = await usersService.findUser(mockUser.id);
      expect(prismaService.user.findFirst).toHaveBeenCalledWith({ where: { id: mockUser.id } });
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
      expect(prismaService.user.update).toHaveBeenCalledWith({ where: { id: mockUser.id }, data });
      expect(kafkaService.emit).toHaveBeenCalledWith(UsersTopics.USER_UPDATED, { name: 'Updated Name' });
      expect(result.name).toBe('Updated Name');
    });

    it('should throw NotFoundException if user does not exist', async () => {
      await expect(usersService.updateUser('no-id', { name: 'test' })).rejects.toThrow(NotFoundException);
    });
  });
});
