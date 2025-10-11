import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '@/core/users/root/entities/user.entity';
import { PaginationEntity } from '@/common/entities/pagination.entity';

export class UserPaginationEntity extends PaginationEntity {
  constructor(partial: Partial<UserPaginationEntity>) {
    super(partial);
    Object.assign(this, partial);
  }

  @ApiProperty({ default: UserEntity, type: UserEntity, isArray: true })
  @Type(() => UserEntity)
  data: UserEntity[];
}
