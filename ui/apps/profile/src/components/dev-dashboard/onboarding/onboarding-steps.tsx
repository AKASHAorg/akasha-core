import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { RootComponentProps, StepStatus } from '@akashaorg/typings/ui';
import {
  useGetLogin,
  useGetProfile,
  useValidateMessage,
  useAddDevKeyFromMessage,
  useGetDevKeys,
} from '@akashaorg/ui-awf-hooks';

import StepOne from './step-one';
import StepTwo from './step-two';
import StepThree from './step-three';
import StepFour from './step-four';
import { ONBOARDING_STATUS } from './intro-card';

import menuRoute, {
  DEV_DASHBOARD,
  ONBOARDING,
  ONBOARDING_STEP_FOUR,
  ONBOARDING_STEP_ONE,
  ONBOARDING_STEP_THREE,
  ONBOARDING_STEP_TWO,
} from '../../../routes';

const { SteppedActionCard } = DS;

export type devKey = {
  pubKey: string;
  name?: string;
  addedAt: string;
  usedAt?: string;
};

interface IDevDashOnboardingStepsProps {
  activeIndex?: number;
}

const DevDashOnboardingSteps: React.FC<
  RootComponentProps & IDevDashOnboardingStepsProps
> = props => {
  const { plugins } = props;

  const [activeIndex, setActiveIndex] = React.useState<number>(props.activeIndex || 0);
  const [messageName, setMessageName] = React.useState<string>('');
  const [message, setmessage] = React.useState<string>('');
  const [status, setStatus] = React.useState<string | null>(null);
  const [devKeys, setDevKeys] = React.useState([]);

  const loginQuery = useGetLogin();
  const loggedProfileQuery = useGetProfile(loginQuery.data?.pubKey);
  const { t } = useTranslation('app-profile');

  const validateQuery = useValidateMessage(message, status === StepStatus.VALIDATING);

  const addKeyQuery = useAddDevKeyFromMessage(
    { message, messageName },
    status === StepStatus.ADDING_KEY,
  );

  const getKeysQuery = useGetDevKeys(status === StepStatus.GETTING_KEYS);

  const pathnameArr = [
    ONBOARDING_STEP_ONE,
    ONBOARDING_STEP_TWO,
    ONBOARDING_STEP_THREE,
    ONBOARDING_STEP_FOUR,
  ].map(el => `${props.baseRouteName}${menuRoute[el]}`);

  React.useEffect(() => {
    if (!loggedProfileQuery.data?.pubKey) {
      // if guest, redirect to onboarding step 1 after authentication
      plugins['@akashaorg/app-routing']?.routing.navigateTo?.({
        appName: '@akashaorg/app-auth-ewa',
        getNavigationUrl: (routes: Record<string, string>) => {
          return `${routes.SignIn}?${new URLSearchParams({
            redirectTo: `${props.baseRouteName}${menuRoute[ONBOARDING_STEP_ONE]}`,
          }).toString()}`;
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const idx = pathnameArr.indexOf(location.pathname);
    if (idx === -1) {
      return setActiveIndex(0);
    }
    setActiveIndex(idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  React.useEffect(() => {
    // add key after validating
    if (
      validateQuery.isFetched &&
      validateQuery.data?.body?.aud === loggedProfileQuery.data?.pubKey
    ) {
      setStatus(StepStatus.ADDING_KEY);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validateQuery.data]);

  React.useEffect(() => {
    if (addKeyQuery.isFetched) {
      setStatus(StepStatus.GETTING_KEYS);
    }
  }, [addKeyQuery.isFetched]);

  React.useEffect(() => {
    if (getKeysQuery.isFetched) {
      Promise.resolve(getKeysQuery.data).then(keys => setDevKeys(keys as any));

      // on success, navigate to the confirmation screen
      return plugins['@akashaorg/app-routing']?.routing.navigateTo({
        appName: '@akashaorg/app-profile',
        getNavigationUrl: () => menuRoute[ONBOARDING_STEP_FOUR],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getKeysQuery.isFetched]);

  const isOnboarded = React.useMemo(() => {
    return window.localStorage.getItem(ONBOARDING_STATUS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleIconClick = () => {
    plugins['@akashaorg/app-routing']?.routing?.navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => menuRoute[ONBOARDING],
    });
  };

  const handleClick = (step: string) => () => {
    plugins['@akashaorg/app-routing']?.routing.navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => menuRoute[step],
    });
  };

  const handleCTAClick = () => {
    plugins['@akashaorg/app-routing']?.routing?.navigateTo({
      appName: '@akashaorg/app-integration-center',
      getNavigationUrl: (routes: Record<string, string>) => routes.explore,
    });
  };

  const handleMessageNameInputChange = ev => {
    setMessageName(ev.target.value);
  };

  const handleMessageInputChange = ev => {
    setmessage(ev.target.value);
  };

  const handleValidateMessage = () => {
    setStatus(StepStatus.VALIDATING);
  };

  const handleCopy = (value: string) => () => {
    navigator.clipboard.writeText(value);
  };

  const handleFinishOnboarding = () => {
    // set key to local storage
    window.localStorage.setItem(ONBOARDING_STATUS, 'completed');

    // navigate to developer profile
    plugins['@akashaorg/app-routing']?.routing.navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => menuRoute[DEV_DASHBOARD],
    });
  };

  if (isOnboarded) {
    // if user has been onboarded, navigate to home
    return plugins['@akashaorg/app-routing']?.routing.navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => menuRoute[DEV_DASHBOARD],
    });
  }

  return (
    <SteppedActionCard
      titleLabel={t('EW Developer')}
      activeIndex={activeIndex}
      bottomMargin="small"
      stepLabels={[t('Terms and Conditions'), t('Download CLI tool'), t('Message')]}
      extraStepLabel={t('Dev Key Confirmation')}
      handleIconClick={handleIconClick}
    >
      {activeIndex === 0 && (
        <StepOne
          titleLabel={t('First things first ✨')}
          subtitleLabel={t(
            'To form a part of etheruem world’s developer community you need to accept a few conditions, please make sure to read them carefully 😸',
          )}
          paragraphs={[
            t(
              'You are entitled to create apps on our EW and have all necessary licenses and consents to do so.',
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
          acceptLabel={t('Accept')}
          rejectLabel={t('Reject')}
          onAcceptClick={handleClick(ONBOARDING_STEP_TWO)}
          onRejectClick={handleClick(ONBOARDING)}
        />
      )}
      {activeIndex === 1 && (
        <StepTwo
          titleLabel={t('To generate your first message you need to install the CLI tool')}
          subtitleLabel={t(
            'if you have installed the CLI tool and generated your key already, you can skip this step',
          )}
          ctaListItem={[t('Install'), t('CLI tool'), t('from the integration center.')]}
          paragraphs={[
            t('Once installed, open it and write the following command.'),
            t(
              'At the prompt, specify the kind of token you want, or press Enter to accept the default.',
            ),
            t(
              'At the prompt, specify the key size you want, or press Enter to accept the default. Your key must be at least 4096 bits.',
            ),
            t('Verify that your selections are correct.'),
            t('Enter your user ID information.'),
          ]}
          skipLabel={t('Skip')}
          readyLabel={t("I'm ready")}
          onCTAClick={handleCTAClick}
          onSkipClick={handleClick(ONBOARDING_STEP_THREE)}
          onReadyClick={handleClick(ONBOARDING_STEP_THREE)}
        />
      )}
      {activeIndex === 2 && (
        <StepThree
          ctaIntroLabel={[
            t('Make sure that you have generated a message from the CLI tool, if not, you can go'),
            t('back'),
            t('for further instructions'),
          ]}
          messageNameTitleLabel={t('Message name')}
          messageNameInputPlaceholder={t('Give your message a name (optional)')}
          messageNameValue={messageName}
          messageTitleLabel={t('Message')}
          messageInputPlaceholder={t('Paste the generated message here')}
          messageValue={message}
          validationStatus={{
            isError: validateQuery.isError,
            errorMessage: t('{{error}}', { error: validateQuery.error?.message }),
          }}
          isFetching={validateQuery.isFetching || addKeyQuery.isFetching || getKeysQuery.isFetching}
          buttonLabel={t('Validate Message')}
          onCTAClick={handleClick(ONBOARDING_STEP_TWO)}
          onMessageNameInputChange={handleMessageNameInputChange}
          onMessageInputChange={handleMessageInputChange}
          onButtonClick={handleValidateMessage}
        />
      )}
      {activeIndex === 3 && (
        <StepFour
          titleLabel={t('Key Confirmation')}
          firstKey={{
            ...devKeys[0],
            name: !devKeys[0].name.length ? t('Unnamed key') : devKeys[0].name,
          }}
          unusedLabel={t('Unused')}
          usedLabel={t('Used')}
          pendingConfirmationLabel={t('Pending Confirmation')}
          devPubKeyLabel={t('Dev Public Key 🔑')}
          dateAddedLabel={t('Date added 🗓')}
          paragraphLabel={t('Please confirm your key before you add it')}
          buttonLabel={t('Confirm')}
          onCopyClick={handleCopy}
          onButtonClick={handleFinishOnboarding}
        />
      )}
    </SteppedActionCard>
  );
};

export default DevDashOnboardingSteps;
