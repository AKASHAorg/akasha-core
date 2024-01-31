export const HOME = 'Overview';
export const MODERATORS = 'Moderators';
export const VIEW_MODERATOR = 'ViewModerator';
export const HISTORY = 'Transparency Log';
export const HISTORY_ITEM = 'Transparency Log Item';
export const MODERATION_VALUE = 'Moderation Value';
export const BECOME_MODERATOR = 'Become Moderator';
export const CHECK_APPLICATION_STATUS = 'Check Application Status';
export const MODIFY_APPLICATION = 'Modify Application';
export const REPORT_ITEM = 'Report Item';

export const baseOverviewUrl = '/overview';
export const baseApplicationUrl = '/application';

export default {
  [HOME]: baseOverviewUrl,
  [MODERATORS]: '/moderators',
  [VIEW_MODERATOR]: '/moderator/:moderatorProfileId',
  [HISTORY]: '/history',
  [HISTORY_ITEM]: '/history/:itemId',
  [MODERATION_VALUE]: `${baseOverviewUrl}/values/:value`,
  [BECOME_MODERATOR]: '/become-a-moderator',
  [CHECK_APPLICATION_STATUS]: `${baseApplicationUrl}/status`,
  [MODIFY_APPLICATION]: `${baseApplicationUrl}/modify`,
  [REPORT_ITEM]: '/report/:itemType/:id',
};
