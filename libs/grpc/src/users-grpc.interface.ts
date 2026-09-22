import { type Observable } from 'rxjs';

export type FindOneUserRequest = {
  id: string;
};

export type UserResponse = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type UsersGrpcService = {
  findOne(request: FindOneUserRequest): Observable<UserResponse>;
};
