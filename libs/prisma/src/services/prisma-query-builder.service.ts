import {
  Query,
  SortDirection,
  PrismaOrderBy,
  PrismaFindQuery,
  SEARCH_MIN_LENGTH,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_NUMBER,
  BuildFindQueryOptions,
} from '@libs/prisma/prisma.types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaQueryBuilderService {
  createSlug(value: string): string {
    return value
      .toLocaleLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-');
  }

  buildPagination(query: object): { skip: number; take: number } {
    const q = query as Query;
    const isObject = typeof q.page === 'object' && q.page !== null;
    const page = isObject ? (q.page as Record<string, unknown>) : {};

    const rawSize = page.size;
    const rawNumber = page.number;

    const hasValidSize = typeof rawSize === 'number' && Number.isFinite(rawSize) && rawSize > 0;
    const hasValidNumber = typeof rawNumber === 'number' && Number.isFinite(rawNumber) && rawNumber > 0;

    const size = hasValidSize ? rawSize : DEFAULT_PAGE_SIZE;
    const number = hasValidNumber ? rawNumber : DEFAULT_PAGE_NUMBER;

    const skip = (number - 1) * size;

    return { skip, take: size };
  }

  buildSort(query: Query, sortFields: string[]): PrismaOrderBy | undefined {
    const rawSort = query.sort;

    const sortFromString =
      typeof rawSort === 'string'
        ? rawSort
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
        : [];

    const sortFromArray = Array.isArray(rawSort)
      ? rawSort.filter((item): item is string => typeof item === 'string')
      : [];

    const sortList = sortFromString.length > 0 ? sortFromString : sortFromArray;

    const orderBy: Array<Record<string, SortDirection>> = [];

    for (const entry of sortList) {
      const [field, direction] = entry.split('-');
      const isAllowedField = typeof field === 'string' && sortFields.includes(field);
      const isAllowedDirection = direction === SortDirection.ASC || direction === SortDirection.DESC;

      if (!isAllowedField || !isAllowedDirection) continue;

      orderBy.push({ [field]: direction });
    }

    return orderBy.length > 0 ? orderBy : undefined;
  }

  buildSearch(query: Query, searchFields: string[]): PrismaFindQuery['where'] {
    const rawSearch = query.search;

    if (typeof rawSearch !== 'string') return {};

    const trimmedSearch = rawSearch.trim();

    if (trimmedSearch.length < SEARCH_MIN_LENGTH) return {};

    if (!searchFields.length) return {};

    const sanitizedSearch = trimmedSearch.replace(/\s+/g, ' ').replace(/\s/g, ' & ');

    return { OR: searchFields.map((field) => ({ [field]: { search: sanitizedSearch } })) };
  }

  buildFilters(query: Query, filterFields: string[]): PrismaFindQuery['where'] {
    if (!filterFields.length) return {};

    const nestedFilter =
      typeof query.filter === 'object' && query.filter !== null && !Array.isArray(query.filter)
        ? (query.filter as Record<string, unknown>)
        : null;

    const andFilters: Array<Record<string, unknown>> = [];

    for (const field of filterFields) {
      const fromNested = nestedFilter ? nestedFilter[field] : undefined;
      const rawValues = fromNested !== undefined ? fromNested : query[field];
      const values = this.normalizeFilterValues(rawValues);

      if (values.length === 0) continue;

      const filtersForField = values.map((value) => ({ [field]: { equals: value } }));

      andFilters.push({ OR: filtersForField });
    }

    if (andFilters.length === 0) return {};

    return { AND: andFilters };
  }

  private normalizeFilterValues(raw: unknown): Array<string | number> {
    if (raw === undefined || raw === null) return [];

    if (typeof raw === 'number' && Number.isFinite(raw)) return [raw];

    if (typeof raw === 'string') {
      const trimmed = raw.trim();
      if (!trimmed) return [];

      return trimmed.includes(',')
        ? trimmed
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
        : [trimmed];
    }

    if (Array.isArray(raw)) {
      const out: Array<string | number> = [];

      for (const item of raw) {
        if (typeof item === 'number' && Number.isFinite(item)) {
          out.push(item);
          continue;
        }
        if (typeof item === 'string') {
          const t = item.trim();
          if (t) out.push(t);
        }
      }

      return out;
    }

    return [];
  }

  buildFindQuery(query: object, options: BuildFindQueryOptions): PrismaFindQuery {
    const q = query as Query;
    const { sortFields = [], searchFields = [], filterFields = [] } = options;

    const pagination = this.buildPagination(q);

    const orderBy = this.buildSort(q, sortFields);

    const search = this.buildSearch(q, searchFields);
    const filters = this.buildFilters(q, filterFields);

    const where = { AND: [filters, search] };

    return { ...pagination, where, orderBy };
  }
}
