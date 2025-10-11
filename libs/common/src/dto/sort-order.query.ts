import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { SortOrder } from '@libs/common/enums';
import { IsEnum, IsOptional } from 'class-validator';

export class SortOrderQuery {
  @ApiProperty({ required: false, enum: SortOrder, example: SortOrder.ASC })
  @IsOptional()
  @IsEnum(SortOrder)
  @Transform(({ value }) => value ?? SortOrder.ASC)
  sortOrder?: SortOrder;
}
