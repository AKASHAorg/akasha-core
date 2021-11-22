import { Box, Text } from 'grommet';
import React from 'react';
import Icon from '../Icon';
import { StyledArrowIcon, StyledBox, StyledCheckmarkIcon, StyledIcon } from './styles';

export interface WalletRequestStepProps {
  heading: string;
  explanation: string;
  problem: string;
  resend: string;
  complete: string;
  textDeclinedError: string;
  textTimeoutError: string;
  textNetworkError: string;
  textAgain: string;
  buttonLabel: string;
  walletRequest: () => Promise<any>;
  nextStep: () => void;
  step: number;
  currentStep: number;
}

const WalletRequestStep = (props: WalletRequestStepProps) => {
  const {
    heading,
    explanation,
    buttonLabel,
    walletRequest,
    nextStep,
    step,
    currentStep,
    complete,
    textDeclinedError,
    textTimeoutError,
    textNetworkError,
    textAgain,
    resend,
    problem,
  } = props;
  const [loading, setLoading] = React.useState(false); // mock
  const [error, setError] = React.useState(null); // mock
  const errors = [textDeclinedError, textTimeoutError, textNetworkError]; // mock

  const onButtonClick = async () => {
    setLoading(true);
    await walletRequest();
    setLoading(false);
    const isError = Math.random() > 0.5;
    if (isError) {
      return setError(errors[Math.floor(Math.random() * 3)]); // mock
    }
    setError(null);
    nextStep();
  };

  const renderIcon = () => {
    if (loading)
      return (
        <StyledIcon justify="center" align="center">
          <Icon type="loading" size="md" accentColor />
        </StyledIcon>
      );

    if (error) {
      return (
        <StyledIcon>
          <Icon type="error" size="md" color="red" />
        </StyledIcon>
      );
    }
    return (
      <StyledArrowIcon justify="center" align="center">
        <Icon type="arrowRight" />
      </StyledArrowIcon>
    );
  };

  if (currentStep > step) {
    return (
      <Box direction="row" align="center" pad="xsmall">
        <StyledCheckmarkIcon justify="center" align="center">
          <Icon type="checkSimple" color="green" size="xxs" />
        </StyledCheckmarkIcon>
        <Text margin={{ horizontal: '0.75rem' }} size="large">
          {complete}
        </Text>
      </Box>
    );
  }

  if (currentStep < step) {
    return (
      <Box direction="row" align="center" pad="xsmall">
        <Icon type="circleDashed" />
        <Text color="gray" size="large" margin={{ horizontal: '0.75rem' }}>
          {heading}
        </Text>
      </Box>
    );
  }

  return (
    <Box direction="row" pad="xsmall">
      {renderIcon()}
      <Box direction="column" pad={{ horizontal: 'small', vertical: 'xxsmall' }} fill>
        <Text margin={{ bottom: 'xsmall' }} weight="bold" size="large">
          {heading}
        </Text>
        <Text size="large">{explanation}</Text>
        {!loading && (
          <>
            <StyledBox
              onClick={onButtonClick}
              justify="between"
              direction="row"
              margin={{ top: 'medium' }}
              error={error}
              fill
            >
              <Text size="large" color={error ? 'red' : 'accent'}>
                {error ? textAgain : buttonLabel}
              </Text>
              <Icon size="sm" type="arrowRight" color={error ? 'red' : 'accent'} />
            </StyledBox>
            {error && (
              <Text color="red" margin={{ top: 'xxsmall' }}>
                {error}
              </Text>
            )}
          </>
        )}
        {loading && (
          <Text margin={{ top: 'medium', bottom: 'xxsmall' }}>
            <Text color="gray">{problem}</Text>{' '}
            <Text color="accent" style={{ cursor: 'pointer' }} onClick={onButtonClick}>
              {resend}
            </Text>
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default WalletRequestStep;
