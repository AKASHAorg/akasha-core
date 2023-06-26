import React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { RootComponentProps } from '@akashaorg/typings/ui';
import { useGetLogin } from '@akashaorg/ui-awf-hooks';

import Helmet from '@akashaorg/design-system-core/lib/components/Helmet';

import EditMessageName from './profile/edit-message-name';
import PublishedAppsCard from './profile/published-apps';
import SignMessageCard from './profile/sign-message';
import VerifySignatureCard from './profile/verify-signature';
import {
  AddDevKey,
  DevDashOnboardingIntro,
  DevDashOnboardingSteps,
  DevDashboard,
  DevKeysCard,
} from '../pages';

import routes, {
  ONBOARDING,
  DASHBOARD,
  ONBOARDING_STEP_ONE,
  ONBOARDING_STEP_TWO,
  ONBOARDING_STEP_THREE,
  ONBOARDING_STEP_FOUR,
  DEV_KEYS,
  ADD_DEV_KEY,
  PUBLISHED_APPS,
  SIGN_MESSAGE,
  VERIFY_SIGNATURE,
  EDIT_MESSAGE_NAME,
} from '../routes';

const AppRoutes = (props: RootComponentProps) => {
  const { baseRouteName, plugins } = props;

  const navigateTo = plugins['@akashaorg/app-routing']?.routing.navigateTo;

  const { t } = useTranslation('app-dev-dashboard');

  const loginQuery = useGetLogin();

  const handleOnboardingCTAClick = () => {
    // if logged in, navigate to step 1
    if (loginQuery.data?.id) {
      return navigateTo?.({
        appName: '@akashaorg/app-dev-dashboard',
        getNavigationUrl: () => routes[ONBOARDING_STEP_ONE],
      });
    }

    /**
     * if guest, redirect to onboarding step 1 after authentication
     */
    navigateTo?.({
      appName: '@akashaorg/app-auth-ewa',
      getNavigationUrl: (routes: Record<string, string>) => {
        return `${routes.Connect}?${new URLSearchParams({
          redirectTo: `${baseRouteName}${routes[ONBOARDING_STEP_ONE]}`,
        }).toString()}`;
      },
    });
  };

  return (
    <Router basename={baseRouteName}>
      <Helmet>
        <title>Dev Dashboard | Ethereum World</title>
      </Helmet>

      <Routes>
        <Route path="/" element={<Navigate to={routes[DASHBOARD]} replace />} />

        <Route path={routes[DASHBOARD]} element={<DevDashboard {...props} />} />

        <Route
          path={routes[ONBOARDING]}
          element={
            <DevDashOnboardingIntro
              titleLabel={t('Developer Dashboard')}
              introLabel={t('✨ Your journey begins here ✨')}
              descriptionLabel={t(
                'Welcome to our vibrant community of developers! Get ready to embark on an exciting journey where you can unleash your creativity and contribute to making the AKASHA World an even better place. Join us now and start building and publishing incredible applications that will shape the future.',
              )}
              ctaButtonLabel={t('Unleash your creativity')}
              onCTAButtonClick={handleOnboardingCTAClick}
            />
          }
        />

        {[
          routes[ONBOARDING_STEP_ONE],
          routes[ONBOARDING_STEP_TWO],
          routes[ONBOARDING_STEP_THREE],
          routes[ONBOARDING_STEP_FOUR],
        ].map((path, idx) => (
          <Route
            key={path}
            path={path}
            element={<DevDashOnboardingSteps {...props} activeIndex={idx} />}
          />
        ))}

        <Route
          path={routes[DEV_KEYS]}
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
              editable={true}
            />
          }
        />

        <Route path={routes[ADD_DEV_KEY]} element={<AddDevKey {...props} />} />

        <Route path={routes[EDIT_MESSAGE_NAME]} element={<EditMessageName {...props} />} />

        <Route path={routes[PUBLISHED_APPS]} element={<PublishedAppsCard {...props} />} />

        <Route
          path={routes[SIGN_MESSAGE]}
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
          path={routes[VERIFY_SIGNATURE]}
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
              subtitleLabel={t('The message was successfully verified using the public key below')}
              paragraph1TitleLabel={t('Public Key 🔑')}
              paragraph2TitleLabel={t('Original Message ✉️')}
              verifyButtonLabel={t('Verify')}
              doneButtonLabel={t('Done')}
            />
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
