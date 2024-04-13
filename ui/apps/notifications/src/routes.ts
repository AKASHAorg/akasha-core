export const CUSTOMIZE_NOTIFICATION_WELCOME_PAGE = 'CustomizeNotificationWelcomePage';
export const CUSTOMIZE_NOTIFICATION_OPTIONS_PAGE = 'CustomizeNotificationOptionsPage';
export const CUSTOMIZE_NOTIFICATION_CONFIRMATION_PAGE = 'CustomizeNotificationConfirmationPage';
export const SHOW_NOTIFICATIONS_PAGE = 'ShowNotificationsPage';
export const SETTINGS_PAGE = 'SettingsPage';

export default {
  [SHOW_NOTIFICATIONS_PAGE]: `/notifications`,
  [CUSTOMIZE_NOTIFICATION_OPTIONS_PAGE]: `/customize-notifications/notification-options`,
  [CUSTOMIZE_NOTIFICATION_CONFIRMATION_PAGE]: `/customize-notifications/confirmation`,
  [CUSTOMIZE_NOTIFICATION_WELCOME_PAGE]: `/welcome`,
  [SETTINGS_PAGE]: '/settings',
};
