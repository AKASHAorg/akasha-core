export const rootRoute = '/messaging';
export const inboxRoute = `${rootRoute}/inbox`;
export const settingsRoute = `${rootRoute}/settings`;

export const MESSAGING = 'Messaging';
export const SETTINGS = 'Settings';

export default {
  [MESSAGING]: rootRoute,
  [SETTINGS]: settingsRoute,
};
