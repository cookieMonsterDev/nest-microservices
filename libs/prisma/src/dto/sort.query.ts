import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

export class SortQuery {
  @ApiProperty({
    required: false,
    example: 'id-asc,age-desc',
    description: 'Comma-separated sort fields with direction (field-asc or field-desc)',
  })
  @IsOptional()
  @IsString({ each: true })
  @Matches(/^[a-zA-Z0-9_]+-(asc|desc)$/, {
    each: true,
    message: 'Sort format must be "field-asc" or "field-desc"',
  })
  @Transform(({ value }) => {
    if (!value) return [];

    return value
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean);
  })
  sort: string[] = [];
}
