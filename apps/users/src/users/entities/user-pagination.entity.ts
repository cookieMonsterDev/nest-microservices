import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationEntity } from '@libs/common/entities';
import { UserEntity } from '@apps/users/users/entities/user.entity';

export class UserPaginationEntity extends PaginationEntity {
  constructor(partial: Partial<UserPaginationEntity>) {
    super(partial);
    Object.assign(this, partial);
  }

  @ApiProperty({ default: UserEntity, type: UserEntity, isArray: true })
  @Type(() => UserEntity)
  data: UserEntity[];
}
