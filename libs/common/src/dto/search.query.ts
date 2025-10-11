import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class SearchQuery {
  @ApiProperty({ required: false, description: 'Text for search' })
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(64)
  search?: string;
}
