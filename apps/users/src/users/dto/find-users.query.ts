import { IsIn, IsOptional, IsString } from 'class-validator';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { SearchQuery, PaginationQuery, SortOrderQuery } from '@libs/common/dto';

export const USERS_SORT_FIELDS = ['name', 'createdAt', 'updatedAt'];

export const USERS_SEARCH_FIELDS = ['name'];

export class FindUsersQuery extends IntersectionType(SearchQuery, PaginationQuery, SortOrderQuery) {
  @ApiProperty({ required: false, example: 'createdAt' })
  @IsOptional()
  @IsString()
  @IsIn(USERS_SORT_FIELDS)
  sortBy?: string = 'createdAt';
}
