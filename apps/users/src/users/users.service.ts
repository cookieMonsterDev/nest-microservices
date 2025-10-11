import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(private readonly databaseSer) {}
}
