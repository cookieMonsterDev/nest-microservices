import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional } from 'class-validator';

export const PAGINATION_OPTIONS = [10, 25, 50, 100] as const;

export class PaginationQuery {
  @ApiProperty({ required: false, example: 0, description: 'Number of items to skip' })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? +value : 0))
  skip: number;

  @ApiProperty({ required: false, example: 25, description: 'Numbers of items to take, one of [10, 25, 50, 100]' })
  @IsOptional()
  @IsNumber()
  @IsIn(PAGINATION_OPTIONS)
  @Transform(({ value }) => (value ? +value : 25))
  take: number;
}
