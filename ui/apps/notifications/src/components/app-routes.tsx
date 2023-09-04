import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useGetLogin } from '@akashaorg/ui-awf-hooks';
import { RootComponentProps } from '@akashaorg/typings/ui';
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

const AppRoutes = (props: RootComponentProps) => {
  const { t } = useTranslation('app-notifications');
  const loginQuery = useGetLogin();

  const isLoggedIn = React.useMemo(() => {
    return !!loginQuery.data?.id;
  }, [loginQuery.data]);

  return (
    <Router basename={props.baseRouteName}>
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
              {...props}
            />
          }
        />
        <Route
          path={routes[CUSTOMIZE_NOTIFICATION_OPTIONS_PAGE]}
          element={<CustomizeNotificationPage {...props} initial={true} isLoggedIn={isLoggedIn} />}
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
              {...props}
            />
          }
        />
        <Route path={routes[SHOW_NOTIFICATIONS_PAGE]} element={<NotificationsPage {...props} />} />
        <Route
          path={routes[SETTINGS_PAGE]}
          element={<CustomizeNotificationPage {...props} initial={false} isLoggedIn={isLoggedIn} />}
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
