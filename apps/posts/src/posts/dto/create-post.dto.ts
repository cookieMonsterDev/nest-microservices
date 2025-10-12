import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ required: true, example: 'How to setup nest microservices monorepo' })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  title: string;
}
