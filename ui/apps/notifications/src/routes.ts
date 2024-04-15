export const CUSTOMISE_NOTIFICATION_WELCOME_PAGE = 'CustomiseNotificationWelcomePage';
export const CUSTOMISE_NOTIFICATION_OPTIONS_PAGE = 'CustomiseNotificationOptionsPage';
export const CUSTOMISE_NOTIFICATION_CONFIRMATION_PAGE = 'CustomiseNotificationConfirmationPage';
export const SHOW_NOTIFICATIONS_PAGE = 'ShowNotificationsPage';
export const SETTINGS_PAGE = 'SettingsPage';

export default {
  [SHOW_NOTIFICATIONS_PAGE]: `/notifications`,
  [CUSTOMISE_NOTIFICATION_OPTIONS_PAGE]: `/customise-notifications/notification-options`,
  [CUSTOMISE_NOTIFICATION_CONFIRMATION_PAGE]: `/customise-notifications/confirmation`,
  [CUSTOMISE_NOTIFICATION_WELCOME_PAGE]: `/welcome`,
  [SETTINGS_PAGE]: '/settings',
};
