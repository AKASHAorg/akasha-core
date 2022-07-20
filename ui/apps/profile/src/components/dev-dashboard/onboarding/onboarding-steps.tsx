import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { RootComponentProps } from '@akashaorg/ui-awf-typings';

import StepOne from './step-one';
import StepTwo from './step-two';
import StepThree from './step-three';
import StepFour from './step-four';

import menuRoute, {
  baseDeveloperRoute,
  ONBOARDING,
  ONBOARDING_STEP_FOUR,
  ONBOARDING_STEP_ONE,
  ONBOARDING_STEP_THREE,
  ONBOARDING_STEP_TWO,
} from '../../../routes';

const { SteppedActionCard } = DS;

export type tokenDetails = {
  name?: string;
  token: string;
  expiresAt: string;
  isUsed: boolean;
};

interface IDevDashOnboardingStepsProps {
  activeIndex?: number;
}

const DevDashOnboardingSteps: React.FC<
  RootComponentProps & IDevDashOnboardingStepsProps
> = props => {
  const {
    plugins: { routing },
  } = props;

  const [activeIndex, setActiveIndex] = React.useState<number>(props.activeIndex || 0);
  const [messageInputValue, setMessageInputValue] = React.useState<string>('');
  const [tokenNameInputValue, setTokenNameInputValue] = React.useState<string>('');

  const { t } = useTranslation('app-profile');

  const pathnameArr = [
    ONBOARDING_STEP_ONE,
    ONBOARDING_STEP_TWO,
    ONBOARDING_STEP_THREE,
    ONBOARDING_STEP_FOUR,
  ].map(el => `${props.baseRouteName}${menuRoute[el]}`);

  // @TODO: replace with real data
  const sampleTokenDetails: tokenDetails = {
    name: 'My First Token',
    token: '3fLBxdVgUkWj8UjVvUXcIdak5qe5xRRowUDkIuVRRQ',
    expiresAt: '2032-07-20T18:00:00Z',
    isUsed: false,
  };

  React.useEffect(() => {
    const idx = pathnameArr.indexOf(location.pathname);
    if (idx === -1) {
      return setActiveIndex(0);
    }
    setActiveIndex(idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleIconClick = () => {
    routing?.navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => menuRoute[ONBOARDING],
    });
  };

  const handleClick = (step: string) => () => {
    routing.navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => menuRoute[step],
    });
  };

  const handleCTAClick = () => {
    routing?.navigateTo({
      appName: '@akashaorg/app-integration-center',
      getNavigationUrl: (routes: Record<string, string>) => routes.explore,
    });
  };

  const handlemessageInputChange = ev => {
    setMessageInputValue(ev.target.value);
  };

  const handletokenNameInputChange = ev => {
    setTokenNameInputValue(ev.target.value);
  };

  const handleGenerateAccessToken = () => {
    /**
     * interact with API...
     */
    // on success, navigate to the confirmation screen
    routing.navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => menuRoute[ONBOARDING_STEP_FOUR],
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleTokenDetails.token);
  };

  const handleFinishOnboarding = () => {
    // navigate to developer profile
    routing.navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => baseDeveloperRoute,
    });
  };

  return (
    <SteppedActionCard
      titleLabel={t('EW Developer')}
      activeIndex={activeIndex}
      bottomMargin="small"
      stepLabels={[t('Terms and Conditions'), t('Download CLI tool'), t('Message')]}
      extraStepLabel={t('Token Generated')}
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
          messageInputLabel={t('Message')}
          messageInputPlaceholder={t('Paste the generated message here')}
          messageInputValue={messageInputValue}
          tokenNameInputLabel={t('Token Name')}
          tokenNameInputPlaceholder={t('Token Name (optional)')}
          tokenNameInputValue={tokenNameInputValue}
          buttonLabel={t('Generate Access Token')}
          onCTAClick={handleClick(ONBOARDING_STEP_TWO)}
          onmessageInputChange={handlemessageInputChange}
          ontokenNameInputChange={handletokenNameInputChange}
          onButtonClick={handleGenerateAccessToken}
        />
      )}
      {activeIndex === 3 && (
        <StepFour
          titleLabel={t('Congrats you have just created your first token ✨!')}
          tokenDetails={{
            ...sampleTokenDetails,
            name: !sampleTokenDetails.name.length ? t('Unnamed token') : sampleTokenDetails.name,
          }}
          tokenUnUsedLabel={t('Unused')}
          tokenUsedLabel={t('Used')}
          expiresInlabel={t('Expires in')}
          paragraphLabel={t(
            'Please copy the generated token and paste it in the CLI tool to proceedwith the developer profile creation.',
          )}
          buttonLabel={t('Finish')}
          onCopyClick={handleCopy}
          onButtonClick={handleFinishOnboarding}
        />
      )}
    </SteppedActionCard>
  );
};

export default DevDashOnboardingSteps;
