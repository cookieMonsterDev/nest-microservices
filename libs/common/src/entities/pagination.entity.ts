import { ApiProperty } from '@nestjs/swagger';

export class PaginationEntity {
  constructor(partial: Partial<PaginationEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ example: 1 })
  currentPage: number;

  @ApiProperty({ example: 10 })
  totalPages: number;
}
