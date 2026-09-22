import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, MaxLength, MinLength, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ required: true, example: 'How to setup nest microservices monorepo' })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  title: string;

  @ApiProperty({ required: true, example: 'e3390b44-f09f-4d93-87c9-1e5d7929c6ef' })
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
