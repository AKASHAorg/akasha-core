import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import DS from '@akashaorg/design-system';
import { RootComponentProps, ModalNavigationOptions } from '@akashaorg/typings/ui';
import { useGetLogin, useGetProfile } from '@akashaorg/ui-awf-hooks';

import ProfilePage from './profile-page';
import NoProfileFound from './no-profile-found';
import DevKeysCard from '../dev-dashboard/profile/dev-keys';
import AddDevKeyCard from '../dev-dashboard/profile/add-dev-key';
import EditDevKeyCard from '../dev-dashboard/profile/edit-dev-key';
import DevDashOnboardingIntro from '../dev-dashboard/onboarding/intro-card';
import DevDashOnboardingSteps from '../dev-dashboard/onboarding/onboarding-steps';

import menuRoute, {
  MY_PROFILE,
  ONBOARDING,
  DEV_DASHBOARD,
  ONBOARDING_STEP_ONE,
  ONBOARDING_STEP_TWO,
  ONBOARDING_STEP_THREE,
  ONBOARDING_STEP_FOUR,
  DEV_KEYS,
  ADD_DEV_KEY,
  EDIT_MESSAGE_NAME,
} from '../../routes';

const { Box } = DS;

const AppRoutes: React.FC<RootComponentProps> = props => {
  const { plugins } = props;

  const loginQuery = useGetLogin();
  const loggedProfileQuery = useGetProfile(loginQuery.data?.pubKey);

  const { t } = useTranslation('app-profile');

  const showLoginModal = (redirectTo?: { modal: ModalNavigationOptions }) => {
    props.navigateToModal({ name: 'login', redirectTo });
  };

  const handleGoToFeedClick = () => {
    plugins['@akashaorg/app-routing']?.routing.navigateTo({
      appName: '@akashaorg/app-akasha-integration',
      getNavigationUrl: (routes: Record<string, string>) => routes.defaultRoute,
    });
  };

  const handleCTAClick = () => {
    // if user is logged in, show link to their profile
    if (loggedProfileQuery.data?.pubKey) {
      return plugins['@akashaorg/app-routing']?.routing.navigateTo({
        appName: '@akashaorg/app-profile',
        getNavigationUrl: (routes: Record<string, string>) => routes.myProfile,
      });
    }
    // if guest, show link to auth app
    plugins['@akashaorg/app-routing']?.routing.navigateTo?.({
      appName: '@akashaorg/app-auth-ewa',
      getNavigationUrl: (routes: Record<string, string>) => routes.SignIn,
    });
  };

  const handleOnboardingCTAClick = () => {
    // if logged in, navigate to step 1
    if (loggedProfileQuery.data?.pubKey) {
      return plugins['@akashaorg/app-routing']?.routing.navigateTo({
        appName: '@akashaorg/app-profile',
        getNavigationUrl: () => menuRoute[ONBOARDING_STEP_ONE],
      });
    }
    // if guest, redirect to onboarding step 1 after authentication
    plugins['@akashaorg/app-routing']?.routing.navigateTo?.({
      appName: '@akashaorg/app-auth-ewa',
      getNavigationUrl: (routes: Record<string, string>) => {
        return `${routes.SignIn}?${new URLSearchParams({
          redirectTo: `${props.baseRouteName}${menuRoute[ONBOARDING_STEP_ONE]}`,
        }).toString()}`;
      },
    });
  };

  return (
    <Router basename={props.baseRouteName}>
      <Box>
        <Routes>
          {/* <Route path="/list" element={<>A list of profiles</>} /> */}
          {['/:pubKey', menuRoute[MY_PROFILE], menuRoute[DEV_DASHBOARD]].map(path => (
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
          <Route
            path={menuRoute[ONBOARDING]}
            element={
              <DevDashOnboardingIntro
                titleLabel={t('Developer Dashboard')}
                introLabel={t('✨ Your journey as a developer begins here ✨')}
                descriptionLabel={t(
                  'Join our community of developers, start creating and publishing amazing applications that will make Ethereum World better!',
                )}
                ctaLabel={t('I want to be a developer')}
                onCTAClick={handleOnboardingCTAClick}
              />
            }
          />
          {[
            menuRoute[ONBOARDING_STEP_ONE],
            menuRoute[ONBOARDING_STEP_TWO],
            menuRoute[ONBOARDING_STEP_THREE],
            menuRoute[ONBOARDING_STEP_FOUR],
          ].map((path, idx) => (
            <Route
              key={path}
              path={path}
              element={<DevDashOnboardingSteps {...props} activeIndex={idx} />}
            />
          ))}
          <Route
            path={menuRoute[DEV_KEYS]}
            element={
              <DevKeysCard
                {...props}
                leftIcon={true}
                title={t('Dev Keys')}
                buttonLabel={t('New Dev Key')}
                noKeysLabel={t('You have not added any keys yet. Use the button to add some')}
                editLabel={t('Edit')}
                deleteLabel={t('Delete')}
                unusedLabel={t('Inactive')}
                usedLabel={t('Active')}
                devPubKeyLabel={t('Dev Public Key 🔑')}
                dateAddedLabel={t('Date added 🗓')}
              />
            }
          />
          <Route path={menuRoute[ADD_DEV_KEY]} element={<AddDevKeyCard {...props} />} />
          <Route
            path={menuRoute[EDIT_MESSAGE_NAME]}
            element={<EditDevKeyCard {...props} leftIcon={true} title={t('Edit Message Name')} />}
          />
        </Routes>
      </Box>
    </Router>
  );
};

export default AppRoutes;
