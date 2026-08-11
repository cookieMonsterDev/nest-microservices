import { ApiProperty } from '@nestjs/swagger';
import { SEARCH_MIN_LENGTH } from '@libs/prisma/prisma.types';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class SearchQuery {
  @ApiProperty({ required: false, description: 'Text for search' })
  @IsOptional()
  @IsString()
  @MinLength(SEARCH_MIN_LENGTH)
  @MaxLength(64)
  search?: string;
}
