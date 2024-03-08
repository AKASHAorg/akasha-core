export const HOME = 'Applications Center';
export const REVIEW_HUB = 'Content Review Hub';
export const SETTINGS = 'Console Panel';
export const BECOME_MODERATOR = 'Become Moderator';
export const APPLICATIONS = 'Applications Log';

export const baseApplicationsUrl = '/applications-center';
export const baseReviewHubUrl = '/dashboard';
export const baseSettingsUrl = '/settings';

export default {
  [HOME]: baseApplicationsUrl,
  [REVIEW_HUB]: baseReviewHubUrl,
  [SETTINGS]: baseSettingsUrl,
  [BECOME_MODERATOR]: `${baseApplicationsUrl}/become-a-moderator`,
  [APPLICATIONS]: `${baseApplicationsUrl}/applications`,
};
