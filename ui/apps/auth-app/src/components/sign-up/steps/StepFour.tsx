import * as React from 'react';
import { useTranslation } from 'react-i18next';
import DS from '@akashaorg/design-system';
import { PROVIDER_ERROR_CODES, EthProviders } from '@akashaorg/typings/sdk';
import { useAnalytics, useCheckSignup, useSignUp } from '@akashaorg/ui-awf-hooks';
import { AnalyticsCategories } from '@akashaorg/typings/ui';

import { StyledButton, StyledBox } from './styles';
import routes, { SIGN_IN } from '../../../routes';

const { Box, Text, WalletRequestStep, Icon, CTAAnchor } = DS;

export interface IStepFourProps {
  textExplanation: string;
  textExplanationOpenLogin: string;
  textExplanationBold: string;
  textPacify: string;
  textPacifyBold: string;
  textChooseAddress: string;
  textChooseAddressExplanation: string;
  textButtonSelect: string;
  textVerifyOwnership: string;
  textVerifyOwnershipExplanation: string;
  textGetAccess: string;
  textGetAccessExplanation: string;
  textCreateProfile: string;
  textCreateProfileExplanation: string;
  textAddressComplete: string;
  textVerifyOwnershipComplete: string;
  textGetAccessComplete: string;
  textProfileComplete: string;
  textCompleted: string;
  textButtonSignInWallet: string;
  textRequestProblem: string;
  textRequestResend: string;
  textAgain: string;
  textSuggestSignIn: string;
  textSuggestSignInLink: string;
  buttonLabel: string;
  onButtonClick: () => void;
  providerConnected: boolean;
  provider: EthProviders;
  requiredNetworkName: string;
}

interface ExplanationProps {
  isOpenLogin: boolean;
  textExplanationOpenLogin: string;
  textExplanationBold: string;
  textExplanation: string;
  textPacifyBold: string;
  textPacify: string;
}

const REQUEST_STEPS = {
  ONE: 1,
  TWO: 3,
  THREE: 5,
  FOUR: 7,
};

const Explanation = ({
  isOpenLogin,
  textExplanationOpenLogin,
  textExplanationBold,
  textExplanation,
  textPacifyBold,
  textPacify,
}: ExplanationProps) => {
  if (isOpenLogin) {
    return <Text size="large">{textExplanationOpenLogin}</Text>;
  }
  return (
    <>
      <Text margin={{ bottom: 'large' }}>
        <Text size="large" weight="bold">
          {textExplanationBold}.
        </Text>{' '}
        <Text size="large">{textExplanation}.</Text>
      </Text>
      <Text margin={{ bottom: 'large' }}>
        <Text size="large" weight="bold">
          {textPacifyBold}.
        </Text>{' '}
        <Text size="large">{textPacify}.</Text>
      </Text>
    </>
  );
};

const errorMapping = {
  [PROVIDER_ERROR_CODES.UserRejected]:
    'You have declined the signature request. You will not be able to proceed unless you accept all signature requests.',
  [PROVIDER_ERROR_CODES.WrongNetwork]:
    'Ethereum World only works with the {{requiredNetworkName}} test network. Please set your network to ${requiredNetworkName} to continue.',
  [PROVIDER_ERROR_CODES.RequestTimeout]:
    'The signature request has timed out. Please try again to sign the request.',
};

