export const FEED = 'Feed';
export const MY_FEED = 'My Feed';
export const NEW_POST = 'New post';
export const POSTS = 'Posts';
export const POST = 'Post';
export const REPLY = 'Reply';
export const TAGS = 'Tags';
export const rootRoute = '/social-app';
export const INVITE = 'Invite';

export default {
  [FEED]: `${rootRoute}/feed`,
  [MY_FEED]: `${rootRoute}/my-feed`,
  [NEW_POST]: `${rootRoute}/new-post`,
  [POSTS]: `${rootRoute}/posts`,
  [POST]: `${rootRoute}/post`,
  [REPLY]: `${rootRoute}/reply`,
  [INVITE]: `${rootRoute}/invite`,
  [TAGS]: `${rootRoute}/tags`,
};
