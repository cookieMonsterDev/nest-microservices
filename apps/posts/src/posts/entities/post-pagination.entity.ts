import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationEntity } from '@libs/common/entities';
import { PostEntity } from '@posts-micros/posts/entities/post.entity';

export class PostPaginationEntity extends PaginationEntity {
  constructor(partial: Partial<PostPaginationEntity>) {
    super(partial);
    Object.assign(this, partial);
  }

  @ApiProperty({ default: PostEntity, type: PostEntity, isArray: true })
  @Type(() => PostEntity)
  data: PostEntity[];
}