const StepFour: React.FC<IStepFourProps> = props => {
  const {
    textExplanation,
    textExplanationOpenLogin,
    textExplanationBold,
    textPacify,
    textPacifyBold,
    textChooseAddress,
    textChooseAddressExplanation,
    textButtonSelect,
    textVerifyOwnership,
    textVerifyOwnershipExplanation,
    textGetAccess,
    textGetAccessExplanation,
    textCreateProfile,
    textCreateProfileExplanation,
    textAddressComplete,
    textVerifyOwnershipComplete,
    textGetAccessComplete,
    textProfileComplete,
    textCompleted,
    textButtonSignInWallet,
    textRequestProblem,
    textRequestResend,
    textAgain,
    textSuggestSignIn,
    textSuggestSignInLink,
    buttonLabel,
    onButtonClick,
    providerConnected,
    provider,
    requiredNetworkName,
  } = props;
  const [analyticsActions] = useAnalytics();
  const { ethAddress, connectWallet, signUpState, error, fireRemainingMessages } = useSignUp(
    provider,
    false,
    analyticsActions,
  );
  const checkSignupQuery = useCheckSignup(ethAddress);
  const [suggestSignIn, setSuggestSignIn] = React.useState(false);

  const { t } = useTranslation('app-auth-ewa');
  const tRef = React.useRef(t);
  const fireRemainingMessagesRef = React.useRef(fireRemainingMessages);

  React.useEffect(() => {
    connectWallet.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (checkSignupQuery.data === false) fireRemainingMessagesRef.current();
    if (checkSignupQuery.data === true) {
      // profile already exists
      analyticsActions.trackEvent({
        category: AnalyticsCategories.SIGN_UP,
        action: 'Existing Profile',
      });
      setSuggestSignIn(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkSignupQuery.data]);

  const isOpenLogin = providerConnected && provider === EthProviders.Torus;
  const errorMessage = React.useMemo(() => {
    if (error && error.code && errorMapping[error.code]) {
      return tRef.current(errorMapping[error.code], { requiredNetworkName });
    } else if (error) {
      return error.message
        ? error.message
        : tRef.current('An unknown error has occurred. Please refresh the page and try again.');
    }
  }, [error, requiredNetworkName]);

  const handleButtonClick = () => {
    analyticsActions.trackEvent({
      category: AnalyticsCategories.SIGN_UP_WALLET,
      action: 'Step 4 Completed',
    });
    onButtonClick();
  };

  if (suggestSignIn) {
    return (
      <Text>
        <Text size="large">{textSuggestSignIn}</Text>{' '}
        <CTAAnchor size="large" href={routes[SIGN_IN]} label={textSuggestSignInLink} />
        <Text size="large">?</Text>
      </Text>
    );
  }

  return (
    <>
      <Explanation
        isOpenLogin={isOpenLogin}
        textExplanation={textExplanation}
        textExplanationOpenLogin={textExplanationOpenLogin}
        textExplanationBold={textExplanationBold}
        textPacify={textPacify}
        textPacifyBold={textPacifyBold}
      />
      <Box direction="column" pad={{ bottom: '1rem' }}>
        <WalletRequestStep
          heading={textChooseAddress}
          explanation={textChooseAddressExplanation}
          problem={textRequestProblem}
          resend={textRequestResend}
          complete={textAddressComplete}
          buttonLabel={textButtonSelect}
          walletRequest={connectWallet.mutateAsync}
          ethAddress={ethAddress}
          textAgain={textAgain}
          pending={signUpState === REQUEST_STEPS.ONE}
          completed={signUpState > REQUEST_STEPS.ONE || isOpenLogin}
          error={signUpState === REQUEST_STEPS.ONE && errorMessage}
        />
        <WalletRequestStep
          heading={textVerifyOwnership}
          explanation={textVerifyOwnershipExplanation}
          problem={textRequestProblem}
          resend={textRequestResend}
          complete={textVerifyOwnershipComplete}
          buttonLabel={textButtonSignInWallet}
          walletRequest={fireRemainingMessages}
          textAgain={textAgain}
          pending={signUpState === REQUEST_STEPS.TWO}
          completed={signUpState > REQUEST_STEPS.TWO || isOpenLogin}
          error={signUpState === REQUEST_STEPS.TWO && errorMessage}
        />
        <WalletRequestStep
          heading={textGetAccess}
          explanation={textGetAccessExplanation}
          problem={textRequestProblem}
          resend={textRequestResend}
          complete={textGetAccessComplete}
          buttonLabel={textButtonSignInWallet}
          walletRequest={fireRemainingMessages}
          textAgain={textAgain}
          pending={signUpState === REQUEST_STEPS.THREE}
          completed={signUpState > REQUEST_STEPS.THREE || isOpenLogin}
          error={signUpState === REQUEST_STEPS.THREE && errorMessage}
        />
        <WalletRequestStep
          heading={textCreateProfile}
          explanation={textCreateProfileExplanation}
          problem={textRequestProblem}
          resend={textRequestResend}
          complete={textProfileComplete}
          buttonLabel={textButtonSignInWallet}
          walletRequest={fireRemainingMessages}
          textAgain={textAgain}
          pending={signUpState === REQUEST_STEPS.FOUR}
          completed={signUpState > REQUEST_STEPS.FOUR}
          error={signUpState === REQUEST_STEPS.FOUR && errorMessage}
        />
      </Box>
      {signUpState > REQUEST_STEPS.FOUR && (
        <>
          <Text size="large" margin={{ vertical: 'medium' }}>
            {textCompleted}
          </Text>
          <StyledBox
            align="flex-end"
            justify="center"
            margin={{ top: 'small' }}
            pad={{ top: 'medium' }}
            border={{ side: 'top', color: 'border', size: 'xsmall' }}
          >
            <StyledButton
              icon={<Icon type="arrowRight" color="white" />}
              label={buttonLabel}
              onClick={handleButtonClick}
              primary
              reverse
            />
          </StyledBox>
        </>
      )}
    </>
  );
};

export { StepFour };
