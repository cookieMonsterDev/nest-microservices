import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional, Min } from 'class-validator';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUMBER, PAGE_SIZE_OPTIONS } from '@libs/prisma/prisma.types';

export class PageQuery {
  @ApiProperty({
    example: 1,
    required: false,
    name: 'page[number]',
    description: 'Page number, default is 1',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => (value ? parseInt(value, 10) : DEFAULT_PAGE_NUMBER))
  number: number = DEFAULT_PAGE_NUMBER;

  @ApiProperty({
    example: 25,
    required: false,
    name: 'page[size]',
    description: 'Items per page, one of [10, 25, 50, 100]',
  })
  @IsOptional()
  @IsNumber()
  @IsIn(PAGE_SIZE_OPTIONS)
  @Transform(({ value }) => (value ? parseInt(value, 10) : DEFAULT_PAGE_SIZE))
  size: number = DEFAULT_PAGE_SIZE;
}
