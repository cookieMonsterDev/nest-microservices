import { ApiProperty } from '@nestjs/swagger';

export class PostEntity {
  constructor(partial: Partial<PostEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ example: 'e3390b44-f09f-4d93-87c9-1e5d7929c6ef' })
  id: string;

  @ApiProperty({ example: 'How to setup nest microservices monorepo' })
  title: string;

  @ApiProperty({ example: '2024-11-16T07:28:14.116Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-11-16T07:28:14.116Z' })
  updatedAt: Date;
}
