export enum PostsTopics {
  POST_CREATED = 'post.created',
  POST_UPDATED = 'post.updated',
}

export type PostsCreatedEvent = {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PostsUpdatedEvent = Pick<PostsCreatedEvent, 'title'>;

export type PostsEvents = {
  [PostsTopics.POST_CREATED]: PostsCreatedEvent;
  [PostsTopics.POST_UPDATED]: PostsUpdatedEvent;
};
