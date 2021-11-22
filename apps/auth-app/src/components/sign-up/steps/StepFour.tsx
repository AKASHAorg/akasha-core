import * as React from 'react';
import DS from '@akashaproject/design-system';

const { Box, Text, WalletRequestStep, Button, styled, Icon } = DS;

export interface IStepFourProps {
  textExplanation: string;
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
  injectedProvider: any;
}

const StyledButton = styled(Button)`
  padding: ${props =>
    `${props.theme.shapes.baseSpacing / 16}rem ${(props.theme.shapes.baseSpacing * 2.5) / 16}rem`};
`;

const StepFour: React.FC<IStepFourProps> = props => {
  const {
    textExplanation,
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
    injectedProvider,
  } = props;

  const [currentStep, setCurrentStep] = React.useState(1);
  const nextStep = () => setCurrentStep(prevState => prevState + 1);

  const mockRequest = () => new Promise(resolve => setTimeout(resolve, 2000));

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
      <Box direction="column">
        <WalletRequestStep
          heading={textChooseAddress}
          explanation={textChooseAddressExplanation}
          problem={textRequestProblem}
          resend={textRequestResend}
          complete={textAddressComplete}
          buttonLabel={textButtonSelect}
          walletRequest={mockRequest}
          nextStep={nextStep}
          textDeclinedError={textDeclinedError}
          textTimeoutError={textTimeoutError}
          textNetworkError={textNetworkError}
          textAgain={textAgain}
          step={1}
          currentStep={currentStep}
        />
        <WalletRequestStep
          heading={textCreateSignIn}
          explanation={textCreateSignInExplanation}
          problem={textRequestProblem}
          resend={textRequestResend}
          complete={textSignInComplete}
          buttonLabel={textButtonSignInWallet}
          walletRequest={mockRequest}
          nextStep={nextStep}
          textDeclinedError={textDeclinedError}
          textTimeoutError={textTimeoutError}
          textNetworkError={textNetworkError}
          textAgain={textAgain}
          step={2}
          currentStep={currentStep}
        />
        <WalletRequestStep
          heading={textCreateSecure}
          explanation={textCreateSecureExplanation}
          problem={textRequestProblem}
          resend={textRequestResend}
          complete={textSecureComplete}
          buttonLabel={textButtonSignInWallet}
          walletRequest={mockRequest}
          nextStep={nextStep}
          textDeclinedError={textDeclinedError}
          textTimeoutError={textTimeoutError}
          textNetworkError={textNetworkError}
          textAgain={textAgain}
          step={3}
          currentStep={currentStep}
        />
        <WalletRequestStep
          heading={textCreateProfile}
          explanation={textCreateProfileExplanation}
          problem={textRequestProblem}
          resend={textRequestResend}
          complete={textProfileComplete}
          buttonLabel={textButtonSignInWallet}
          walletRequest={mockRequest}
          nextStep={nextStep}
          textDeclinedError={textDeclinedError}
          textTimeoutError={textTimeoutError}
          textNetworkError={textNetworkError}
          textAgain={textAgain}
          step={4}
          currentStep={currentStep}
        />
      </Box>
      {currentStep === 5 && (
        <>
          <Text size="large" margin={{ vertical: 'medium' }}>
            {textCompleted}
          </Text>
          <Box
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
          </Box>
        </>
      )}
    </>
  );
};

export default StepFour;
