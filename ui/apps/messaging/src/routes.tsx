export const rootRoute = '/messaging';
export const inboxRoute = `${rootRoute}/inbox`;
export const chatRoute = `${rootRoute}/chat`;
export const settingsRoute = `${rootRoute}/settings`;

export const MESSAGING = 'Messaging';
export const SETTINGS = 'Settings';
export const CHAT = 'Chat';

export default {
  [MESSAGING]: rootRoute,
  [SETTINGS]: settingsRoute,
  [CHAT]: chatRoute,
};
