export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export type PrismaWhere = Record<string, unknown>;

export type Primitive = string | number | boolean | null;

export type PrismaOrderBy = Record<string, SortDirection> | Array<Record<string, SortDirection>>;

export const DEFAULT_PAGE_SIZE = 25;

export const DEFAULT_PAGE_NUMBER = 1;

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

export const SEARCH_MIN_LENGTH = 4;

export type Query = Record<string, unknown>;

export type BuildFindQueryOptions = {
  sortFields?: string[];
  searchFields?: string[];
  filterFields?: string[];
};

export type PrismaFindQuery = {
  skip?: number;
  take?: number;
  where?: PrismaWhere;
  orderBy?: PrismaOrderBy;
};
