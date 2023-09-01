import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useGetLogin, useRootComponentProps } from '@akashaorg/ui-awf-hooks';

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

const AppRoutes = () => {
  const { t } = useTranslation('app-notifications');
  const { baseRouteName } = useRootComponentProps();

  const loginQuery = useGetLogin();

  const isLoggedIn = React.useMemo(() => {
    return !!loginQuery.data?.id;
  }, [loginQuery.data]);

  return (
    <Router basename={baseRouteName}>
      <Routes>
        <Route
          path={routes[CUSTOMIZE_NOTIFICATION_WELCOME_PAGE]}
          element={
            <WelcomePage
              header={t('Welcome to the Notification App')}
              description={t(
                'Get the latest updates about what’s going on with your world. You can personalize your notifications and get only what you want to see!',
              )}
              leftButtonLabel={t('Skip')}
              rightButtonLabel={t('Customize your notifications')}
              isLoggedIn={isLoggedIn}
            />
          }
        />
        <Route
          path={routes[CUSTOMIZE_NOTIFICATION_OPTIONS_PAGE]}
          element={<CustomizeNotificationPage initial={true} />}
        />
        <Route
          path={routes[CUSTOMIZE_NOTIFICATION_CONFIRMATION_PAGE]}
          element={
            <WelcomePage
              header={t('All done!')}
              description={t(
                'You will receive notifications based on your choices now! You can always change that or even pause it from the notifications settings!',
              )}
              finalStep={true}
              rightButtonLabel={t('Go to my notifications')}
              isLoggedIn={isLoggedIn}
            />
          }
        />
        <Route path={routes[SHOW_NOTIFICATIONS_PAGE]} element={<NotificationsPage />} />
        <Route
          path={routes[SETTINGS_PAGE]}
          element={<CustomizeNotificationPage initial={false} />}
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
