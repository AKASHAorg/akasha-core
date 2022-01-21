export const HOME = 'Home';
export const HISTORY = 'History';
export const RESTRICTED = 'Restricted';
export const UNAUTHENTICATED = 'Unauthenticated';
export const rootRoute = '/moderation-app';
export const POST = 'Post';
export const REPLY = 'Reply';
export const rootAKASHARoute = '/social-app';

export default {
  [HOME]: `${rootRoute}/home`,
  [HISTORY]: `${rootRoute}/history`,
  [RESTRICTED]: `${rootRoute}/restricted`,
  [UNAUTHENTICATED]: `${rootRoute}/unauthenticated`,
  [POST]: `${rootAKASHARoute}/post`,
  [REPLY]: `${rootAKASHARoute}/reply`,
};
