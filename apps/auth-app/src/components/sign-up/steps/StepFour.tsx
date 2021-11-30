import * as React from 'react';
import DS from '@akashaproject/design-system';
import { useSignUp } from '@akashaproject/ui-awf-hooks/lib/use-login';
import { PROVIDER_ERROR_CODES } from '@akashaproject/sdk-typings/lib/interfaces/common';
import { EthProviders } from '@akashaproject/sdk-typings/lib/interfaces';

import { StyledButton, StyledBox } from './styles';

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
  textDeclinedError: string;
  textTimeoutError: string;
  textNetworkError: string;
  textAgain: string;
  buttonLabel: string;
  onButtonClick: () => void;
  providerConnected: boolean;
  provider: EthProviders;
}

const REQUEST_STEPS = {
  ONE: 1,
  TWO: 3,
  THREE: 5,
  FOUR: 7,
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
    textDeclinedError,
    textTimeoutError,
    textNetworkError,
    textAgain,
    buttonLabel,
    onButtonClick,
    providerConnected,
    provider,
  } = props;
  const { ethAddress, fullSignUp, signUpState, errorCode, fireRemainingMessages } =
    useSignUp(provider);

  const errorMapping = {
    [PROVIDER_ERROR_CODES.UserRejected]: textDeclinedError,
    [PROVIDER_ERROR_CODES.WrongNetwork]: textNetworkError,
    [PROVIDER_ERROR_CODES.RequestTimeout]: textTimeoutError,
  };

  React.useEffect(() => {
    fullSignUp.mutate();
  }, []);

  const isOpenLogin = providerConnected && provider === EthProviders.Torus;

  const renderExplanation = () => {
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

  return (
    <>
      {renderExplanation()}
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
          error={signUpState === REQUEST_STEPS.ONE && errorMapping[errorCode]}
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
          error={signUpState === REQUEST_STEPS.TWO && errorMapping[errorCode]}
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
          error={signUpState === REQUEST_STEPS.THREE && errorMapping[errorCode]}
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
          error={signUpState === REQUEST_STEPS.FOUR && errorMapping[errorCode]}
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
