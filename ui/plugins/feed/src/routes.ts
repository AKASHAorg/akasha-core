export const MY_FEED_PAGE = 'My Feed';
export const SAVED_PAGE = 'Saved';
export const SETTINGS_PAGE = 'Settings';
export const rootRoute = '/homefeed';

export default {
  [MY_FEED_PAGE]: `${rootRoute}/all`,
  [SAVED_PAGE]: `${rootRoute}/saved`,
  [SETTINGS_PAGE]: `${rootRoute}/settings`,
};
