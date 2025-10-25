import { ApiProperty } from '@nestjs/swagger';

export class PaginationEntity {
  constructor(partial: Partial<PaginationEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ example: 0 })
  skip: number;

  @ApiProperty({ example: 10 })
  take: number;

  @ApiProperty({ example: 100 })
  total: number;
}
