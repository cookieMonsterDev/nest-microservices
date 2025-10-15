export enum UsersTopics {
  USER_CREATED = 'user.created',
  USER_UPDATED = 'user.updated',
}

export type UserCreatedEvent = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserUpdatedEvent = Pick<UserCreatedEvent, 'name'>;

export type UsersEvents = {
  [UsersTopics.USER_CREATED]: UserCreatedEvent;
  [UsersTopics.USER_UPDATED]: UserUpdatedEvent;
};
