export const HOME = 'Overview';
export const DASHBOARD = 'Dashboard';
export const EDIT_CATEGORIES = 'EditCategories';
export const EDIT_CONTACT_INFO = 'EditContactInfo';
export const EDIT_MAX_APPLICANTS = 'EditMaxApplicants';
export const RESIGN_ROLE = 'ResignRole';
export const RESIGN_CONFIRMATION = 'ResignConfirmation';
export const MODERATORS = 'Moderators';
export const VIEW_MODERATOR = 'ViewModerator';
export const DISMISS_MODERATOR = 'DismissModerator';
export const HISTORY = 'Transparency Log';
export const HISTORY_ITEM = 'Transparency Log Item';
export const MODERATION_VALUE = 'Moderation Value';
export const BECOME_MODERATOR = 'Become Moderator';
export const CHECK_APPLICATION_STATUS = 'Check Application Status';
export const MODIFY_APPLICATION = 'Modify Application';

export const baseOverviewUrl = '/overview';
export const baseDashboardUrl = '/dashboard';

export default {
  [HOME]: baseOverviewUrl,
  [DASHBOARD]: baseDashboardUrl,
  [EDIT_CATEGORIES]: `${baseDashboardUrl}/edit-categories`,
  [EDIT_CONTACT_INFO]: `${baseDashboardUrl}/edit-info`,
  [EDIT_MAX_APPLICANTS]: `${baseDashboardUrl}/edit-max-applicants`,
  [RESIGN_ROLE]: `${baseDashboardUrl}/resign-from-role`,
  [RESIGN_CONFIRMATION]: `${baseDashboardUrl}/resign-confirmation`,
  [MODERATORS]: '/moderators',
  [VIEW_MODERATOR]: '/moderator/:moderatorPubKey',
  [DISMISS_MODERATOR]: '/moderator/:moderatorPubKey/dismiss',
  [HISTORY]: '/history',
  [HISTORY_ITEM]: '/history/:itemId',
  [MODERATION_VALUE]: `${baseOverviewUrl}/values/:value`,
  [BECOME_MODERATOR]: '/become-a-moderator',
  [CHECK_APPLICATION_STATUS]: '/application/status',
  [MODIFY_APPLICATION]: '/application/modify',
};
