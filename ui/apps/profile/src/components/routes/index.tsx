import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DS from '@akashaorg/design-system';
import { RootComponentProps } from '@akashaorg/ui-awf-typings';
import { useGetLogin, useGetProfile } from '@akashaorg/ui-awf-hooks';
import { ModalNavigationOptions } from '@akashaorg/ui-awf-typings/lib/app-loader';

import ProfilePage from './profile-page';
import NoProfileFound from './no-profile-found';

import menuRoute, { MY_PROFILE } from '../../routes';

const { Box } = DS;

const AppRoutes: React.FC<RootComponentProps> = props => {
  const {
    plugins: { routing },
  } = props;
  const loginQuery = useGetLogin();
  const loggedProfileQuery = useGetProfile(loginQuery.data?.pubKey);

  const { t } = useTranslation('app-profile');

  const showLoginModal = (redirectTo?: { modal: ModalNavigationOptions }) => {
    props.navigateToModal({ name: 'login', redirectTo });
  };

  const handleGoToFeedClick = () => {
    routing.navigateTo({
      appName: '@akashaorg/app-akasha-integration',
      getNavigationUrl: (routes: Record<string, string>) => routes.defaultRoute,
    });
  };

  const handleCTAClick = () => {
    // if user is logged in, show link to their profile
    if (loggedProfileQuery.data?.pubKey) {
      return routing.navigateTo({
        appName: '@akashaorg/app-profile',
        getNavigationUrl: (routes: Record<string, string>) => routes.myProfile,
      });
    }
    // if guest, show link to auth app
    routing.navigateTo?.({
      appName: '@akashaorg/app-auth-ewa',
      getNavigationUrl: (routes: Record<string, string>) => routes.SignIn,
    });
  };

  return (
    <Router basename={props.baseRouteName}>
      <Box>
        <Routes>
          {/* <Route path="/list" element={<>A list of profiles</>} /> */}
          {['/:pubKey', menuRoute[MY_PROFILE]].map(path => (
            <Route
              key={path}
              path={path}
              element={
                <ProfilePage
                  {...props}
                  loggedProfileData={loggedProfileQuery.data}
                  showLoginModal={showLoginModal}
                  loginState={loginQuery.data}
                />
              }
            />
          ))}
          <Route
            path="/"
            element={
              <NoProfileFound
                titleLabel={t("Etherean profile doesn't exist 😅")}
                subtitleLine1Label={t("You can check Ethereum World's")}
                subtitleLine2Label={t('or')}
                cta1Label={t('Feed')}
                cta2Label={loggedProfileQuery.data?.pubKey ? t('visit your profile') : t('log in')}
                onGoToFeedClick={handleGoToFeedClick}
                onCTAClick={handleCTAClick}
              />
            }
          />
        </Routes>
      </Box>
    </Router>
  );
};

export default AppRoutes;
