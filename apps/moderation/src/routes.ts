export const HOME = 'Home';
export const RESTRICTED = 'Restricted';
export const UNAUTHENTICATED = 'Unauthenticated';
export const rootRoute = '/moderation-app';

export default {
  [HOME]: `${rootRoute}/home`,
  [RESTRICTED]: `${rootRoute}/restricted`,
  [UNAUTHENTICATED]: `${rootRoute}/unauthenticated`,
};
