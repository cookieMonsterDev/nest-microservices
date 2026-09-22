import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { IntersectionType } from '@nestjs/swagger';
import { SortQuery } from '@libs/prisma/dto/sort.query.js';
import { PageQuery } from '@libs/prisma/dto/page.query.js';
import { SearchQuery } from '@libs/prisma/dto/search.query.js';

export class BaseFindQuery extends IntersectionType(SortQuery, SearchQuery) {
  @Type(() => PageQuery)
  @ValidateNested()
  page?: PageQuery;
}
