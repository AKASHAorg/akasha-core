import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useGetLogin, useRootComponentProps } from '@akashaorg/ui-awf-hooks';

import { ONBOARDING_STATUS } from './intro-card';

import {
  TermsAndConditions,
  DownloadCLITool,
  GenerateMessage,
  KeyConfirmation,
} from '../components/onboarding';

import menuRoute, {
  DASHBOARD,
  ONBOARDING,
  ONBOARDING_STEP_FOUR,
  ONBOARDING_STEP_ONE,
  ONBOARDING_STEP_THREE,
  ONBOARDING_STEP_TWO,
} from '../routes';

type DevDashOnboardingStepsProps = {
  activeIndex?: number;
};

export const DevDashOnboardingSteps: React.FC<DevDashOnboardingStepsProps> = props => {
  const { baseRouteName, getRoutingPlugin } = useRootComponentProps();

  const navigateTo = getRoutingPlugin().navigateTo;

  const [activeIndex, setActiveIndex] = useState<number>(props.activeIndex || 0);
  const [messageName] = useState<string>('');
  const [message] = useState<string>('');

  const loginQuery = useGetLogin();

  const { t } = useTranslation('app-dev-dashboard');

  const validateMutation = { isSuccess: false, data: null, isError: false, error: null };

  // @TODO: needs update
  const addKeyMutation = {
    isSuccess: false,
    data: null,
    isError: false,
    error: null,
    mutate: _args => _args,
  };

  const pathnameArr = [
    ONBOARDING_STEP_ONE,
    ONBOARDING_STEP_TWO,
    ONBOARDING_STEP_THREE,
    ONBOARDING_STEP_FOUR,
  ].map(el => `${baseRouteName}${menuRoute[el]}`);

  useEffect(() => {
    if (!loginQuery.data?.id) {
      // if guest, redirect to onboarding step 1 after authentication
      navigateTo?.({
        appName: '@akashaorg/app-auth-ewa',
        getNavigationUrl: (routes: Record<string, string>) => {
          return `${routes.Connect}?${new URLSearchParams({
            redirectTo: `${baseRouteName}${menuRoute[ONBOARDING_STEP_ONE]}`,
          }).toString()}`;
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const idx = pathnameArr.indexOf(location.pathname);
    if (idx === -1) {
      return setActiveIndex(0);
    }
    setActiveIndex(idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    // add key after validating
    if (validateMutation.isSuccess && validateMutation.data?.body?.aud === loginQuery.data?.id) {
      addKeyMutation.mutate({ message, messageName });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validateMutation.isSuccess]);

  const isOnboarded = useMemo(() => {
    return Boolean(window.localStorage.getItem(ONBOARDING_STATUS));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stepLabels = [
    'terms_and_conditions',
    'download_cli_tool',
    'sign_message',
    'key_confirmation',
  ];

  const handleClick = (step: string) => () => {
    navigateTo?.({
      appName: '@akashaorg/app-dev-dashboard',
      getNavigationUrl: () => menuRoute[step],
    });
  };

  const handleCTAClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-akasha-verse',
      getNavigationUrl: (routes: Record<string, string>) => routes.explore,
    });
  };

  const handleFinishOnboarding = () => {
    // set key to local storage
    window.localStorage.setItem(ONBOARDING_STATUS, 'completed');

    // navigate to developer profile
    navigateTo?.({
      appName: '@akashaorg/app-dev-dashboard',
      getNavigationUrl: () => menuRoute[DASHBOARD],
    });
  };

  if (isOnboarded) {
    // if user has been onboarded, navigate to home
    return navigateTo?.({
      appName: '@akashaorg/app-dev-dashboard',
      getNavigationUrl: () => menuRoute[DASHBOARD],
    });
  }

  return (
    <>
      {activeIndex === 0 && (
        <TermsAndConditions
          stepLabels={stepLabels}
          activeIndex={activeIndex}
          titleLabel={t("Developer's Terms & Conditions")}
          introLabel={t('First things first ✨')}
          subtitleLabel={t(
            "To form a part of ethereum world's developer community you need to accept a few conditions, please make sure to read them carefully 😸",
          )}
          paragraphs={[
            t(
              'You are entitled to create apps on EW and have all necessary licenses and consents to do so.',
            ),
            t(
              'The Applications do not invade any intellectual property right, including without limitation copyright, patent or trademark of any third party.',
            ),
            t(
              'The Applications do not contain any defamatory, libelous, offensive, indecent or otherwise unlawful material which is an invasion of privacy.',
            ),
            t(
              'The Applications will not be used to solicit or promote business or custom or present commercial activities or unlawful activity.',
            ),
          ]}
          cancelButtonLabel={t('Reject')}
          confirmButtonLabel={t(' I Accept')}
          onCancelButtonClick={handleClick(ONBOARDING)}
          onConfirmButtonClick={handleClick(ONBOARDING_STEP_TWO)}
        />
      )}
      {activeIndex === 1 && (
        <DownloadCLITool
          stepLabels={stepLabels}
          activeIndex={activeIndex}
          titleLabel={t('Generating Your First Message')}
          introLabel={t('To generate your first message you need to install the CLI tool')}
          subtitleLabel={t(
            'if you have installed the CLI tool and generated your key already, you can skip this step',
          )}
          ctaListItem={[t('Install'), t('CLI tool'), t('from the AKASHAVerse.')]}
          paragraphs={[
            // t('Once installed, open it and write the following command.'),
            t(
              'At the prompt, specify the kind of token you want, or press Enter to accept the default.',
            ),
            t(
              'At the prompt, specify the key size you want, or press Enter to accept the default. Your key must be at least 4096 bits.',
            ),
            t('Verify that your selections are correct.'),
            t('Enter your user ID information.'),
          ]}
          cancelButtonLabel={t('Skip')}
          confirmButtonLabel={t("I'm ready!")}
          onCTAClick={handleCTAClick}
          onCancelButtonClick={handleClick(ONBOARDING_STEP_THREE)}
          onConfirmButtonClick={handleClick(ONBOARDING_STEP_THREE)}
        />
      )}
      {activeIndex === 2 && (
        <GenerateMessage
          stepLabels={stepLabels}
          activeIndex={activeIndex}
          titleLabel={t('Generating Your First Message')}
          ctaIntroLabel={[
            t('Make sure that you have generated a message from the CLI tool, if not, you can go'),
            t('back'),
            t('for further instructions'),
          ]}
          messageNameTitleLabel={t('Message name')}
          messageNameInputPlaceholder={t('Give your message a name (optional)')}
          messageTitleLabel={t('Message')}
          messageInputPlaceholder={t('Paste the generated message here')}
          validationStatus={{
            isError: validateMutation.isError,
            errorMessage: t('{{error}}', { error: validateMutation.error?.message || '' }),
          }}
          confirmButtonLabel={t('Validate Message')}
          onCTAClick={handleClick(ONBOARDING_STEP_TWO)}
          onConfirmButtonClick={handleClick(ONBOARDING_STEP_FOUR)}
        />
      )}
      {activeIndex === 3 && (
        <KeyConfirmation
          stepLabels={stepLabels}
          activeIndex={activeIndex}
          titleLabel={t('Key Confirmation')}
          subtitleLabel={t('Please confirm your key before you add it')}
          assetName="key-confirmation"
          nonameLabel={t('Unnamed Key')}
          unusedLabel={t('Unused')}
          usedLabel={t('Used')}
          pendingConfirmationLabel={t('Pending Confirmation')}
          devPubKeyLabel={t('Dev Public Key 🔑')}
          dateAddedLabel={t('Date added 🗓')}
          confirmButtonLabel={t('Confirm')}
          onConfirmButtonClick={handleFinishOnboarding}
        />
      )}
    </>
  );
};
