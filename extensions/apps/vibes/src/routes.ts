export const HOME = 'Overview';
export const MODERATORS = 'Moderators';
export const VIEW_MODERATOR = 'ViewModerator';
export const HISTORY = 'Transparency Log';
export const HISTORY_ITEM = 'Transparency Log Item';
export const MODERATION_VALUE = 'Moderation Value';
export const REPORT_ITEM = 'Report Item';

export const baseHistoryUrl = '/history';
export const baseOverviewUrl = '/overview';
export const baseModeratorsUrl = '/moderators';

export default {
  [HOME]: baseOverviewUrl,
  [MODERATION_VALUE]: `${baseOverviewUrl}/values/$value`,
  [MODERATORS]: baseModeratorsUrl,
  [VIEW_MODERATOR]: `${baseModeratorsUrl}/$moderatorId`,
  [HISTORY]: baseHistoryUrl,
  [HISTORY_ITEM]: `${baseHistoryUrl}/$itemId`,
  [REPORT_ITEM]: '/report/$itemType/$id',
};
