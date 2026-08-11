import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ required: true, example: 'John' })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  name: string;
}
