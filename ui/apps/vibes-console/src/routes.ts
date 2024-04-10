export const HOME = 'Applications Center';
export const DASHBOARD = 'Content Review Hub';
export const SETTINGS = 'Settings';
export const EDIT_MAX_MODERATORS = 'Edit Max Moderators';
export const BECOME_MODERATOR = 'Become Moderator';
export const MY_APPLICATIONS = 'My Applications';
export const APPLICATIONS = 'Applications Log';
export const MY_APPLICATION_DETAIL = 'My Application Detail';
export const APPLICATION_DETAIL = 'Application Detail';
export const WITHDRAW_APPLICATION = 'Withdraw Application';

export const baseApplicationsUrl = '/applications-center';
export const baseReviewHubUrl = '/dashboard';

export default {
  [HOME]: baseApplicationsUrl,
  [DASHBOARD]: baseReviewHubUrl,
  [SETTINGS]: `${baseReviewHubUrl}/settings`,
  [EDIT_MAX_MODERATORS]: `${baseReviewHubUrl}/settings/edit`,
  [BECOME_MODERATOR]: `${baseApplicationsUrl}/become-a-moderator`,
  [MY_APPLICATIONS]: `${baseApplicationsUrl}/my-applications`,
  [APPLICATIONS]: `${baseApplicationsUrl}/applications`,
  [MY_APPLICATION_DETAIL]: `${baseApplicationsUrl}/my-applications/$applicationId`,
  [APPLICATION_DETAIL]: `${baseApplicationsUrl}/applications/$applicationId`,
  [WITHDRAW_APPLICATION]: `${baseApplicationsUrl}/my-applications/$applicationId/withdraw`,
};
