export const HOME = 'Overview';
export const DASHBOARD = 'Dashboard';
export const MODERATORS = 'Moderators';
export const VIEW_MODERATOR = 'ViewModerator';
export const HISTORY = 'Transparency Log';
export const HISTORY_ITEM = 'Transparency Log Item';
export const MODERATION_VALUE = 'Moderation Value';

export const baseOverviewUrl = '/overview';

export default {
  [HOME]: baseOverviewUrl,
  [DASHBOARD]: '/dashboard',
  [MODERATORS]: '/moderators',
  [VIEW_MODERATOR]: '/moderator/:moderatorPubKey',
  [HISTORY]: '/history',
  [HISTORY_ITEM]: '/history/:itemId',
  [MODERATION_VALUE]: `${baseOverviewUrl}/values/:value`,
};
