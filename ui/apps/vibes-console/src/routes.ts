export const HOME = 'Applications Center';
export const DASHBOARD = 'Content Review Hub';
export const REVIEW_ITEM = 'Review Item';
export const SETTINGS = 'Settings';
export const EDIT_MAX_MODERATORS = 'Edit Max Moderators';
export const ASSIGN_ADMIN = 'Assign New Admin';
export const RESPOND_ADMIN = 'Respond To Admin';
export const RESIGN_MODERATOR = 'Resign Moderator';
export const RESIGN_CONFIRMATION = 'Resign Confirmation';
export const BECOME_MODERATOR = 'Become Moderator';
export const MY_APPLICATIONS = 'My Applications';
export const APPLICATIONS = 'Applications Log';
export const MY_APPLICATION_DETAIL = 'My Application Detail';
export const APPLICATION_DETAIL = 'Application Detail';
export const WITHDRAW_APPLICATION = 'Withdraw Application';

export const baseApplicationsUrl = '/applications-center';
export const baseDashboardUrl = '/dashboard';

export default {
  [HOME]: baseApplicationsUrl,
  [BECOME_MODERATOR]: `${baseApplicationsUrl}/become-a-moderator`,
  [MY_APPLICATIONS]: `${baseApplicationsUrl}/my-applications`,
  [APPLICATIONS]: `${baseApplicationsUrl}/applications`,
  [MY_APPLICATION_DETAIL]: `${baseApplicationsUrl}/my-applications/$applicationId`,
  [APPLICATION_DETAIL]: `${baseApplicationsUrl}/applications/$applicationId`,
  [WITHDRAW_APPLICATION]: `${baseApplicationsUrl}/my-applications/$applicationId/withdraw`,

  [DASHBOARD]: baseDashboardUrl,
  [REVIEW_ITEM]: `${baseDashboardUrl}/$action/$itemType/$id`,
  [SETTINGS]: `${baseDashboardUrl}/settings`,
  [EDIT_MAX_MODERATORS]: `${baseDashboardUrl}/settings/edit`,
  [ASSIGN_ADMIN]: `${baseDashboardUrl}/settings/assign-admin`,
  [RESPOND_ADMIN]: `${baseDashboardUrl}/respond-admin`,
  [RESIGN_MODERATOR]: `${baseDashboardUrl}/settings/resign-from-role`,
  [RESIGN_CONFIRMATION]: `${baseDashboardUrl}/resign-confirmation`,
};
