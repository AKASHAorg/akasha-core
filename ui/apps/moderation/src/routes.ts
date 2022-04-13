export const HOME = 'Dashboard';
export const HISTORY = 'Transparency Log';
export const GUEST = 'Guest';
export const UNAUTHENTICATED = 'Unauthenticated';
export const APP_NAME = 'Moderation App';
export const rootRoute = '/moderation-app';

export default {
  [HOME]: `${rootRoute}/home`,
  [HISTORY]: `${rootRoute}/history`,
  [GUEST]: `${rootRoute}/guest`,
  [UNAUTHENTICATED]: `${rootRoute}/unauthenticated`,
};
