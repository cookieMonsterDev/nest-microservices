import { ApiProperty } from '@nestjs/swagger';

export class MessageEntity {
  constructor(partial: Partial<MessageEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ example: 'User blocked' })
  message: string;
}
