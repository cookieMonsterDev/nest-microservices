import { ConfigService } from '@nestjs/config';
import { Prisma, PrismaClient } from '@users-micros/generated/prisma';

export class FixtureService {
  private prisma: PrismaClient;

  constructor(private readonly configService: ConfigService) {
    const datasourceUrl = configService.get<string>('DATABASE_URL') ?? '';
    this.prisma = new PrismaClient({ datasourceUrl });
  }

  async seedDatabase() {
    const users = await this.seedUsers();
    return { users };
  }

  async clearDatabase() {
    await this.prisma.$executeRawUnsafe(`
    DO
    $$
    DECLARE
      _tbl text;
    BEGIN
      EXECUTE 'SET session_replication_role = replica';

      FOR _tbl IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
      LOOP
        EXECUTE format('TRUNCATE TABLE public.%I CASCADE', _tbl);
      END LOOP;

      EXECUTE 'SET session_replication_role = DEFAULT';
    END
    $$;
  `);
  }

  private async seedUsers() {
    const rawUsersData = (await import('./users.json')) as Prisma.UserCreateInput[];
    await this.prisma.user.createManyAndReturn({ data: rawUsersData });
  }
}
