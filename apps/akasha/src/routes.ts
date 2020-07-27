export const FEED = 'Feed';
export const NEW_POST = 'New post';
export const POSTS = 'Posts';
export const SETTINGS_PAGE = 'Settings';
export const rootRoute = '/AKASHA-app';

export default {
  [FEED]: `${rootRoute}/feed`,
  [NEW_POST]: `${rootRoute}/new-post`,
  [POSTS]: `${rootRoute}/posts`,
  [SETTINGS_PAGE]: `${rootRoute}/settings`,
};
