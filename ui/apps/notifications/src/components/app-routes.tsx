import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { RootComponentProps } from '@akashaorg/typings/ui';
import { useGetLogin } from '@akashaorg/ui-awf-hooks';
import WelcomePage from './newComponents/WelcomePage';
import CustomizeNotificationPage from './newComponents/CustomizeNotificationPage';

import routes, {
  CUSTOMIZE_NOTIFICATION_WELCOME_PAGE,
  CUSTOMIZE_NOTIFICATION_OPTIONS_PAGE,
  CUSTOMIZE_NOTIFICATION_CONFIRMATION_PAGE,
} from '../routes';

const AppRoutes = (props: RootComponentProps) => {
  const { plugins } = props;

  const navigateTo = plugins['@akashaorg/app-routing']?.routing.navigateTo;
  const { t } = useTranslation('app-notifications');

  const loginQuery = useGetLogin();

  React.useEffect(() => {
    // redirect to sign in page if not logged in
    if (loginQuery.isSuccess && !loginQuery.data?.pubKey) {
      navigateTo?.({
        appName: '@akashaorg/app-auth-ewa',
        getNavigationUrl: navRoutes => navRoutes.Connect,
      });
    }

    // if logged in, navigate to step 1
    if (loginQuery.data?.pubKey) {
      return navigateTo?.({
        appName: '@akashaorg/app-notifications',
        getNavigationUrl: () => routes[CUSTOMIZE_NOTIFICATION_WELCOME_PAGE],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              {...props}
            />
          }
        />
        <Route
          path={routes[CUSTOMIZE_NOTIFICATION_OPTIONS_PAGE]}
          element={<CustomizeNotificationPage {...props} />}
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
              {...props}
            />
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
