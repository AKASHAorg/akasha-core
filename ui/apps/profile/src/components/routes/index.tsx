import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import DS from '@akashaorg/design-system';
import { RootComponentProps, ModalNavigationOptions } from '@akashaorg/typings/ui';
import { useCheckModerator, useGetLogin, useGetProfile } from '@akashaorg/ui-awf-hooks';

import ProfilePage from './profile-page';
import NoProfileFound from './no-profile-found';
import DevKeysCard from '../dev-dashboard/profile/dev-keys';
import AddDevKeyCard from '../dev-dashboard/profile/add-dev-key';
import EditMessageName from '../dev-dashboard/profile/edit-message-name';
import PublishedAppsCard from '../dev-dashboard/profile/published-apps';
import SignMessageCard from '../dev-dashboard/profile/sign-message';
import VerifySignatureCard from '../dev-dashboard/profile/verify-signature';
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
  PUBLISHED_APPS,
  SIGN_MESSAGE,
  VERIFY_SIGNATURE,
} from '../../routes';
import DevDashboard from './dev-dashboard';

const { Box } = DS;

const AppRoutes: React.FC<RootComponentProps> = props => {
  const { plugins } = props;

  const loginQuery = useGetLogin();
  const loggedProfileQuery = useGetProfile(loginQuery.data?.pubKey);

  const checkModeratorQuery = useCheckModerator(loginQuery.data?.pubKey);
  const checkModeratorResp = checkModeratorQuery.data;

  const { t } = useTranslation('app-profile');

  const isModerator = React.useMemo(() => checkModeratorResp === 200, [checkModeratorResp]);

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
          {['/:pubKey', menuRoute[MY_PROFILE]].map(path => (
            <Route
              key={path}
              path={path}
              element={
                <ProfilePage
                  {...props}
                  /* @Todo: fix my type ;/ */
                  isModerator={isModerator}
                  loginState={loginQuery.data}
                  loggedProfileData={loggedProfileQuery.data as any}
                  showLoginModal={showLoginModal}
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
          <Route path={menuRoute[DEV_DASHBOARD]} element={<DevDashboard {...props} />} />
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
                noKeysLabel={t('You have not added any keys yet. Use the button to add some')}
                editLabel={t('Edit')}
                deleteLabel={t('Delete')}
                nonameLabel={t('Unnamed Key')}
                unusedLabel={t('Inactive')}
                usedLabel={t('Active')}
                devPubKeyLabel={t('Dev Public Key 🔑')}
                dateAddedLabel={t('Date added 🗓')}
              />
            }
          />
          <Route path={menuRoute[ADD_DEV_KEY]} element={<AddDevKeyCard {...props} />} />
          <Route path={menuRoute[EDIT_MESSAGE_NAME]} element={<EditMessageName {...props} />} />
          <Route path={menuRoute[PUBLISHED_APPS]} element={<PublishedAppsCard {...props} />} />
          <Route
            path={menuRoute[SIGN_MESSAGE]}
            element={
              <SignMessageCard
                {...props}
                messageTitleLabel={t('Message')}
                messageInputPlaceholder={t('Place the message to be signed here')}
                titleLabel={t('Message Signed correctly 🙌🏽')}
                subtitleLabel={t('Here are the details of the signature')}
                paragraph1TitleLabel={t('Signature String 🖋 ')}
                paragraph2TitleLabel={t('Signed Message ✉️')}
                signButtonLabel={t('Sign')}
                doneButtonLabel={t('Done')}
              />
            }
          />
          <Route
            path={menuRoute[VERIFY_SIGNATURE]}
            element={
              <VerifySignatureCard
                {...props}
                pubKeyTitleLabel={t('Public Key')}
                pubKeyInputPlaceholder={t('Paste your public key here')}
                messageTitleLabel={t('Original Message')}
                messageInputPlaceholder={t('Place the original message here')}
                signatureTitleLabel={t('Signature String')}
                signatureInputPlaceholder={t('Place the signature string here')}
                titleLabel={t('Signature Verified Correctly 🙌🏽')}
                subtitleLabel={t(
                  'The message was successfully verified using the public key below',
                )}
                paragraph1TitleLabel={t('Public Key 🔑')}
                paragraph2TitleLabel={t('Original Message ✉️')}
                verifyButtonLabel={t('Verify')}
                doneButtonLabel={t('Done')}
              />
            }
          />
        </Routes>
      </Box>
    </Router>
  );
};

export default AppRoutes;
