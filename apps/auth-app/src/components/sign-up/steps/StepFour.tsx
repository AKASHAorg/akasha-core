import * as React from 'react';
import DS from '@akashaproject/design-system';
import { useSignUp } from '@akashaproject/ui-awf-hooks/lib/use-login';
import { PROVIDER_ERROR_CODES } from '@akashaproject/sdk-typings/lib/interfaces/common';
import { EthProviders } from '@akashaproject/sdk-typings/lib/interfaces';

import { StyledButton, StyledBox } from './styles';
import { useTranslation } from 'react-i18next';

const { Box, Text, WalletRequestStep, Icon } = DS;

export interface IStepFourProps {
  textExplanation: string;
  textExplanationOpenLogin: string;
  textExplanationBold: string;
  textPacify: string;
  textPacifyBold: string;
  textChooseAddress: string;
  textChooseAddressExplanation: string;
  textButtonSelect: string;
  textCreateSignIn: string;
  textCreateSignInExplanation: string;
  textCreateSecure: string;
  textCreateSecureExplanation: string;
  textCreateProfile: string;
  textCreateProfileExplanation: string;
  textAddressComplete: string;
  textSignInComplete: string;
  textSecureComplete: string;
  textProfileComplete: string;
  textCompleted: string;
  textButtonSignInWallet: string;
  textRequestProblem: string;
  textRequestResend: string;
  textAgain: string;
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
    textCreateSignIn,
    textCreateSignInExplanation,
    textCreateSecure,
    textCreateSecureExplanation,
    textCreateProfile,
    textCreateProfileExplanation,
    textAddressComplete,
    textSignInComplete,
    textSecureComplete,
    textProfileComplete,
    textCompleted,
    textButtonSignInWallet,
    textRequestProblem,
    textRequestResend,
    textAgain,
    buttonLabel,
    onButtonClick,
    providerConnected,
    provider,
    requiredNetworkName,
  } = props;
  const { ethAddress, fullSignUp, signUpState, error, fireRemainingMessages } = useSignUp(provider);
  const { t } = useTranslation();

  React.useEffect(() => {
    fullSignUp.mutate();
  }, []);

  const isOpenLogin = providerConnected && provider === EthProviders.Torus;
  const errorMessage = React.useMemo(() => {
    if (error && error.code && errorMapping[error.code]) {
      return t(errorMapping[error.code], { requiredNetworkName });
    }
    return error.message
      ? error.message
      : t('An unknown error has occurred. Please refresh the page and try again.');
  }, [error, requiredNetworkName]);

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
          walletRequest={fireRemainingMessages}
          ethAddress={ethAddress}
          textAgain={textAgain}
          pending={signUpState === REQUEST_STEPS.ONE}
          completed={signUpState > REQUEST_STEPS.ONE || isOpenLogin}
          error={signUpState === REQUEST_STEPS.ONE && errorMessage}
        />
        <WalletRequestStep
          heading={textCreateSignIn}
          explanation={textCreateSignInExplanation}
          problem={textRequestProblem}
          resend={textRequestResend}
          complete={textSignInComplete}
          buttonLabel={textButtonSignInWallet}
          walletRequest={fireRemainingMessages}
          textAgain={textAgain}
          pending={signUpState === REQUEST_STEPS.TWO}
          completed={signUpState > REQUEST_STEPS.TWO || isOpenLogin}
          error={signUpState === REQUEST_STEPS.TWO && errorMessage}
        />
        <WalletRequestStep
          heading={textCreateSecure}
          explanation={textCreateSecureExplanation}
          problem={textRequestProblem}
          resend={textRequestResend}
          complete={textSecureComplete}
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
              onClick={onButtonClick}
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
