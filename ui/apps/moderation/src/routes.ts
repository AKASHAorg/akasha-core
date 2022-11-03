export const HOME = 'Overview';
export const DASHBOARD = 'Dashboard';
export const MODERATORS = 'Moderators';
export const HISTORY = 'Transparency Log';
export const MODERATION_VALUE = 'ModerationValue';

export const baseOverviewUrl = '/overview';

export default {
  [HOME]: baseOverviewUrl,
  [DASHBOARD]: '/dashboard',
  [MODERATORS]: '/moderators',
  [HISTORY]: '/history',
  [MODERATION_VALUE]: `${baseOverviewUrl}/values/:value`,
};
