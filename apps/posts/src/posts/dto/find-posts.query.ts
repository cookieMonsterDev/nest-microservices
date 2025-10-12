import { IsIn, IsOptional, IsString } from 'class-validator';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { SearchQuery, PaginationQuery, SortOrderQuery } from '@libs/common/dto';

export const POSTS_SORT_FIELDS = ['title', 'createdAt', 'updatedAt'];

export const POSTS_SEARCH_FIELDS = ['title'];

export class FindPostsQuery extends IntersectionType(SearchQuery, PaginationQuery, SortOrderQuery) {
  @ApiProperty({ required: false, example: 'createdAt' })
  @IsOptional()
  @IsString()
  @IsIn(POSTS_SORT_FIELDS)
  sortBy?: string = 'createdAt';
}
