export const HOME = 'Overview';
export const DASHBOARD = 'Dashboard';
export const EDIT_CATEGORIES = 'EditCategories';
export const EDIT_CONTACT_INFO = 'EditContactInfo';
export const EDIT_MAX_APPLICANTS = 'EditMaxApplicants';
export const RESIGN_ROLE = 'ResignRole';
export const RESIGN_CONFIRMATION = 'ResignConfirmation';
export const ASSIGN_NEW_ADMIN = 'AssignNewAdmin';
export const MODERATORS = 'Moderators';
export const VIEW_MODERATOR = 'ViewModerator';
export const DISMISS_MODERATOR = 'DismissModerator';
export const HISTORY = 'Transparency Log';
export const HISTORY_ITEM = 'Transparency Log Item';
export const MODERATION_VALUE = 'Moderation Value';
export const BECOME_MODERATOR = 'Become Moderator';
export const CHECK_APPLICATION_STATUS = 'Check Application Status';
export const MODIFY_APPLICATION = 'Modify Application';
export const REPORT_ITEM = 'Report Item';
export const VIEW_APPLICATION_DETAILS = 'View Application Details';
export const APPLICATIONS_ACTIVITY = 'Applications Activity';
export const MODERATION_ACTIVITY = 'Moderation Activity';

export const baseOverviewUrl = '/overview';
export const baseDashboardUrl = '/dashboard';
export const baseApplicationUrl = '/application';

export default {
  [HOME]: baseOverviewUrl,
  [DASHBOARD]: baseDashboardUrl,
  [EDIT_CATEGORIES]: `${baseDashboardUrl}/edit-categories`,
  [EDIT_CONTACT_INFO]: `${baseDashboardUrl}/edit-info`,
  [EDIT_MAX_APPLICANTS]: `${baseDashboardUrl}/edit-max-applicants`,
  [RESIGN_ROLE]: `${baseDashboardUrl}/resign-from-role`,
  [RESIGN_CONFIRMATION]: `${baseDashboardUrl}/resign-confirmation`,
  [ASSIGN_NEW_ADMIN]: `${baseDashboardUrl}/assign-admin`,
  [MODERATORS]: '/moderators',
  [VIEW_MODERATOR]: '/moderator/:moderatorProfileId',
  [DISMISS_MODERATOR]: '/moderator/:moderatorProfileId/dismiss',
  [HISTORY]: '/history',
  [HISTORY_ITEM]: '/history/:itemId',
  [MODERATION_VALUE]: `${baseOverviewUrl}/values/:value`,
  [BECOME_MODERATOR]: '/become-a-moderator',
  [CHECK_APPLICATION_STATUS]: `${baseApplicationUrl}/status`,
  [MODIFY_APPLICATION]: `${baseApplicationUrl}/modify`,
  [REPORT_ITEM]: '/report/:itemType/:id',
  [VIEW_APPLICATION_DETAILS]: `${baseDashboardUrl}/application/:id`,
  [APPLICATIONS_ACTIVITY]: `${baseDashboardUrl}/activity/applications`,
  [MODERATION_ACTIVITY]: `${baseDashboardUrl}/activity/moderation`,
};
