export const HOME = 'Applications Center';
export const REVIEW_HUB = 'Content Review Hub';
export const SETTINGS = 'Console Panel';
export const BECOME_MODERATOR = 'Become Moderator';
export const MY_APPLICATIONS = 'My Applications';
export const APPLICATIONS = 'Applications Log';
export const MY_APPLICATION_DETAIL = 'My Application Detail';
export const APPLICATION_DETAIL = 'Application Detail';
export const WITHDRAW_APPLICATION = 'Withdraw Application';

export const baseApplicationsUrl = '/applications-center';
export const baseReviewHubUrl = '/dashboard';
export const baseSettingsUrl = '/settings';

export default {
  [HOME]: baseApplicationsUrl,
  [REVIEW_HUB]: baseReviewHubUrl,
  [SETTINGS]: baseSettingsUrl,
  [BECOME_MODERATOR]: `${baseApplicationsUrl}/become-a-moderator`,
  [MY_APPLICATIONS]: `${baseApplicationsUrl}/my-applications`,
  [APPLICATIONS]: `${baseApplicationsUrl}/applications`,
  [MY_APPLICATION_DETAIL]: `${baseApplicationsUrl}/my-applications/$applicationId`,
  [APPLICATION_DETAIL]: `${baseApplicationsUrl}/applications/$applicationId`,
  [WITHDRAW_APPLICATION]: `${baseApplicationsUrl}/my-applications/$applicationId/withdraw`,
};
