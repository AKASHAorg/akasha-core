import React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useGetLogin, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import ErrorBoundary, {
  ErrorBoundaryProps,
} from '@akashaorg/design-system-core/lib/components/ErrorBoundary';
import CustomizeNotificationPage from './pages/customize-notification-page';
import NotificationsPage from './pages/notifications-page';
import WelcomePage from './pages/welcome-page';

import routes, {
  CUSTOMIZE_NOTIFICATION_WELCOME_PAGE,
  CUSTOMIZE_NOTIFICATION_OPTIONS_PAGE,
  CUSTOMIZE_NOTIFICATION_CONFIRMATION_PAGE,
  SHOW_NOTIFICATIONS_PAGE,
  SETTINGS_PAGE,
} from '../routes';

const AppRoutes: React.FC<unknown> = () => {
  const { baseRouteName, logger } = useRootComponentProps();
  const { t } = useTranslation('app-notifications');
  const { data } = useGetLogin();
  const isLoggedIn = !!data?.id;

  const props: Pick<ErrorBoundaryProps, 'errorObj' | 'logger'> = {
    errorObj: {
      type: t('script-error'),
      title: t('Error in notifications app'),
    },
    logger,
  };

  return (
    <Router basename={baseRouteName}>
      <Routes>
        <Route
          path={routes[CUSTOMIZE_NOTIFICATION_WELCOME_PAGE]}
          element={
            <ErrorBoundary {...props}>
              <WelcomePage
                header={t('Welcome to the Notification App')}
                description={t(
                  'Get the latest updates about what’s going on with your world. You can personalize your notifications and get only what you want to see!',
                )}
                image="/images/notificationapp-welcome-min.webp"
                leftButtonLabel={t('Skip')}
                rightButtonLabel={t('Customize your notifications')}
                isLoggedIn={isLoggedIn}
              />
            </ErrorBoundary>
          }
        />
        <Route
          path={routes[CUSTOMIZE_NOTIFICATION_OPTIONS_PAGE]}
          element={
            <ErrorBoundary {...props}>
              <CustomizeNotificationPage initial={true} isLoggedIn={isLoggedIn} />
            </ErrorBoundary>
          }
        />
        <Route
          path={routes[CUSTOMIZE_NOTIFICATION_CONFIRMATION_PAGE]}
          element={
            <ErrorBoundary {...props}>
              <WelcomePage
                header={t('All done!')}
                description={t(
                  'You will receive notifications based on your choices now! You can always change that or even pause it from the notifications settings!',
                )}
                image={'/images/notificationapp-success-min.webp'}
                finalStep={true}
                rightButtonLabel={t('Go to my notifications')}
                isLoggedIn={isLoggedIn}
              />
            </ErrorBoundary>
          }
        />
        <Route
          path={routes[SHOW_NOTIFICATIONS_PAGE]}
          element={
            <ErrorBoundary {...props}>
              <NotificationsPage isLoggedIn={isLoggedIn} />
            </ErrorBoundary>
          }
        />
        <Route
          path={routes[SETTINGS_PAGE]}
          element={
            <ErrorBoundary {...props}>
              <CustomizeNotificationPage initial={false} isLoggedIn={isLoggedIn} />
            </ErrorBoundary>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
